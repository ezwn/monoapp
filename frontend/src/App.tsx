import React from 'react';
import { NavigatorPersistenceProvider } from './lib/file-browsing/NavigatorPersistence-ctx';
import { NavigatorCmp } from './features/navigator/Navigator-cmp';
import { ActiveFeatureMainViewCmp } from './lib/app-core/ActiveFeatureMainView';
import { FeatureListProvider } from './lib/app-core/FeatureList-ctx';
import { ActiveFeatureGlobalProvider } from './lib/app-core/ActiveFeatureGlobalProvider';
import { ActiveFeatureProvider } from './lib/app-core/ActiveFeature';
import { CommandDispatcherProvider } from './lib/commands/CommandDispatcher-ctx';
import { CommandStatusBarCmp } from './lib/commands/CommandStatusBar-cmp';

import * as DiagramEditor from './features/diagram-editor';
import * as MapEditor from './features/map-editor';
import * as WorldEditor from './features/world-editor';
import * as TimelineEditor from './features/timeline-editor';
import * as MediaFilePlayer from './features/media-file-player';
import * as MediaListPlayer from './features/media-list-player';
import * as FolderBrowser from './features/folder-browser';
import { UndoPlugin } from './lib/undo/UndoPlugin';
import { UndoProvider } from './lib/undo/Undo-ctx';

import './App.css';

const features = [FolderBrowser, DiagramEditor, MapEditor, WorldEditor, TimelineEditor, MediaFilePlayer, MediaListPlayer];

const App: React.FC = () => {
  return (
    <FeatureListProvider features={features}>
      <UndoProvider>
        <NavigatorPersistenceProvider>
          <ActiveFeatureProvider>
            <UndoPlugin>
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
            </UndoPlugin>
          </ActiveFeatureProvider>
        </NavigatorPersistenceProvider>
      </UndoProvider>
    </FeatureListProvider>
  );
};

export default App;
