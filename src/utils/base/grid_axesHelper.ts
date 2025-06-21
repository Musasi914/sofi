import * as THREE from "three";

export default class GridAxesHelper extends THREE.Group {
  grid: THREE.GridHelper;
  axes: THREE.AxesHelper;

  constructor(radius: number = 100, divisions?: number, color?: THREE.Color | number) {
    super();

    this.grid = new THREE.GridHelper(radius * 2, divisions, color, color);
    this.add(this.grid);

    this.axes = new THREE.AxesHelper(radius);
    this.add(this.axes);
  }
}
