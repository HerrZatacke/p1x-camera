/*!
  Port function taken from here
  https://github.com/webusb/arduino/blob/gh-pages/demos/serial.js
 */

export interface DeviceMessage<T> {
  deviceTimestamp: number,
  messageTimestamp: number,
  message: T,
  captured: boolean,
}

export type MessageCallback<T> = (msg: DeviceMessage<T>) => void

class USBSerialPortEE <T_Message> {
  private device: USBDevice;
  private manufacturerName: string;
  public productName: string;
  public initialized: number;
  private serialNumber: string;
  private interfaceNumber: number;
  private endpointIn: number;
  private endpointOut: number;
  private textDecoder: TextDecoder;
  private captureQueue: MessageCallback<T_Message>[];

  constructor(device: USBDevice) {
    this.device = device;
    this.manufacturerName = device.manufacturerName || '';
    this.productName = device.productName || '';
    this.serialNumber = device.serialNumber || '';

    this.initialized = Date.now();

    this.interfaceNumber = 2; // original interface number of WebUSB Arduino demo
    this.endpointIn = 5; // original in endpoint ID of WebUSB Arduino demo
    this.endpointOut = 4; // original out endpoint ID of WebUSB Arduino demo

    this.textDecoder = new TextDecoder();

    this.captureQueue = [];
  }
  async connect(globalCallback: MessageCallback<T_Message>) {
    await this.device.open();

    await this.device.selectConfiguration?.(1);

    const configurationInterfaces = this.device.configuration?.interfaces;
    if (!configurationInterfaces) {
      return;
    }

    configurationInterfaces.forEach((element) => {
      element.alternates.forEach((elementalt) => {
        if (elementalt.interfaceClass === 0xff) {
          this.interfaceNumber = element.interfaceNumber;
          elementalt.endpoints.forEach((elementendpoint) => {
            if (elementendpoint.direction === 'out') {
              this.endpointOut = elementendpoint.endpointNumber;
            }

            if (elementendpoint.direction === 'in') {
              this.endpointIn = elementendpoint.endpointNumber;
            }
          });
        }
      });
    });

    await this.device.claimInterface(this.interfaceNumber);

    await this.device.selectAlternateInterface(this.interfaceNumber, 0);

    // The vendor-specific interface provided by a device using this
    // Arduino library is a copy of the normal Arduino USB CDC-ACM
    // interface implementation and so reuses some requests defined by
    // that specification. This request sets the DTR (data terminal
    // ready) signal high to indicate to the device that the host is
    // ready to send and receive data.
    await this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: this.interfaceNumber,
    });


    const loop = async () => {
      let messageBuffer = '';
      try {
        while (this.device.opened) {
          // eslint-disable-next-line no-await-in-loop
          const result = await this.device.transferIn(this.endpointIn, 64);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => {
            setTimeout(resolve, 5);
          });

          const response = this.textDecoder.decode(result.data);

          messageBuffer = `${messageBuffer}${response}`;

          const messages = messageBuffer.split('\n');

          messageBuffer = messages.filter((message, index) => {
            // if it's the last message...
            if (index === messages.length - 1) {
              // ... and it contains text, it did not end with \r\n -> keep it.
              return !!message;
            }

            const capture = this.captureQueue.pop();

            const deviceMessage: DeviceMessage<T_Message> = {
              deviceTimestamp: this.initialized,
              messageTimestamp: Date.now() + index,
              message: JSON.parse(message.trim()),
              captured: Boolean(capture),
            };

            // emit all complete messages;
            globalCallback(deviceMessage);

            if (capture) {
              capture(deviceMessage);
            }

            return false;
          }).join('\n');

        }
      } catch (error) {
        console.error(error);
      } finally {
        this.disconnect();
      }
    };

    loop();
  }

  async disconnect() {
    // This request sets the DTR (data terminal ready) signal low to
    // indicate to the device that the host has disconnected.
    await this.device.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber,
    });

    return this.device.close();
  }

  captureNextMessage(): Promise<DeviceMessage<T_Message>> {
    return new Promise((resolve) => {
      this.captureQueue.push(resolve);
    });
  }

  async send(data: Uint8Array, capture: boolean): Promise<DeviceMessage<T_Message> | null> {
    await this.device.transferOut(this.endpointOut, data);
    if (capture) {
      return this.captureNextMessage();
    }

    return null;
  }

  isOpen() {
    return this.device.opened;
  }
}

export default USBSerialPortEE;
