import React, { useEffect, useRef } from 'react';
import type { RGBChannels } from '../../hooks/useDimensions';
import { useDimensions } from '../../hooks/useDimensions';

import './index.scss';

export interface Props {
  channels: RGBChannels,
}

function DataViewChannel({ channels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rgbChannelGridsToImageData, targetSize } = useDimensions();

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = rgbChannelGridsToImageData(channels);

    canvasRef.current.width = targetSize.width;
    canvasRef.current.height = targetSize.height;

    context.putImageData(imageData, 0, 0);

  }, [canvasRef, targetSize, rgbChannelGridsToImageData, channels]);

  return (
    <canvas className="data-view-channel" ref={canvasRef} title="RGB" />
  );
}

export default DataViewChannel;
