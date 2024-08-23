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
  const { channelGridToImageData, targetSize } = useDataView();

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = channelGridToImageData(channelGrid, color);

    canvasRef.current.width = targetSize.width;
    canvasRef.current.height = targetSize.height;

    context.putImageData(imageData, 0, 0);

  }, [color, canvasRef, channelGrid, targetSize, channelGridToImageData]);

  return (
    <canvas className="data-view-channel" ref={canvasRef} title={name} />
  );
}

export default DataViewChannel;
