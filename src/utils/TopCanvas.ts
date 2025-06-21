import * as THREE from "three";
import LightSet from "./base/LightSet.js";
import ThreeSceneManager from "./base/ThreeSceneManager.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class TopCanvas extends ThreeSceneManager {
  progress = 0;
  gltf: THREE.Group | undefined;
  constructor(
    cameraPos: [number, number, number],
    canvasClassName: string,
    fov: number = 45,
    far: number = 2000,
    backgroundAlpha: boolean = false,
    backgroundColor: THREE.Color | THREE.ColorRepresentation = 0x000000
  ) {
    super(cameraPos, canvasClassName, fov, far, backgroundAlpha, backgroundColor);
  }

  async init() {
    const gltf = await this.getGltf();
    this.gltf = gltf.scene;
    this.gltf.scale.setScalar(1.8);
    this.scene.add(gltf.scene);

    // ライト
    const light = new LightSet();
    this.scene.add(light);
  }

  async getGltf() {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync("/glb/great_axe.glb", (event) => {
      this.progress = Math.floor((event.loaded / event.total) * 100);
    });
    return gltf;
  }

  onAnimate() {}
}
