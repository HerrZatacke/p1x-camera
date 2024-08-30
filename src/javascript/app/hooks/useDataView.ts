import { useCallback } from 'react';
import type { Dimensions } from '../stores/scannedDataStore';
import type { MinMax } from '../../tools/minMax';
import { getCoordinatesFromIndex } from '../../tools/dimensions';
import { getMinMax } from '../../tools/minMax';
import { applyChannelRange } from '../../tools/applyChannelRange';

export interface RGBChannels {
  channelR: number[][],
  channelG: number[][],
  channelB: number[][],
}

export interface UseDataView {
  channelDataToImageData: (channelData: number[], channelRange: MinMax, color: string) => ImageData,
  rgbChannelsDataToImageData: (channels: RGBChannels) => ImageData,
}

export const useDataView = (dimensions: Dimensions): UseDataView => {

  const sumChannels = (channels: number[][]): number[] => {
    if (!channels.length) {
      return [];
    }

    return channels[0].map((_, index) => (
      channels.reduce((acc, channel) => (acc + channel[index]), 0)
    ));
  };

  const writeChannel = useCallback((
    channelData: number[],
    imageData: ImageData,
    offset: 0|1|2,
    intensity: number,
  ) => {
    const width = dimensions.width;
    const { data } = imageData;

    const minMax = getMinMax(channelData);

    channelData.forEach((value, index) => {
      if (value < 0) {
        return;
      }

      const { x, y } = getCoordinatesFromIndex(index, dimensions);

      const compensateDarkEnd = true;

      const compMax = 1.1;
      const compMin = 0.9;

      // const compMax = 0.9;
      // const compMin = 1.1;

      const sens = compensateDarkEnd ?
        (minMax.max * compMax) - Math.max(minMax.min * compMin) :
        minMax.max * compMax;
      const v = compensateDarkEnd ? value - minMax.min : value;

      const imgDataOffset = (x * 4) + (y * 4 * width);
      data[imgDataOffset + offset] = Math.min(255, Math.floor(v * intensity / sens));
      data[imgDataOffset + 3] = 255;
    });

  }, [dimensions]);

  const channelDataToImageData = useCallback((
    channelData: number[],
    channelRange: MinMax,
    color: string,
  ): ImageData => {
    const colorR = parseInt(color.substring(0, 2), 16);
    const colorG = parseInt(color.substring(2, 4), 16);
    const colorB = parseInt(color.substring(4, 6), 16);

    const imageData = new ImageData(dimensions.width, dimensions.height);

    const rangedData = applyChannelRange(channelData, channelRange);

    writeChannel(rangedData, imageData, 0, colorR);
    writeChannel(rangedData, imageData, 1, colorG);
    writeChannel(rangedData, imageData, 2, colorB);

    return imageData;
  }, [dimensions, writeChannel]);

  const rgbChannelsDataToImageData = useCallback(({
    channelR,
    channelG,
    channelB,
  }: RGBChannels): ImageData => {
    const width = dimensions.width;
    const height = dimensions.height;

    let imageData;
    try {
      imageData = new ImageData(width, height);
    } catch (error) {
      return new ImageData(1, 1);
    }

    if (channelR) {
      writeChannel(sumChannels(channelR), imageData, 0, 255);
    }

    if (channelG) {
      writeChannel(sumChannels(channelG), imageData, 1, 255);
    }

    if (channelB) {
      writeChannel(sumChannels(channelB), imageData, 2, 255);
    }

    return imageData;
  }, [dimensions, writeChannel]);

  return {
    channelDataToImageData,
    rgbChannelsDataToImageData,
  };
};
