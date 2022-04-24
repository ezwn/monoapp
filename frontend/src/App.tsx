import React from 'react';
import { NavigatorPersistenceProvider } from './features/navigator/NavigatorPersistence-ctx';
import { NavigatorCmp } from './features/navigator/Navigator-cmp';
import { ActiveFeatureMainViewCmp } from './lib/app-core/ActiveFeatureMainView';
import { FeatureListProvider } from './lib/app-core/FeatureList-ctx';
import { ActiveFeatureGlobalProvider } from './lib/app-core/ActiveFeatureGlobalProvider';
import { ActiveFeatureProvider } from './lib/app-core/ActiveFeature';
import { CommandDispatcherProvider } from './lib/commands/CommandDispatcher-ctx';
import { CommandStatusBarCmp } from './lib/commands/CommandStatusBar-cmp';

import * as DiagramEditor from './features/diagram-editor/index';
import * as MapEditor from './features/map-editor/index';
import * as WorldEditor from './features/world-editor/index';
import * as TimelineEditor from './features/timeline-editor/index';

import './App.css';

const features = [DiagramEditor, MapEditor, WorldEditor, TimelineEditor];

const App: React.FC = () => {
  return (
    <FeatureListProvider features={features}>
      <NavigatorPersistenceProvider>
        <ActiveFeatureProvider>
          <ActiveFeatureGlobalProvider>
            <CommandDispatcherProvider>
              <div className='flex-1 col'>
                <NavigatorCmp />
                <div className='flex-1 col'>
                  <ActiveFeatureMainViewCmp />
                </div>
                <CommandStatusBarCmp />
              </div>
            </CommandDispatcherProvider>
          </ActiveFeatureGlobalProvider>
        </ActiveFeatureProvider>
      </NavigatorPersistenceProvider>
    </FeatureListProvider>
  );
};

export default App;
