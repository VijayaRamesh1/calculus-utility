// Base visualization class
class Visualization {
  constructor(container, options = {}) {
    // Setup scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
    
    // Add controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    
    // Setup common elements
    this.setupGrid();
    this.setupLighting();
    
    // Initialize parameters
    this.parameters = { ...options };
    
    // Animation state
    this.lastTime = 0;
    this.frameRate = 60;
    this.timeStep = 1000 / this.frameRate;
    
    // Bind animate method to ensure correct 'this' context
    this.animate = this.animate.bind(this);
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  // Common methods
  setupGrid() {
    const gridHelper = new THREE.GridHelper(20, 20);
    this.scene.add(gridHelper);
  }
  
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    this.scene.add(directionalLight);
  }
  
  onParameterChange(key, value) {
    this.parameters[key] = value;
    this.updateVisualization();
  }
  
  animate(currentTime) {
    requestAnimationFrame(this.animate);
    
    // Limit frame rate for consistency
    if (currentTime - this.lastTime < this.timeStep) return;
    this.lastTime = currentTime;
    
    // Update controls
    this.controls.update();
    
    // Update visualization
    this.updateVisualization();
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  handleResize() {
    const container = this.renderer.domElement.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  start() {
    this.animate(0);
  }
  
  // Methods to be implemented by subclasses
  createObjects() {
    console.warn('createObjects method should be implemented by subclass');
  }
  
  updateVisualization() {
    console.warn('updateVisualization method should be implemented by subclass');
  }
}
