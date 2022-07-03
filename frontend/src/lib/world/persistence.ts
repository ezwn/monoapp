import { loadFile, loadFileNull, pathToFileUrl, saveJSONFile } from "../fs4webapp-client";

export const areaSideSize = 100.0;
export const areaTerrainResolution = 128;

export interface ThreeDWorldModuleData {
    moduleDirectory?: string;
    modelFileName: string;
}

export interface ThreeDWorldElementData {
    type: string;
    location: number[];
    rotation: number[];
    dimensions: number[];
}

export interface ThreeDWorldAreaData {
    elements: string[];
}

export const loadArea = async (worldPath: string, x: number, y: number, z: number): Promise<ThreeDWorldAreaData | null> => {
    const path = `${worldPath}/areas/${x}x${y}x${z}.json`;
    return await loadFileNull<ThreeDWorldAreaData>(path);
};

export const loadElement = async (worldPath: string, elementId: string): Promise<ThreeDWorldElementData> => {
    const path = `${worldPath}/elements/${elementId}.json`;
    return await loadFile<ThreeDWorldElementData>(path);
}

export const saveElement = async (worldPath: string, elementId: string, elementData: ThreeDWorldElementData): Promise<void> => {
    const path = `${worldPath}/elements/${elementId}.json`;
    await saveJSONFile<ThreeDWorldElementData>(path, elementData);
}

const moduleCache: { [key: string] :ThreeDWorldModuleData } = {};

export const loadModule = async (worldPath: string, elementId: string): Promise<ThreeDWorldModuleData> => {
    const moduleDirectory = `${worldPath}/modules/${elementId}`;
    const path = `${moduleDirectory}/module.json`;

    let fileContent;
    if (moduleCache[elementId]) {
        fileContent = moduleCache[elementId];
    } else {
        fileContent = await loadFile<ThreeDWorldModuleData>(path);
        moduleCache[elementId] = fileContent;
    }

    return {
        ...fileContent,
        moduleDirectory: pathToFileUrl(moduleDirectory)
    };
}

