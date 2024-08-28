import React, { useCallback, useMemo } from 'react';
import { Typography, Stack } from '@mui/material';
import DataViewChannel from '../DataViewChannel';
import useScannedDataStore from '../../stores/scannedDataStore';
import useSettingsStore from '../../stores/settingsStore';
import { P1XChannel, p1xChannels } from '../../../types/P1X';
import { getMinMax } from '../../../tools/minMax';
import type { MinMax } from '../../../tools/minMax';
import RGBSwitch from '../RGBSwitch';
import Histogram from '../Histogram';

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

  const setChannel = useCallback((color: 'r'|'g'|'b', channel: P1XChannel, checked: boolean) => {
    const channels = activeChannels[color];
    const newChannels = checked ? [...channels, channel] : channels.filter((c) => c !== channel);

    setActiveChannels({
      ...activeChannels,
      [color]: newChannels,
    });
  }, [activeChannels, setActiveChannels]);

  return (
    <Stack useFlexGap gap={1} direction="column" className="data-view" justifyContent="flex-start" alignItems="center">
      { channelsData.map(({ name, channelData, minMax }) => (
        <Stack useFlexGap gap={2} direction="row" key={name}>
          <Histogram
            numBins={64}
            barWidth={4}
            channelData={channelData}
            height={dimensions.height}
          />
          <DataViewChannel
            name={name}
            dimensions={dimensions}
            color={channelColors[name]}
            channelData={channelData}
          />
          <Typography variant="body2">
            { name }
            <br />
            { `${minMax.min} to ${minMax.max}` }
          </Typography>
          <Stack useFlexGap direction="column">
            <RGBSwitch
              checked={activeChannels.b.includes(name)}
              rgbChannel="b"
              onChange={({ target }) => {
                setChannel('b', name, target.checked);
              }}
            />
            <RGBSwitch
              checked={activeChannels.g.includes(name)}
              rgbChannel="g"
              onChange={({ target }) => {
                setChannel('g', name, target.checked);
              }}
            />
            <RGBSwitch
              checked={activeChannels.r.includes(name)}
              rgbChannel="r"
              onChange={({ target }) => {
                setChannel('r', name, target.checked);
              }}
            />
          </Stack>

        </Stack>
      ))}
    </Stack>
  );
}

export default DataView;
