import React, { useEffect, useRef } from 'react';
import { useNavigatorPersistenceContext } from '../../../lib/file-browsing/NavigatorPersistence-ctx';
import { renderHeightMapToCanvas, runGenerators } from '../lib/map/Map';
import { imageSize, useMapViewContext } from './MapView-ctxt';

export const CanvasLayer: React.FC = () => {

  const worldDivRef = useRef<HTMLCanvasElement>(null);
  const { current: canvasElement } = worldDivRef;
  const { map } = useMapViewContext();
  const { currentPath } = useNavigatorPersistenceContext();

  useEffect(() => {
    if (canvasElement && map) {
      renderHeightMapToCanvas(canvasElement, map, 0, 0, 100, 100);
      runGenerators(currentPath, canvasElement, map);
    }
  }, [canvasElement]);

  return <canvas ref={worldDivRef} width={imageSize[0]} height={imageSize[1]} style={{
    backgroundColor: "black",
    width: imageSize[0],
    height: imageSize[1]
  }}></canvas>;
}
