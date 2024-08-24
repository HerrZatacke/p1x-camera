import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import DataViewChannel from '../DataViewChannel';
import DataViewRGB from '../DataViewRGB';
import type { ChannelGrid } from '../../stores/scannedDataStore';
import useScannedDataStore from '../../stores/scannedDataStore';
import { P1XChannel, p1xChannels } from '../../../types/P1X';
import type { RGBChannels } from '../../hooks/useDataView';

import './index.scss';

interface ChannelProps {
  name: P1XChannel,
  channelGrid: ChannelGrid[],
}

interface ActiveChannels {
  r: P1XChannel[],
  g: P1XChannel[],
  b: P1XChannel[],
}

const channelColors: Record<P1XChannel, string> = {
  [P1XChannel.COLOR_415NM]: '7600ed',
  [P1XChannel.COLOR_445NM]: '0028ff',
  [P1XChannel.COLOR_480NM]: '00d5ff',
  [P1XChannel.COLOR_515NM]: '1fff00',
  [P1XChannel.COLOR_555NM]: 'b3ff00',
  [P1XChannel.COLOR_590NM]: 'ffdf00',
  [P1XChannel.COLOR_630NM]: 'ff4f00',
  [P1XChannel.COLOR_680NM]: 'ff0000',
  [P1XChannel.CLEAR]: 'ffffff',
  [P1XChannel.NIR]: 'd9a4ba',
};

function DataView() {
  const { data } = useScannedDataStore();

  const grids = useMemo<ChannelProps[]>(() => (
    p1xChannels.reduce((acc: ChannelProps[], name): ChannelProps[] => {
      const channelGrid = data[name];
      return channelGrid ? [...acc, { name, channelGrid }] : acc;
    }, [])
  ), [data]);

  const [activeChannels, setActiveChannels] = useState<ActiveChannels>({
    r: [
      P1XChannel.COLOR_630NM,
      P1XChannel.COLOR_680NM,
      P1XChannel.COLOR_590NM,
    ],
    g: [
      P1XChannel.COLOR_555NM,
      P1XChannel.COLOR_515NM,
    ],
    b: [
      P1XChannel.COLOR_480NM,
      P1XChannel.COLOR_445NM,
      P1XChannel.COLOR_415NM,
    ],
  });

  const rgbChannels: RGBChannels = {
    channelR: activeChannels.r.map((channelName): ChannelGrid[] => data[channelName] || []),
    channelG: activeChannels.g.map((channelName): ChannelGrid[] => data[channelName] || []),
    channelB: activeChannels.b.map((channelName): ChannelGrid[] => data[channelName] || []),
  };

  const toggleChannel = useCallback((color: 'r'|'g'|'b', channel: P1XChannel) => {
    setActiveChannels((ac) => {
      const channels = ac[color];
      const active = channels.includes(channel);

      const newChannels = active ? channels.filter((c) => c !== channel) : [...channels, channel];

      return ({
        ...ac,
        [color]: newChannels,
      });
    });
  }, []);

  // <pre>{ JSON.stringify(activeChannels) }</pre>
  return (
    <>
      <div className="data-view">
        { grids.map(({ name, channelGrid }) => (
          <div className="data-view__element" key={name}>
            <h3 className="data-view__title">{ name }</h3>
            <DataViewChannel
              name={name}
              color={channelColors[name]}
              channelGrid={channelGrid}
            />
            <div className="data-view__buttons">
              <button
                type="button"
                className={clsx('data-view__button data-view__button--blue', {
                  'data-view__button--active': activeChannels.b.includes(name),
                })}
                onClick={() => toggleChannel('b', name)}
              />
              <button
                type="button"
                className={clsx('data-view__button data-view__button--green', {
                  'data-view__button--active': activeChannels.g.includes(name),
                })}
                onClick={() => toggleChannel('g', name)}
              />
              <button
                type="button"
                className={clsx('data-view__button data-view__button--red', {
                  'data-view__button--active': activeChannels.r.includes(name),
                })}
                onClick={() => toggleChannel('r', name)}
              />
            </div>

          </div>
        ))}
      </div>
      <DataViewRGB
        channels={rgbChannels}
      />
    </>
  );
}

export default DataView;
