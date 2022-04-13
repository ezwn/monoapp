// modified on 2022-01-08

import React, { useContext } from "react";

export function createHookBasedContext<I, O>(
  hook: (input: I) => O,
  defaults: O
) {
  const Context = React.createContext<O>(defaults);

  const Provider: React.FC<I> = (props) => {
    return (
      <Context.Provider value={hook(props)}>{props.children}</Context.Provider>
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
