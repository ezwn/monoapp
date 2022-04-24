import React from 'react';

import { useActiveFeatureContext } from './ActiveFeature';

export type ActiveFeatureGlobalProviderProps = {
};

export const ActiveFeatureGlobalProvider: React.FC<ActiveFeatureGlobalProviderProps> = ({ children }) => {
    const { activeFileConfig } = useActiveFeatureContext();

    const withGlobalProvider = activeFileConfig?.withGlobalProvider;

    if (withGlobalProvider) {
        return (<>{withGlobalProvider(children)}</>);
    } else {
        return (<>{children}</>);
    }
};
