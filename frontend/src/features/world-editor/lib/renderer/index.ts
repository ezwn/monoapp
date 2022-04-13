import {
  Camera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  XRAnimationLoopCallback,
  sRGBEncoding,
  DirectionalLight,
  HemisphereLight,
  Vector3,
  TextureLoader,
  Texture,
  PlaneBufferGeometry,
  Mesh,
  Object3D,
  ShaderMaterial,
  Group,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { vertexShader, fragmentShader } from "./shaders";
import { areaSideSize, areaTerrainResolution } from '../../../../lib/world/persistence';
import { pathToUrl } from '../../../../lib/fs4webapp-client';

export class GLRenderer {

  private camera: Camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1500.0);

  private scene = new Scene();

  private webGlRenderer = new WebGLRenderer({ antialias: true });

  private animation: XRAnimationLoopCallback = (time: number) => {
    this.animationCallback(time);
    this.webGlRenderer.render(this.scene, this.camera);
  }

  addGroup = (mesh: Object3D): void => {
    this.scene.add(mesh);
  }

  setAnimationLoop = (animationLoop: XRAnimationLoopCallback) => {
    this.animationCallback = animationLoop;
  }

  animationCallback: XRAnimationLoopCallback = () => { };

  constructor(div: HTMLDivElement) {
    this.webGlRenderer.outputEncoding = sRGBEncoding;
    this.webGlRenderer.setSize(div.getBoundingClientRect().width, div.getBoundingClientRect().height);
    div.appendChild(this.webGlRenderer.domElement);

    this.camera.position.x = 0.0;
    this.camera.position.y = 1.82;
    this.camera.position.z = 25.0;

    this.camera.lookAt(0, 0, 0);

    new OrbitControls(this.camera, div);

    const mainLight = new DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);

    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
    this.scene.add(mainLight, hemisphereLight);

    this.webGlRenderer.setAnimationLoop(this.animation);
  }
}

export const createAreaTerrain = async (worldPath: string, x: number, y: number, z: number): Promise<Mesh | null> => {
  const heightMapFile = pathToUrl(`${worldPath}/areas/${x}x${y}x${z}.png`);
  const textureFile = pathToUrl(`${worldPath}/areas/grass.jpg`);
  const heightMap: Texture = new TextureLoader().load(heightMapFile);
  const texture: Texture = new TextureLoader().load(textureFile);

  const geometry = new PlaneBufferGeometry(areaSideSize, areaSideSize, areaTerrainResolution, areaTerrainResolution);

  const material = new ShaderMaterial( {
    uniforms: {
      bumpTexture: { value: heightMap },
      bumpScale: { value: areaSideSize },
      terrainTexture: { value: texture },
      repeat: { value: [15, 15] }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  
  } );

  const plane = new Mesh(geometry, material);

  // plane.position.set(0, 0, 0);
  plane.rotation.set(-Math.PI / 2, 0, 0)

  return plane;
}

const loader = new GLTFLoader();

// Export

export function locationToPosition(location: number[], position: Vector3) {
  position.x = location[0];
  position.y = location[1];
  position.z = location[2];
}

const modelCache: { [key: string] :Group } = {};

export async function loadModel(path: string): Promise<Group> {
  if (modelCache[path]) {
    return modelCache[path];
  }

  const gltf = await loader.loadAsync(path);
  modelCache[path] = gltf.scene;
  return gltf.scene;
}
