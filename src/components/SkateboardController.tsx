import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface Dimensions {
  x: number;
  y: number;
  z: number;
}

export default class SkateboardController {
  private scene: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private world: CANNON.World;
  private skateboardBody!: CANNON.Body;
  private skateboardMesh!: THREE.Mesh;
  private clock!: THREE.Clock;
  private keyMap: { [id: string]: boolean } = {};

  constructor(scene: THREE.Scene, world: CANNON.World) {
    this.scene = scene;
    this.world = world;
    this.initialize();
  }

  private initialize() {
    // Camera and rendering setup
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    console.log('Camera and renderer initialized');

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);
    console.log('Light added to the scene');

    // Physics
    this.setupPhysicsWorld();

    // Skateboard setup
    this.setupSkateboard();

    // Event Listeners
    this.initEventListeners();
    
    // Start animation loop
    this.animate();
  }

  private setupPhysicsWorld() {
    this.world.gravity.set(0, -9.82, 0);
    console.log('Physics world initialized with gravity:', this.world.gravity);

    // Ground plane
    const groundMaterial = new CANNON.Material('groundMaterial');
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    const groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    this.world.addBody(groundBody);
    console.log('Ground plane added to physics world');
  }

  private setupSkateboard() {
    // Define skateboard dimensions
    const skateboardDimensions: Dimensions = { x: 1, y: 0.2, z: 2 };

    // Create skateboard body
    const skateboardMaterial = new CANNON.Material('skateboardMaterial');
    const skateboardShape = new CANNON.Box(new CANNON.Vec3(skateboardDimensions.x / 2, skateboardDimensions.y / 2, skateboardDimensions.z / 2));
    this.skateboardBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 1, 0),
      material: skateboardMaterial,
    });
    this.skateboardBody.addShape(skateboardShape);
    this.world.addBody(this.skateboardBody);
    console.log('Skateboard body added to physics world');

    // Mesh for visualization
    const skateboardGeometry = new THREE.BoxGeometry(skateboardDimensions.x, skateboardDimensions.y, skateboardDimensions.z);
    this.skateboardMesh = new THREE.Mesh(skateboardGeometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    this.scene.add(this.skateboardMesh);
    console.log('Skateboard mesh added to scene');

    this.clock = new THREE.Clock();
  }

  private initEventListeners() {
    document.addEventListener('keydown', (e) => {
      this.keyMap[e.code] = true;
      console.log(`Key down: ${e.code}`);
    });

    document.addEventListener('keyup', (e) => {
      this.keyMap[e.code] = false;
      console.log(`Key up: ${e.code}`);
    });
  }

  private applyControls() {
    // Movement controls
    if (this.keyMap['KeyW'] || this.keyMap['ArrowUp']) {
      this.skateboardBody.applyLocalForce(new CANNON.Vec3(0, 0, -5), new CANNON.Vec3(0, 0, 0));
      console.log('Applying forward force');
    }
    if (this.keyMap['KeyS'] || this.keyMap['ArrowDown']) {
      this.skateboardBody.applyLocalForce(new CANNON.Vec3(0, 0, 5), new CANNON.Vec3(0, 0, 0));
      console.log('Applying backward force');
    }
    if (this.keyMap['KeyA'] || this.keyMap['ArrowLeft']) {
      this.skateboardBody.angularVelocity.set(0, 1, 0);
      console.log('Applying left rotation');
    }
    if (this.keyMap['KeyD'] || this.keyMap['ArrowRight']) {
      this.skateboardBody.angularVelocity.set(0, -1, 0);
      console.log('Applying right rotation');
    }
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.world.step(1 / 60, delta);

    // Apply movement and update
    this.applyControls();

    // Update skateboard position and orientation
    this.skateboardMesh.position.copy(this.skateboardBody.position as any);
    this.skateboardMesh.quaternion.copy(this.skateboardBody.quaternion as any);

    // Render the scene
    this.renderer.render(this.scene, this.camera);
    console.log('Rendering frame');
  }
}