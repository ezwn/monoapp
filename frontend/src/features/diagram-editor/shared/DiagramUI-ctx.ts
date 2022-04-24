import { useState } from 'react';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';

export type DiagramUIProps = {};

export type MODE = 'DEFAULT' | 'DRAG' | 'EDITION';

export type DiagramUIValue = {
  mode: MODE;
  setMode: (mode: MODE) => void;
};

const defaultValue: DiagramUIValue = {
  mode: 'DEFAULT',
  setMode: () => { }
};

const useDiagramUI: (props: DiagramUIProps) => DiagramUIValue = () => {
  const [mode, setMode] = useState(defaultValue.mode);
  return { mode, setMode };
};

const hookBasedContext = createHookBasedContext(useDiagramUI, defaultValue);

export const DiagramUIProvider = hookBasedContext.Provider;
export const useDiagramUIContext = hookBasedContext.useContext;
