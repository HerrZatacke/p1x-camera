import React, { useEffect, useRef } from 'react';
import type { ChannelGrid } from '../../stores/scannedDataStore';
import { useDataView } from '../../hooks/useDataView';

import './index.scss';

export interface Props {
  channelGrid: ChannelGrid[],
  color: string,
  name: string,
}

function DataViewChannel({ channelGrid, color, name }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { channelGridToImageData, dimensions } = useDataView();

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = channelGridToImageData(channelGrid, color);

    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    context.putImageData(imageData, 0, 0);

  }, [color, canvasRef, channelGrid, dimensions, channelGridToImageData]);

  return (
    <canvas className="data-view-channel" ref={canvasRef} title={name} />
  );
}

export default DataViewChannel;
