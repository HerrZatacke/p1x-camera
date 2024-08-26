import React, { useEffect, useMemo, useRef } from 'react';
import type { CSSPropertiesVars } from 'react';
import type { RGBChannels } from '../../hooks/useDataView';
import type { Dimensions } from '../../stores/scannedDataStore';
import { useDataView } from '../../hooks/useDataView';

import './index.scss';

export interface Props {
  channels: RGBChannels,
  dimensions: Dimensions,
}

function DataViewRGB({ channels, dimensions }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { rgbChannelsDataToImageData } = useDataView(dimensions);

  const sliderStyles = useMemo<CSSPropertiesVars>(() => ({
    '--rgb-width': `${dimensions.width}px`,
    '--rgb-height': `${dimensions.height}px`,
  }), [dimensions]);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context || !canvasRef.current) {
      return;
    }

    const imageData = rgbChannelsDataToImageData(channels);

    canvasRef.current.width = dimensions.width;
    canvasRef.current.height = dimensions.height;

    context.putImageData(imageData, 0, 0);

  }, [canvasRef, dimensions, rgbChannelsDataToImageData, channels]);

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
