import React, { useEffect, useMemo, useRef } from 'react';
import type { CSSPropertiesVars } from 'react';
import type { RGBChannels } from '../../hooks/useDataView';
import { useDataView } from '../../hooks/useDataView';

import './index.scss';

export interface Props {
  channels: RGBChannels,
}

function DataViewRGB({ channels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { rgbChannelGridsToImageData, targetSize } = useDataView();

  const sliderStyles = useMemo<CSSPropertiesVars>(() => ({
    '--rgb-width': `${targetSize.width}px`,
    '--rgb-height': `${targetSize.height}px`,
  }), [targetSize]);

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
    <canvas
      ref={canvasRef}
      className="data-view-rgb"
      style={sliderStyles}
      title="RGB"
    />
  );
}

export default DataViewRGB;
