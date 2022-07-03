import { useState } from 'react';
import { createHookBasedContext, useContextValueObject } from '../../../lib/react-utils/createHookBasedContext';

export type PointingContextProps = {};

export type PointingContextValue = {
  pointedElement: string | null;
  setPointedElement: (pointedElement: string | null) => void;
  pointedLocation: number[];
  setPointedLocation: (pointedLocation: number[]) => void;
};

const defaultValue: PointingContextValue = {
  pointedElement: null,
  setPointedElement: () => {},
  pointedLocation: [],
  setPointedLocation: () => {}
};

const usePointingContextFN: (props: PointingContextProps) => PointingContextValue = () => {
  const [pointedElement, setPointedElement] = useState(defaultValue.pointedElement);
  const [pointedLocation, setPointedLocation] = useState(defaultValue.pointedLocation);
  return useContextValueObject({ pointedElement, setPointedElement, pointedLocation, setPointedLocation }, defaultValue) as PointingContextValue;
};

const hookBasedContext = createHookBasedContext(usePointingContextFN, defaultValue);

export const PointingContextProvider = hookBasedContext.Provider;
export const usePointingContext = hookBasedContext.useContext;
