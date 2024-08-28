import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';
import DataViewChannel from '../DataViewChannel';
import DataViewRGB from '../DataViewRGB';
import useScannedDataStore from '../../stores/scannedDataStore';
import { P1XChannel, p1xChannels } from '../../../types/P1X';
import { getMinMax } from '../../../tools/minMax';
import type { RGBChannels } from '../../hooks/useDataView';
import type { MinMax } from '../../../tools/minMax';

import './index.scss';
import useSettingsStore from '../../stores/settingsStore';

interface ChannelProps {
  name: P1XChannel,
  channelData: number[],
  minMax: MinMax,
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
  const { data, dimensions } = useScannedDataStore();

  const channelsData = useMemo<ChannelProps[]>(() => (
    p1xChannels.reduce((acc: ChannelProps[], name): ChannelProps[] => {
      const channelData = data[name];
      const minMax = getMinMax(channelData || []);
      return channelData ? [...acc, { name, channelData, minMax }] : acc;
    }, [])
  ), [data]);

  const { activeChannels, setActiveChannels } = useSettingsStore();

  const toggleChannel = useCallback((color: 'r'|'g'|'b', channel: P1XChannel) => {
    const channels = activeChannels[color];
    const active = channels.includes(channel);

    const newChannels = active ? channels.filter((c) => c !== channel) : [...channels, channel];

    setActiveChannels({
      ...activeChannels,
      [color]: newChannels,
    });
  }, [activeChannels, setActiveChannels]);

  return (
    <div className="data-view">
      { channelsData.map(({ name, channelData, minMax }) => (
        <div className="data-view__element" key={name}>
          <h3 className="data-view__title">{ name }</h3>
          <DataViewChannel
            name={name}
            dimensions={dimensions}
            color={channelColors[name]}
            channelData={channelData}
          />
          <Typography variant="body2">
            { `${minMax.min} to ${minMax.max}` }
          </Typography>
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
  );
}

export default DataView;
