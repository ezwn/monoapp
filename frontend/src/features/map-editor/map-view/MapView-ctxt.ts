import { useEffect, useState } from "react";
import { loadFile } from "../../../lib/fs4webapp-client";
import { createHookBasedContext } from "../../../lib/react-utils/createHookBasedContext";
import { MapHandler } from "../lib/map/Map";
import { Map } from "../lib/map/persistence";

export const imageSize = [512, 512];

export type MapToImageProps = {
  mapPath?: string;
};

export type MapToImageValue = {
  map?: MapHandler;
};

const defaultValue: MapToImageValue = {
  map: undefined
};

const useMapToImage: (props: MapToImageProps) => MapToImageValue = ({ mapPath }) => {
  const [map, setMap] = useState<MapHandler>();

  useEffect(() => {
    if (mapPath) {
      loadFile<Map>(mapPath).then(map => setMap(new MapHandler(map)));
    }
  }, [mapPath]);

  return { map };
};

const hookBasedContext = createHookBasedContext(useMapToImage, defaultValue);

export const MapViewContextProvider = hookBasedContext.Provider;
export const useMapViewContext = hookBasedContext.useContext;
