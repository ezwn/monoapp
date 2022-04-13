import React, { useCallback } from 'react';

import { MapLayer } from './MapLayer-cmp';
import { HeightMapLayer } from './HeightMapLayer-cmp';
import { useNavigatorPersistenceContext } from '../../navigator/NavigatorPersistence-ctx';
import { generateWorld } from '../lib/map/Map';
import { MapViewContextProvider, useMapViewContext } from './MapView-ctxt';

const HeightMapGenerator = () => {
  const { currentPath } = useNavigatorPersistenceContext();
  const { map } = useMapViewContext();

  const onClick = useCallback(() => generateWorld(currentPath, map!), [currentPath, map])

  return <input type='button' value="Generate height maps" onClick={onClick} />
}

export const MapView: React.FC = () => {
  const { currentFile } = useNavigatorPersistenceContext();
  const mapPath = currentFile!.path;
  
  return <MapViewContextProvider mapPath={mapPath}>
      <div className='flex-1'>
      <MapLayer />
      <HeightMapLayer />
      <div>
        <HeightMapGenerator />
      </div>
    </div>
  </MapViewContextProvider>;
}
