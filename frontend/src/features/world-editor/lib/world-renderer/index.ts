import { Group, Mesh, XRAnimationLoopCallback } from 'three';
import { GLRenderer, createAreaTerrain, loadModel, locationToPosition } from '../renderer';
import { getWorldArea } from '../../../../lib/world';
import { areaSideSize, loadModule } from '../../../../lib/world/persistence';

const buildAreaId = (worldPath: string, x: number, y: number, z: number) => `${worldPath}-${x}x${y}x${z}`;

export class WorldRenderer {

    private glRenderer: GLRenderer;

    private areaGroups: { [key: string]: Group[] } = {};

    private animation: XRAnimationLoopCallback = (time: number) => {
        Object.values(this.areaGroups).forEach(meshes => (meshes.forEach(mesh => {
            mesh.rotation.y = time / 2000;
        })));
    }

    constructor(div: HTMLDivElement) {
        this.glRenderer = new GLRenderer(div);
    }

    enableWorldAreaRendering = (worldPath: string, c: number, l: number, z: number) => {

        this.glRenderer.setAnimationLoop(this.animation);

        const areaId = buildAreaId("area", c, l, z);

        getWorldArea(worldPath, c, l, z).then(async area => {
            if (!area)
                return;

            const { elements } = area;
            this.areaGroups[areaId] = [];

            for (const element of elements) {

                const { moduleDirectory, modelFileName } = await loadModule(worldPath, element.type);

                const group = await loadModel(`${moduleDirectory}/${modelFileName}`);
                const modelInstance = group.clone();
                const { location } = element;
                locationToPosition(location, modelInstance.position);
                this.glRenderer.addGroup(modelInstance);

                this.areaGroups[areaId].push(modelInstance);
            };

            const terrainMesh: Mesh | null = await createAreaTerrain(worldPath, c, l, z);
            if (terrainMesh) {
                locationToPosition([(c + 0.5) * areaSideSize, 0, (l + 0.5) * areaSideSize], terrainMesh.position);
                this.glRenderer.addGroup(terrainMesh);
            }
        });
    }
}
