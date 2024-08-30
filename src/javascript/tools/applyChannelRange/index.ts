import type { MinMax } from '../minMax';

export const applyChannelRange = (channelData: number[], channelRange: MinMax): number[] => (
  channelData.map((value) => (
    Math.min(Math.max(0, value - channelRange.min), channelRange.max)
  ))
);
