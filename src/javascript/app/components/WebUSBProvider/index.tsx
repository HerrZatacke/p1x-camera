import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { DeviceMessage } from '../../../tools/USBSerialPortEE';
import USBSerialPortEE from '../../../tools/USBSerialPortEE';
import { filters } from './filters';
import type { P1XMessage } from '../../../types/P1X';

export interface WebUSBContextValue {
  activePorts: USBSerialPortEE<P1XMessage>[],
  activePort: USBSerialPortEE<P1XMessage> | null,
  enabled: boolean,
  messages: DeviceMessage<P1XMessage>[],
  requestPort: () => Promise<void>,
  clearMessages: () => void,
}


export const WebUSBContext = createContext<WebUSBContextValue>({
  activePorts: [],
  activePort: null,
  messages: [],
  enabled: false,
  requestPort: () => (Promise.resolve()),
  clearMessages: () => { /**/ },
});

export const useWebUSB = () => useContext(WebUSBContext);

function WebUSBProvider({ children }: PropsWithChildren) {
  const [enabled] = useState<boolean>(!!navigator.usb && !!navigator.usb.getDevices);
  const [activePorts, setActivePorts] = useState<USBSerialPortEE<P1XMessage>[]>([]);
  const [activePort, setActivePort] = useState<USBSerialPortEE<P1XMessage> | null>(null);

  const [messages, setMessages] = useState<DeviceMessage<P1XMessage>[]>([]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const connectDevice = useCallback(async (device: USBDevice): Promise<USBSerialPortEE<P1XMessage>> => {
    const port = new USBSerialPortEE<P1XMessage>(device);
    await port.connect((data: DeviceMessage<P1XMessage>) => {
      setMessages((previousMessages) => ([data, ...previousMessages]));
    });
    return port;
  }, []);

  const refreshPorts = useCallback(async () => {
    if (!enabled) {
      setActivePorts([]);
    }

    const devices = await navigator.usb.getDevices();

    const newDevices = await Promise.all(
      devices
        .filter(({ opened }) => !opened)
        .map(connectDevice),
    );

    setActivePorts((currentPorts) => (
      [
        ...currentPorts.filter((device) => device.isOpen()),
        ...newDevices,
      ]
    ));
  }, [connectDevice, enabled]);

  // Attach eventlistener for when devices are dis/connected
  useEffect(() => {
    const timeout = window.setTimeout(refreshPorts, 100);

    navigator.usb.addEventListener('connect', refreshPorts);
    navigator.usb.addEventListener('disconnect', refreshPorts);

    return () => {
      window.clearTimeout(timeout);
      navigator.usb.removeEventListener('connect', refreshPorts);
      navigator.usb.removeEventListener('disconnect', refreshPorts);
    };
  }, [refreshPorts]);

  const requestPort = useCallback(async (): Promise<void> => {
    if (!enabled) {
      return;
    }

    const device = await navigator.usb.requestDevice({ filters });

    if (device.opened) {
      return;
    }

    const port = await connectDevice(device);

    setActivePorts((currentPorts) => ([...currentPorts, port]));
  }, [connectDevice, enabled]);

  useEffect(() => {
    if (activePorts.length) {
      if (!activePort) {
        setActivePort(activePorts[0]);
      }
    } else {
      setActivePort(null);
    }
  }, [activePort, activePorts]);

  const value = useMemo<WebUSBContextValue>((): WebUSBContextValue => ({
    enabled,
    messages,
    activePorts,
    activePort,
    requestPort,
    clearMessages,
  }), [activePort, activePorts, clearMessages, enabled, messages, requestPort]);

  return (
    <WebUSBContext.Provider value={value}>
      {children}
    </WebUSBContext.Provider>
  );
}

export default WebUSBProvider;
