import { useCallback, useState } from 'react';
import { createHookBasedContext } from '../../../lib/react-utils/createHookBasedContext';

export type DiagramUIProps = {};

export type MODE = 'DEFAULT' | 'DRAG' | 'EDITION';

export type DiagramUIValue = {
  mode: MODE;
  setMode: (mode: MODE) => void;
  hasDragged: boolean;
  setHasDragged: (hasDragged: boolean) => void;
};

export const defaultValue: DiagramUIValue = {
  mode: 'DEFAULT',
  setMode: () => { },
  hasDragged: false,
  setHasDragged: () => { }
};

export const useDiagramUI: (props: DiagramUIProps) => DiagramUIValue = () => {
  const [mode, updateMode] = useState(defaultValue.mode);
  const [hasDragged, setHasDragged] = useState(defaultValue.hasDragged);

  const setMode = useCallback((mode: MODE) => {
    if (mode === "EDITION") {
      if (hasDragged) {
        updateMode("DEFAULT");
        return;
      }
    }
    
    setHasDragged(false)
    updateMode(mode)
  }, [hasDragged]);

  return { mode, setMode, hasDragged, setHasDragged };
};

const hookBasedContext = createHookBasedContext(useDiagramUI, defaultValue);

export const DiagramUIProvider = hookBasedContext.Provider;
export const useDiagramUIContext = hookBasedContext.useContext;
