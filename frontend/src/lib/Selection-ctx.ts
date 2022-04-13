import { useState } from 'react';
import { createHookBasedContext } from './react-utils/createHookBasedContext';

export type SelectionProps = {};

export type SelectionValue = {
  selection: string[];
  setSelection: (selection: string[]) => void;
};

export const defaultValue: SelectionValue = {
  selection: [],
  setSelection: () => {}
};

export const useSelection: (props: SelectionProps) => SelectionValue = () => {
  const [selection, setSelection] = useState(defaultValue.selection);
  return { selection, setSelection };
};

const hookBasedContext = createHookBasedContext(useSelection, defaultValue);

export const SelectionProvider = hookBasedContext.Provider;
export const useSelectionContext = hookBasedContext.useContext;
