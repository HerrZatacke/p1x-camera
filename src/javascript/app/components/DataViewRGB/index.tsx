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

  const { rgbChannelGridsToImageData, dimensions } = useDataView();

  const sliderStyles = useMemo<CSSPropertiesVars>(() => ({
    '--rgb-width': `${dimensions.width}px`,
    '--rgb-height': `${dimensions.height}px`,
  }), [dimensions]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = rgbChannelGridsToImageData(channels);

    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    context.putImageData(imageData, 0, 0);

  }, [canvasRef, dimensions, rgbChannelGridsToImageData, channels]);

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
