import React, { useEffect, useRef } from 'react';
import { useDataView } from '../../hooks/useDataView';
import type { Dimensions } from '../../stores/scannedDataStore';

import './index.scss';

export interface Props {
  channelData: number[],
  dimensions: Dimensions,
  color: string,
  name: string,
}

function DataViewChannel({ channelData, dimensions, color, name }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { channelDataToImageData } = useDataView(dimensions);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = channelDataToImageData(channelData, color);

    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    context.putImageData(imageData, 0, 0);

  }, [color, canvasRef, channelData, dimensions, channelDataToImageData]);

  return (
    <canvas className="data-view-channel" ref={canvasRef} title={name} />
  );
}

export default DataViewChannel;
