/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef } from 'react';
import type { MinMax } from '../../../tools/minMax';
import type { P1XChannel } from '../../../types/P1X';
import { getMinMax } from '../../../tools/minMax';

import './index.scss';
import useScannedDataStore from '../../stores/scannedDataStore';

export interface Props {
  name: P1XChannel,
  channelData: number[],
  numBins: number,
  barWidth: number,
  height: number,
}

const getShade = (value: number, max: number, highlight: boolean): string => {
  const shade = Math.ceil(value * (255 / max)).toString(16).padStart(2, '0');
  return `#${highlight ? 'ff' : shade}${shade}${shade}`;
};

function Histogram({ channelData, numBins, barWidth, height, name }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { ranges, setChannelRange } = useScannedDataStore();
  const { min, max } = useMemo<MinMax>(() => getMinMax(channelData), [channelData]);

  const channelRange: MinMax = ranges[name] || { min, max };

  const binWidth = max / numBins;

  const histogram = useMemo((): number[] => {
    if (numBins <= 0) {
      return [];
    }

    return channelData.reduce((acc, value) => {
      const binIndex = Math.min(numBins - 1, Math.floor((value - min) / binWidth));

      acc[binIndex] += 1;
      return acc;
    }, new Array(numBins).fill(0));
  }, [numBins, channelData, min, binWidth]);

  const width = numBins * barWidth;

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const { max: maxBin } = getMinMax(histogram);


    canvasRef.current.width = width;
    canvasRef.current.height = height;

    histogram.forEach((value, index) => {
      const barHeight = value * height / maxBin;
      const highlight = index * binWidth >= channelRange.min && index * binWidth <= channelRange.max;
      context.fillStyle = getShade(index, histogram.length, highlight);
      context.fillRect(index * barWidth, height - barHeight, barWidth - 1, barHeight);
    });

  }, [barWidth, binWidth, canvasRef, channelRange.max, channelRange.min, height, histogram, numBins, width]);


  return (
    <div className="histogram">
      <canvas
        className="histogram__canvas"
        width={width}
        height={height}
        ref={canvasRef}
        onClick={(ev) => {
          const val = Math.floor(max * (ev.nativeEvent.offsetX / width));
          setChannelRange(name, {
            ...channelRange,
            min: val,
          });
        }}
        onContextMenu={(ev) => {
          const val = Math.ceil(max * (ev.nativeEvent.offsetX / width));
          ev.preventDefault();
          setChannelRange(name, {
            ...channelRange,
            max: val,
          });
        }}
      />
    </div>
  );

}

export default Histogram;
