import { saveFileWithContentType, saveJSONFile } from '../../../../lib/fs4webapp-client';
import { areaSideSize, areaTerrainResolution, saveElement, ThreeDWorldAreaData } from '../../../../lib/world/persistence';
import { Map } from './persistence';

const distance = ([xA, yA]: number[], [xB, yB]: number[]) => Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));

export const numberOfAreas = 2;
const worldSideSize = areaSideSize * numberOfAreas;

export class MapHandler {

  private map: Map;

  constructor(map: Map) {
    this.map = map;
  }

  public heightAt([x, y]: number[]) {
    const heightMax = this.map.elements
      .filter(imageElement => imageElement.peak)
      .map(mapElement => {
        const { radius, centralElevation, peripheralElevation } = mapElement.peak!;
        const elevationProportion = Math.max(0, radius - distance(mapElement.point, [x, y])) / radius;
        return peripheralElevation + elevationProportion * (centralElevation - peripheralElevation);
      })
      .reduce((height1, height2) => Math.max(height1, height2), 0);

    return heightMax;
  }
}

export const renderHeightMapToCanvas = (canvas: HTMLCanvasElement, map: MapHandler, mapX0: number, mapY0: number, mapAreaWidth: number, mapAreaHeight: number) => {
  console.log("renderHeightMapToCanvas", map)

  const context = canvas.getContext('2d');

  if (context) {
    const { width, height } = canvas;
    const imgData = context.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const i2 = i / 4;

      const canvasX = i2 % width;
      const canvasY = Math.floor(i2 / width);

      const elevation = Math.round(map.heightAt([
        mapX0 + canvasX / width * mapAreaWidth,
        mapY0 + canvasY / height * mapAreaHeight
      ]) / 100 * 255);

      data[i] = elevation;
      data[i + 1] = elevation;
      data[i + 2] = elevation;
      data[i + 3] = 255;
    }
    context.putImageData(imgData, 0, 0)
  }
};

export const generateWorld = async (currentPath: string, map: MapHandler) => {

  for (let c = 0; c < numberOfAreas; c++) {
    for (let l = 0; l < numberOfAreas; l++) {

      const mapX0 = c / numberOfAreas * 100.0;
      const mapY0 = l / numberOfAreas * 100.0;
      const mapAreaWidth = 100.0 / numberOfAreas;
      const mapAreaHeight = 100.0 / numberOfAreas;

      // Terrain
      const canvas = document.createElement("canvas");
      canvas.height = areaTerrainResolution;
      canvas.width = areaTerrainResolution;

      renderHeightMapToCanvas(canvas, map, mapX0, mapY0, mapAreaWidth, mapAreaHeight);

      const imageCode = canvas.toDataURL("image/png")
        .replace(/^data:image\/\w+;base64,/, "");

      saveFileWithContentType(
        currentPath + `/areas/${c}x${l}x0.png`,
        imageCode
      );

      // WORLD 
      const moduleId = "tree-01";

      const elements = [];
      let i = 0;
      while (i < 100) {

        const elementX = (c + Math.random()) * areaSideSize;
        const elementZ = (l + Math.random()) * areaSideSize;

        const elementY = map.heightAt([
          elementX / worldSideSize * 100.0,
          elementZ / worldSideSize * 100.0
        ]);

        if (Math.random() * 100 > elementY)
          continue;

        i++;

        const elementId = `${moduleId}-${c}x${l}x0-${i}`;
        elements.push(elementId);

        await saveElement(currentPath, elementId, {
          type: moduleId,
          location: [elementX, elementY, elementZ],
          rotation: [0.0, 0.0, 0.0],
          dimensions: [0.3, 1.92, 0.3]
        });
      }

      const worldArea: ThreeDWorldAreaData = { elements };

      saveJSONFile(
        currentPath + `/areas/${c}x${l}x0.json`,
        worldArea
      );
    }
  }
}
