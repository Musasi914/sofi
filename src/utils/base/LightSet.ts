import * as THREE from "three";

export default class LightSet extends THREE.Group {
  constructor() {
    super();

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(0, 1, 10);
    this.add(dirLight);

    // const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
    // pointLight.position.set(0, 100, 90);
    // this.add(pointLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.add(ambLight);
  }
}
