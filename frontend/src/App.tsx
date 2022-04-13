import React from 'react';
import { NavigatorPersistenceProvider } from './features/navigator/NavigatorPersistence-ctx';
import { NavigatorCmp } from './features/navigator/Navigator-cmp';
import { FileBasedFeatureRouterCmp } from './lib/app-core/FileBasedFeatureRouter';
import { AppCoreProvider } from './lib/app-core/AppCore-ctx';

import * as DiagramEditor from './features/diagram-editor/index';
import * as MapEditor from './features/map-editor/index';
import * as WorldEditor from './features/world-editor/index';
import * as TimelineEditor from './features/timeline-editor/index';

import './App.css';

const App: React.FC = () => {
  return (
    <AppCoreProvider features={[DiagramEditor, MapEditor, WorldEditor, TimelineEditor]} >
      <NavigatorPersistenceProvider>
        <NavigatorCmp />
        <FileBasedFeatureRouterCmp />
      </NavigatorPersistenceProvider>
    </AppCoreProvider>
  );
};

export default App;
