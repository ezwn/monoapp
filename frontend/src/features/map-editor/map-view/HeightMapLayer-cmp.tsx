import React, { useEffect, useRef } from 'react';
import { renderHeightMapToCanvas } from '../lib/map/Map';
import { imageSize, useMapViewContext } from './MapView-ctxt';

export const HeightMapLayer: React.FC = () => {

  const worldDivRef = useRef<HTMLCanvasElement>(null);
  const { current: canvasElement } = worldDivRef;
  const { map } = useMapViewContext();

  useEffect(() => {
    if (canvasElement && map) {
      renderHeightMapToCanvas(canvasElement, map, 0, 0, 100, 100);
    }
  }, [canvasElement]);

  return <canvas ref={worldDivRef} width={imageSize[0]} height={imageSize[1]} style={{
    backgroundColor: "black",
    width: imageSize[0],
    height: imageSize[1]
  }}></canvas>;
}
