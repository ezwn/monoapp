import React, { useCallback } from 'react';

import { CanvasLayer } from './CanvasLayer-cmp';
import { useNavigatorPersistenceContext } from '../../navigator/NavigatorPersistence-ctx';
import { MapViewContextProvider, useMapViewContext } from './MapView-ctxt';
import { generateWorld } from '../lib/map/Map';


export const MapView: React.FC = () => {
  const { currentFile } = useNavigatorPersistenceContext();
  const mapPath = currentFile!.path;

  return <MapViewContextProvider mapPath={mapPath}>
    <div className='flex-1'>
      <CanvasLayer />
      <div>
        <GenerateWorldButton />
      </div>
    </div>
  </MapViewContextProvider>;
}


export const GenerateWorldButton = () => {
  const { currentPath } = useNavigatorPersistenceContext();
  const { map } = useMapViewContext();

  const onClick = useCallback(() => generateWorld(currentPath, map!), [currentPath, map])

  return <input type='button' value="Generate world" onClick={onClick} />
}