import React from 'react';

import { useNavigatorPersistenceContext } from '../../features/navigator/NavigatorPersistence-ctx';
import { useActiveFeatureContext } from './ActiveFeature';

export type ActiveFeatureMainViewProps = {
};

export const ActiveFeatureMainViewCmp: React.FC<ActiveFeatureMainViewProps> = () => {
    const { activeFileConfig } = useActiveFeatureContext();
    const { currentFile } = useNavigatorPersistenceContext();

    if (!currentFile || !activeFileConfig)
        return null;

    return <activeFileConfig.mainView />;
};
