import { useCallback } from 'react';
import type { ChannelGrid } from '../stores/scannedDataStore';
import useScannedDataStore from '../stores/scannedDataStore';

export interface Dimensions {
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  maxV: number,
  minV: number,
}

interface TargetSize {
  width: number,
  height: number,
}

export interface RGBChannels {
  channelR?: ChannelGrid[],
  channelG?: ChannelGrid[],
  channelB?: ChannelGrid[],
}

export interface UseDimensions {
  targetSize: TargetSize,
  channelGridToImageData: (channelGrid: ChannelGrid[], color: string) => ImageData,
  rgbChannelGridsToImageData: (channels: RGBChannels) => ImageData,
}

export const useDimensions = (): UseDimensions => {
  const { targetSize } = useScannedDataStore();

  const getDimensions = (channelGrid: ChannelGrid[]): Dimensions => (
    channelGrid.reduce((acc: Dimensions, { x, y, value }: ChannelGrid): Dimensions => ({
      minX: Math.min(acc.minX, x),
      minY: Math.min(acc.minY, y),
      minV: Math.min(acc.minV, value),
      maxX: Math.max(acc.maxX, x),
      maxY: Math.max(acc.maxY, y),
      maxV: Math.max(acc.maxV, value),
    }), {
      minX: Infinity,
      minY: Infinity,
      minV: Infinity,
      maxX: 0,
      maxY: 0,
      maxV: 0,
    })
  );

  const writeChannel = useCallback((
    channelGrid: ChannelGrid[],
    imageData: ImageData,
    offset: 0|1|2,
    intensity: number,
  ) => {
    const dimensions = getDimensions(channelGrid);
    const width = dimensions.maxX - dimensions.minX + 1;
    const { data } = imageData;

    channelGrid.forEach(({ x, y, value }) => {
      const imgX = x - dimensions.minX;
      const imgY = y - dimensions.minY;

      const compensateDarkEnd = true;

      const sens = compensateDarkEnd ? dimensions.maxV - Math.max(dimensions.minV * 1.2) : dimensions.maxV;
      const v = compensateDarkEnd ? value - dimensions.minV : value;

      const imgDataOffset = (imgX * 4) + (imgY * 4 * width);
      data[imgDataOffset + offset] = Math.min(255, Math.floor(v * intensity / sens));
      data[imgDataOffset + 3] = 255;
    });

  }, []);

  const channelGridToImageData = useCallback((channelGrid: ChannelGrid[], color: string): ImageData => {
    const colorR = parseInt(color.substring(0, 2), 16);
    const colorG = parseInt(color.substring(2, 4), 16);
    const colorB = parseInt(color.substring(4, 6), 16);

    const dimensions = getDimensions(channelGrid);
    const width = dimensions.maxX - dimensions.minX + 1;
    const height = dimensions.maxY - dimensions.minY + 1;
    const imageData = new ImageData(width, height);

    writeChannel(channelGrid, imageData, 0, colorR);
    writeChannel(channelGrid, imageData, 1, colorG);
    writeChannel(channelGrid, imageData, 2, colorB);

    return imageData;
  }, [writeChannel]);

  const rgbChannelGridsToImageData = useCallback(({
    channelR,
    channelG,
    channelB,
  }: RGBChannels): ImageData => {
    const dimensionChannel = channelR || channelG || channelB;

    if (!dimensionChannel) {
      return new ImageData(1, 1);
    }

    const dimensions = getDimensions(dimensionChannel);
    const width = dimensions.maxX - dimensions.minX + 1;
    const height = dimensions.maxY - dimensions.minY + 1;
    const imageData = new ImageData(width, height);

    if (channelR) {
      writeChannel(channelR, imageData, 0, 255);
    }

    if (channelG) {
      writeChannel(channelG, imageData, 1, 255);
    }

    if (channelB) {
      writeChannel(channelB, imageData, 2, 255);
    }

    return imageData;
  }, [writeChannel]);

  return {
    channelGridToImageData,
    targetSize,
    rgbChannelGridsToImageData,
  };
};
