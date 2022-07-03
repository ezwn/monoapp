import React from 'react';

import { useNavigatorPersistenceContext } from '../file-browsing/NavigatorPersistence-ctx';
import { useActiveFeatureContext } from './ActiveFeature';

import './CloseFileButton.css';

export type ActiveFeatureMainViewProps = {
};

export const ActiveFeatureMainViewCmp: React.FC<ActiveFeatureMainViewProps> = () => {
    const { activeFileConfig } = useActiveFeatureContext();
    const { currentFile, closeCurrentFile } = useNavigatorPersistenceContext();

    if (!currentFile || !activeFileConfig)
        return null;

    return <>
        { activeFileConfig.closable && <div className='close-file-button' onClick={closeCurrentFile}>Close</div> }
        <activeFileConfig.mainView />
    </>;
};
