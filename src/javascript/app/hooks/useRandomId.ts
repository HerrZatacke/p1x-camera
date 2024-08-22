import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const createRandomId = uuidv4;

export const useRandomId = () => (
  useMemo<string>(createRandomId, [])
);
