import * as THREE from "three";
import LightSet from "./base/LightSet.js";
import ThreeSceneManager from "./base/ThreeSceneManager.js";

export default class IntroductCanvas extends ThreeSceneManager {
  gltf: THREE.Group | undefined;
  constructor(
    gltf: THREE.Group,
    cameraPos: [number, number, number],
    canvasClassName: string,
    fov: number = 45,
    far: number = 2000,
    backgroundAlpha: boolean = false,
    backgroundColor: THREE.Color | THREE.ColorRepresentation = 0x000000
  ) {
    super(cameraPos, canvasClassName, fov, far, backgroundAlpha, backgroundColor);
    this.gltf = gltf;

    this.scene.add(this.gltf);

    // ライト
    const light = new LightSet();
    this.scene.add(light);

    //gltf
    this.gltf.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(this.gltf);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // モデル高低収まる距離を計算
    const fovRad = this.camera.fov * (Math.PI / 180); // ラジアンに変換
    const distanceByHeight = size.y / 2 / Math.tan(fovRad / 2);

    // 横
    const aspect = this.canvasWidth / this.canvasHeight;
    const fovHorizontal = 2 * Math.atan(Math.tan(fovRad / 2) * aspect);
    const distanceByWidth = size.x / 2 / Math.tan(fovHorizontal / 2);

    const distance = Math.max(distanceByHeight, distanceByWidth);
    this.camera.position.z = center.z + distance;
    this.camera.lookAt(center);
  }

  onAnimate() {}
}
