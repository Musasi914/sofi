import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class OrbitCon extends OrbitControls {
  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);

    // 滑らか
    // this.enableDamping = true;
    // this.dampingFactor = 0.03;

    // ズーム範囲
    // this.minDistance = 8;
    // this.maxDistance = 15;

    // パン範囲
    // this.minPolarAngle = Math.PI / 8;
    // this.maxPolarAngle = Math.PI / 2.1;
    // this.autoRotate = true;
  }
}
