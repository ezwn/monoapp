import { loadArea, loadElement } from "./persistence";

// Model
//

export interface WorldElement {
  type: string;
  location: number[];
  rotation: number[];
  dimensions: number[];
}

export interface WorldArea {
  elements: WorldElement[];
}

// API
//

export const getWorldArea = async (worldPath: string, x: number, y: number, z: number): Promise<WorldArea | null> => {
  const areaData = await loadArea(worldPath, x, y, z);

  if (areaData === null) {
    return {
      elements: []
    };
  }

  const elements: WorldElement[] = [];
  for (let elementId of areaData.elements) {
    elements.push(await getWorldElement(worldPath, elementId));
  }

  return { elements };
};

export const getWorldElement = async (worldPath: string, elementId: string): Promise<WorldElement> => {
  const elementData = await loadElement(worldPath, elementId);

  return {
    ...elementData
  };
}

