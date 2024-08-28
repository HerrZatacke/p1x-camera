/* eslint-disable no-param-reassign */
import React, { useEffect, useMemo, useRef } from 'react';
import type { MinMax } from '../../../tools/minMax';
import { getMinMax } from '../../../tools/minMax';

import './index.scss';

export interface Props {
  channelData: number[],
  numBins: number,
  barWidth: number,
  height: number,
}

const getShade = (value: number, max: number): string => {
  const shade = Math.ceil(value * (255 / max)).toString(16).padStart(2, '0');
  return `#${shade}${shade}${shade}`;
};

function Histogram({ channelData, numBins, barWidth, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { min, max } = useMemo<MinMax>(() => getMinMax(channelData), [channelData]);

  const histogram = useMemo((): number[] => {
    if (numBins <= 0) {
      return [];
    }

    const binWidth = (max - min) / numBins;

    return channelData.reduce((acc, value) => {
      const binIndex = Math.min(numBins - 1, Math.floor((value - min) / binWidth));

      acc[binIndex] += 1;
      return acc;
    }, new Array(numBins).fill(0));
  }, [numBins, max, min, channelData]);

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
      context.fillStyle = getShade(index, histogram.length);
      context.fillRect(index * barWidth, height - barHeight, barWidth - 1, barHeight);
    });

  }, [barWidth, canvasRef, height, histogram, numBins, width]);


  return (
    <div className="histogram">
      <canvas width={width} height={height} ref={canvasRef} />
    </div>
  );

}

export default Histogram;
