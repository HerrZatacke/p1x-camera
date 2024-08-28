import React, { useEffect, useMemo, useRef } from 'react';
import type { CSSPropertiesVars } from 'react';
import type { RGBChannels } from '../../hooks/useDataView';
import { useDataView } from '../../hooks/useDataView';

import './index.scss';
import useSettingsStore from '../../stores/settingsStore';
import useScannedDataStore from '../../stores/scannedDataStore';

function DataViewRGB() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { activeChannels } = useSettingsStore();
  const { data, dimensions } = useScannedDataStore();

  const channels: RGBChannels = useMemo(() => ({
    channelR: activeChannels.r.map((channelName): number[] => data[channelName] || []),
    channelG: activeChannels.g.map((channelName): number[] => data[channelName] || []),
    channelB: activeChannels.b.map((channelName): number[] => data[channelName] || []),
  }), [activeChannels, data]);

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
