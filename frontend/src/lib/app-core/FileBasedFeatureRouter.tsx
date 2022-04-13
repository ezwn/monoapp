import React from 'react';

import { useNavigatorPersistenceContext } from '../../features/navigator/NavigatorPersistence-ctx';
import { useAppCoreContext } from './AppCore-ctx';

export type FileBasedFeatureRouterProps = {
};

export const FileBasedFeatureRouterCmp: React.FC<FileBasedFeatureRouterProps> = () => {
    const { findFileTypeSettings } = useAppCoreContext();
    const { currentFile } = useNavigatorPersistenceContext();

    if (!currentFile)
        return null;

    const fileTypeSettings = findFileTypeSettings(currentFile);

    if (!fileTypeSettings)
        return null;

    return (<>
        {currentFile && <fileTypeSettings.mainView />}
    </>);
};
