import { useState } from 'react';
import { createHookBasedContext } from '../react-utils/createHookBasedContext';

export type UndoProps = {};

export type UndoValue = {
  lastUndo: number;
  setLastUndo: (val: number) => void;
};

const defaultValue: UndoValue = {
  lastUndo: 0,
  setLastUndo: () => { }
};

const useUndo: (props: UndoProps) => UndoValue = () => {
  const [lastUndo, setLastUndo] = useState<number>(defaultValue.lastUndo);
  return { lastUndo, setLastUndo };
};

const hookBasedContext = createHookBasedContext(useUndo, defaultValue);

export const UndoProvider = hookBasedContext.Provider;
export const useUndoContext = hookBasedContext.useContext;
