import React, { useEffect, useRef } from 'react';
import { useDataView } from '../../hooks/useDataView';
import type { Dimensions } from '../../stores/scannedDataStore';
import type { MinMax } from '../../../tools/minMax';

import './index.scss';

export interface Props {
  channelData: number[],
  channelRange: MinMax,
  dimensions: Dimensions,
  color: string,
  name: string,
}

function DataViewChannel({ channelData, channelRange, dimensions, color, name }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { channelDataToImageData } = useDataView(dimensions);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = channelDataToImageData(channelData, channelRange, color);

    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    context.putImageData(imageData, 0, 0);

  }, [color, canvasRef, channelData, dimensions, channelDataToImageData, channelRange]);

  return (
    <div className="data-view-channel">
      <canvas className="data-view-channel__canvas" ref={canvasRef} title={name} />
    </div>
  );
}

export default DataViewChannel;
