import React, { useEffect, useRef, useState } from 'react';
import { useNavigatorPersistenceContext } from '../../navigator/NavigatorPersistence-ctx';

import { WorldRenderer } from '../lib/world-renderer';

export const WorldView: React.FC = () => {

  const worldDivRef = useRef<HTMLDivElement>(null);
  const [worldRenderer, setWorldRenderer] = useState<WorldRenderer | null>(null);

  // Init world renderer
  const worldRendererCreationRequired = !worldRenderer;
  useEffect(() => {
    const { current: worldDiv } = worldDivRef;

    if (worldDiv && worldRendererCreationRequired) {
      setWorldRenderer(new WorldRenderer(worldDiv));
    }

    return () => {
      // TODO: clean here
    };
  }, [worldDivRef, worldRendererCreationRequired]);

  const { currentPath } = useNavigatorPersistenceContext();
  useEffect(() => {
    if (worldRenderer && currentPath) {
      for (let c = 0; c < 4; c++) {
        for (let l = 0; l < 4; l++) {
          worldRenderer.enableWorldAreaRendering(currentPath, c, l, 0);
        }
      }
    }

    return () => {
      // TODO: clean here
    };
  }, [worldRenderer, currentPath])

  return <div className='flex-1' ref={worldDivRef}></div>;
}

