import * as THREE from 'three';
import * as CANNON from 'cannon-es';

class SkateboardController {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private world: CANNON.World;
  private skateboardBody: CANNON.Body;
  private skateboardMesh: THREE.Mesh;
  private clock: THREE.Clock;
  private keyMap: { [id: string]: boolean } = {};

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);
    console.log('Light added to scene');

    // Initialize physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    console.log('Cannon physics world initialized with gravity:', this.world.gravity);

    // Ground plane
    const groundMaterial = new CANNON.Material('groundMaterial');
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    const groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    this.world.addBody(groundBody);
    console.log('Ground plane added to physics world');

    // Create a skateboard body
    const skateboardMaterial = new CANNON.Material('skateboardMaterial');
    const skateboardShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 1));  // Simplified skateboard
    this.skateboardBody = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 1, 0), material: skateboardMaterial });
    this.skateboardBody.addShape(skateboardShape);
    this.world.addBody(this.skateboardBody);
    console.log('Skateboard body added to physics world');

    // Mesh for visualization
    const skateboardGeometry = new THREE.BoxGeometry(1, 0.2, 2);
    this.skateboardMesh = new THREE.Mesh(skateboardGeometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    this.scene.add(this.skateboardMesh);
    console.log('Skateboard mesh added to scene');

    this.clock = new THREE.Clock();
    this.initEvents();

    console.log('Starting animation loop');
    this.animate();
  }

  private initEvents() {
    document.addEventListener('keydown', (e) => {
      this.keyMap[e.code] = true;
      console.log(`Key down: ${e.code}`);
    });

    document.addEventListener('keyup', (e) => {
      this.keyMap[e.code] = false;
      console.log(`Key up: ${e.code}`);
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.world.step(1 / 60, delta);

    // Update skateboard position and apply controls
    this.skateboardMesh.position.copy(this.skateboardBody.position as any);
    this.skateboardMesh.quaternion.copy(this.skateboardBody.quaternion as any);

    // Movement controls
    if (this.keyMap['KeyW'] || this.keyMap['ArrowUp']) {
      this.skateboardBody.applyLocalForce(new CANNON.Vec3(0, 0, -5), new CANNON.Vec3(0, 0, 0));
    }
    if (this.keyMap['KeyS'] || this.keyMap['ArrowDown']) {
      this.skateboardBody.applyLocalForce(new CANNON.Vec3(0, 0, 5), new CANNON.Vec3(0, 0, 0));
    }
    if (this.keyMap['KeyA'] || this.keyMap['ArrowLeft']) {
      this.skateboardBody.angularVelocity.set(0, 1, 0);
    }
    if (this.keyMap['KeyD'] || this.keyMap['ArrowRight']) {
      this.skateboardBody.angularVelocity.set(0, -1, 0);
    }
    this.renderer.render(this.scene, this.camera);
  }
}

export default SkateboardController;