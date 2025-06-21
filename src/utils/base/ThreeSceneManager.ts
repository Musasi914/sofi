import * as THREE from "three";

export default class ThreeSceneManager {
  private canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor(
    cameraPos: [number, number, number],
    canvasClassName: string,
    fov: number = 45,
    far: number = 2000,
    backgroundAlpha: boolean = false,
    backgroundColor: THREE.Color | THREE.ColorRepresentation = 0x000000
  ) {
    const canvas = document.querySelector(`.${canvasClassName}`) as HTMLCanvasElement | null;
    if (!canvas) throw new Error("そのようなクラス名を持つ要素はない");
    this.canvas = canvas;
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(fov, this.canvasWidth / this.canvasHeight, 0.1, far);
    this.camera.position.set(...cameraPos);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: window.devicePixelRatio === 1, alpha: backgroundAlpha });
    !backgroundAlpha && this.renderer.setClearColor(backgroundColor);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.canvasWidth, this.canvasHeight);

    window.addEventListener("resize", () => {
      this.handleResize();
    });

    this.startRendering();
  }

  private handleResize() {
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;

    this.camera.aspect = this.canvasWidth / this.canvasHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  startRendering() {
    this.renderer.setAnimationLoop(this.update.bind(this));
  }
  private update() {
    this.onAnimate();
    this.renderer.render(this.scene, this.camera);
  }

  onAnimate() {
    throw new Error("onAnimateを継承先でオーバーライドしてください");
  }
}
