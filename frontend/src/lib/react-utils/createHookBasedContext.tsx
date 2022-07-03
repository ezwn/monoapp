// modified on 2022-01-08

import React, { useContext, useState } from "react";

type ValueObject = { [key: string]: unknown };

export function useContextValueObject(object: ValueObject, defaultValue: ValueObject) {
  const [value, setValue] = useState<ValueObject>(defaultValue);

  const someAreDifferent = Object.keys(object).some(key => object[key] !== value[key]);

  if(someAreDifferent) {
    setValue(object);
  }

  return value;
}

export function createHookBasedContext<I, O>(
  useHook: (input: I) => O,
  defaults: O
) {
  const Context = React.createContext<O>(defaults);

  const Provider: React.FC<I> = (props) => {

    const value = useHook(props);

    return (
      <Context.Provider value={value}>{props.children}</Context.Provider>
    );
  };

  const useHookBasedContext = (): O => {
    return useContext(Context);
  };

  return {
    Provider,
    useContext: useHookBasedContext,
  };
}
