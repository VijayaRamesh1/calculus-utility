/**
 * Rate of Change Visualization
 * Interactive visualization demonstrating derivative concepts
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize KaTeX for the formula
  renderFormula();
  
  // Setup tooltip functionality for term definitions
  setupTermHighlights();
  
  // Initialize the 3D visualization
  initVisualization();
});

/**
 * Render the mathematical formula using KaTeX
 */
function renderFormula() {
  const formulaElement = document.getElementById('derivative-formula');
  const formula = "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}";
  
  katex.render(formula, formulaElement, {
    throwOnError: false,
    displayMode: true
  });
}

/**
 * Setup interactive term highlights with tooltips
 */
function setupTermHighlights() {
  const terms = document.querySelectorAll('.highlight-term');
  
  terms.forEach(term => {
    term.addEventListener('mouseenter', showDefinition);
    term.addEventListener('mouseleave', hideDefinition);
  });
}

function showDefinition(event) {
  const term = event.target;
  const definition = term.getAttribute('data-definition');
  
  const tooltip = document.createElement('div');
  tooltip.className = 'definition-tooltip';
  tooltip.textContent = definition;
  
  // Position tooltip
  const rect = term.getBoundingClientRect();
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.bottom + 5}px`;
  
  document.body.appendChild(tooltip);
  term.setAttribute('data-tooltip-id', Date.now());
  tooltip.id = term.getAttribute('data-tooltip-id');
}

function hideDefinition(event) {
  const term = event.target;
  const tooltipId = term.getAttribute('data-tooltip-id');
  const tooltip = document.getElementById(tooltipId);
  
  if (tooltip) {
    tooltip.remove();
  }
}

/**
 * Initialize the visualization and controls
 */
function initVisualization() {
  const container = document.getElementById('visualization-canvas');
  const viz = new RateOfChangeVisualization(container);
  
  // Setup slider controls
  const speedSlider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  
  speedSlider.addEventListener('input', function() {
    const speed = parseFloat(this.value);
    speedValue.textContent = speed.toFixed(1);
    viz.setSpeed(speed);
  });
  
  const intervalSlider = document.getElementById('interval-slider');
  const intervalValue = document.getElementById('interval-value');
  
  intervalSlider.addEventListener('input', function() {
    const interval = parseFloat(this.value);
    intervalValue.textContent = interval.toFixed(1);
    viz.setTimeInterval(interval);
  });
  
  // Setup play/pause button
  const playPauseButton = document.getElementById('play-pause');
  playPauseButton.addEventListener('click', function() {
    const isPlaying = viz.togglePlay();
    
    if (isPlaying) {
      this.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <rect x="6" y="4" width="4" height="16" fill="#225B7D"/>
          <rect x="14" y="4" width="4" height="16" fill="#225B7D"/>
        </svg>
      `;
    } else {
      this.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M8 5v14l11-7z" fill="#225B7D"/>
        </svg>
      `;
    }
  });
  
  // Setup reset button
  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', function() {
    viz.reset();
    
    // Also reset to paused state
    viz.state.playing = false;
    playPauseButton.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M8 5v14l11-7z" fill="#225B7D"/>
      </svg>
    `;
  });
}

/**
 * Visualization class for Rate of Change
 */
class RateOfChangeVisualization {
  constructor(container) {
    // Visualization state
    this.state = {
      speed: 5.0,
      timeInterval: 0.5,
      playing: false,
      time: 0
    };
    
    // Setup Three.js scene
    this.container = container;
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupControls();
    
    // Create visualization objects
    this.createRoad();
    this.createVehicle();
    this.createDistanceMarkers();
    this.createGraph();
    
    // Start animation loop
    this.animate();
    
    // Hide loading indicator
    setTimeout(() => {
      document.getElementById('loading-indicator').style.display = 'none';
    }, 800);
  }
  
  // Scene setup methods
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF0EBE1);
    this.scene.fog = new THREE.Fog(0xF0EBE1, 30, 100);
  }
  
  setupCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(5, 8, 15);
    this.camera.lookAt(0, 0, 0);
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);
    
    window.addEventListener('resize', () => this.handleResize());
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);
  }
  
  setupControls() {
    this.cameraAngle = 0;
    this.cameraHeight = 8;
    this.cameraDistance = 15;
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    
    this.updateCameraPosition();
  }
  
  updateCameraPosition() {
    const x = Math.sin(this.cameraAngle) * this.cameraDistance;
    const z = Math.cos(this.cameraAngle) * this.cameraDistance;
    
    this.camera.position.set(x, this.cameraHeight, z);
    this.camera.lookAt(this.cameraTarget);
  }
  
  // Create scene objects
  createRoad() {
    const roadGeometry = new THREE.PlaneGeometry(100, 4);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xE5E0D5,
      side: THREE.DoubleSide
    });
    
    this.road = new THREE.Mesh(roadGeometry, roadMaterial);
    this.road.rotation.x = -Math.PI / 2;
    this.road.position.y = -0.1;
    this.road.receiveShadow = true;
    this.scene.add(this.road);
    
    this.createRoadMarkings();
    
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xD6D0C4,
      side: THREE.DoubleSide
    });
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }
  
  createRoadMarkings() {
    const centerLineGeometry = new THREE.PlaneGeometry(100, 0.1);
    const centerLineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x225B7D,
      side: THREE.DoubleSide
    });
    
    const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = -0.05;
    this.scene.add(centerLine);
    
    for (let i = -1; i <= 1; i += 2) {
      const edgeLineGeometry = new THREE.PlaneGeometry(100, 0.1);
      const edgeLineMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x2A2520,
        side: THREE.DoubleSide
      });
      
      const edgeLine = new THREE.Mesh(edgeLineGeometry, edgeLineMaterial);
      edgeLine.rotation.x = -Math.PI / 2;
      edgeLine.position.y = -0.05;
      edgeLine.position.z = i * 1.95;
      this.scene.add(edgeLine);
    }
  }
  
  createVehicle() {
    this.vehicle = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x225B7D });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    body.castShadow = true;
    this.vehicle.add(body);
    
    const cabinGeometry = new THREE.BoxGeometry(1, 0.6, 0.8);
    const cabinMaterial = new THREE.MeshPhongMaterial({ color: 0x1A4B68 });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.y = 0.9;
    cabin.position.x = -0.2;
    cabin.castShadow = true;
    this.vehicle.add(cabin);
    
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xE5E0D5,
      shininess: 100 
    });
    
    const frontWindowGeometry = new THREE.PlaneGeometry(0.4, 0.4);
    const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
    frontWindow.position.set(0.3, 0.9, 0);
    frontWindow.rotation.y = Math.PI / 2;
    this.vehicle.add(frontWindow);
    
    for (let i = -1; i <= 1; i += 2) {
      const sideWindowGeometry = new THREE.PlaneGeometry(0.8, 0.4);
      const sideWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
      sideWindow.position.set(-0.2, 0.9, i * 0.4);
      sideWindow.rotation.y = i * Math.PI / 2;
      this.vehicle.add(sideWindow);
    }
    
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x2A2520 });
    
    const wheelPositions = [
      { x: 0.7, z: 0.6 },
      { x: 0.7, z: -0.6 },
      { x: -0.7, z: 0.6 },
      { x: -0.7, z: -0.6 }
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, 0.3, pos.z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      this.vehicle.add(wheel);
    });
    
    this.vehicle.position.x = -20;
    this.scene.add(this.vehicle);
    
    this.createVehicleTrail();
  }
  
  createVehicleTrail() {
    this.trailPoints = [];
    
    const trailMaterial = new THREE.LineBasicMaterial({ 
      color: 0x225B7D,
      transparent: true,
      opacity: 0.6 
    });
    
    const trailGeometry = new THREE.BufferGeometry();
    
    this.trail = new THREE.Line(trailGeometry, trailMaterial);
    this.scene.add(this.trail);
  }
  
  createDistanceMarkers() {
    this.markers = new THREE.Group();
    
    for (let x = -20; x <= 20; x += 5) {
      const postGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
      const postMaterial = new THREE.MeshPhongMaterial({ color: 0x554F47 });
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.set(x, 0.5, 2.5);
      post.castShadow = true;
      this.markers.add(post);
      
      const distance = Math.abs(x);
      const indicatorGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const indicatorMaterial = new THREE.MeshPhongMaterial({ 
        color: distance % 10 === 0 ? 0x225B7D : 0x554F47 
      });
      const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
      indicator.position.set(x, 1.2, 2.5);
      indicator.castShadow = true;
      this.markers.add(indicator);
    }
    
    this.scene.add(this.markers);
    
    this.createIntervalMarker();
  }
  
  createIntervalMarker() {
    this.intervalMarker = new THREE.Group();
    
    const postGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
    const postMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xC1A87C,
      transparent: true,
      opacity: 0.8
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 1;
    this.intervalMarker.add(post);
    
    const barGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.1);
    const barMaterial = new THREE.MeshPhongMaterial({ color: 0xC1A87C });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.y = 2;
    this.intervalMarker.add(bar);
    
    this.scene.add(this.intervalMarker);
    
    this.createIntervalLine();
  }
  
  createIntervalLine() {
    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0xC1A87C,
      dashSize: 0.3,
      gapSize: 0.1,
      linewidth: 1
    });
    
    const lineGeometry = new THREE.BufferGeometry();
    const linePoints = [
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 0.5, 0)
    ];
    lineGeometry.setFromPoints(linePoints);
    
    this.intervalLine = new THREE.Line(lineGeometry, lineMaterial);
    this.intervalLine.computeLineDistances();
    this.scene.add(this.intervalLine);
  }
  
  createGraph() {
    this.graph = new THREE.Group();
    
    const backgroundGeometry = new THREE.PlaneGeometry(8, 5);
    const backgroundMaterial = new THREE.MeshPhongMaterial({
      color: 0xF5F2E9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
    this.graph.add(background);
    
    const axesMaterial = new THREE.LineBasicMaterial({ color: 0x2A2520 });
    
    const xAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.9, -2.4, 0.01),
      new THREE.Vector3(3.9, -2.4, 0.01)
    ]);
    const xAxis = new THREE.Line(xAxisGeometry, axesMaterial);
    this.graph.add(xAxis);
    
    const yAxisGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.9, -2.4, 0.01),
      new THREE.Vector3(-3.9, 2.4, 0.01)
    ]);
    const yAxis = new THREE.Line(yAxisGeometry, axesMaterial);
    this.graph.add(yAxis);
    
    const gridMaterial = new THREE.LineDashedMaterial({
      color: 0xD6D0C4,
      dashSize: 0.2,
      gapSize: 0.1
    });
    
    for (let x = -3; x <= 3; x++) {
      if (x === 0) continue;
      
      const gridGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -2.4, 0.01),
        new THREE.Vector3(x, 2.4, 0.01)
      ]);
      const grid = new THREE.Line(gridGeometry, gridMaterial);
      grid.computeLineDistances();
      this.graph.add(grid);
    }
    
    for (let y = -2; y <= 2; y++) {
      if (y === 0) continue;
      
      const gridGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.9, y, 0.01),
        new THREE.Vector3(3.9, y, 0.01)
      ]);
      const grid = new THREE.Line(gridGeometry, gridMaterial);
      grid.computeLineDistances();
      this.graph.add(grid);
    }
    
    const plotMaterial = new THREE.LineBasicMaterial({ 
      color: 0x225B7D,
      linewidth: 2
    });
    
    this.plotGeometry = new THREE.BufferGeometry();
    this.plotLine = new THREE.Line(this.plotGeometry, plotMaterial);
    this.graph.add(this.plotLine);
    
    this.createGraphInterval();
    
    this.graph.position.set(10, 8, 5);
    this.graph.rotation.y = -Math.PI / 4;
    this.scene.add(this.graph);
  }
  
  createGraphInterval() {
    const intervalMaterial = new THREE.MeshBasicMaterial({ color: 0xC1A87C });
    
    const currentPointGeometry = new THREE.CircleGeometry(0.1, 16);
    this.currentPoint = new THREE.Mesh(currentPointGeometry, intervalMaterial);
    this.currentPoint.position.z = 0.02;
    this.graph.add(this.currentPoint);
    
    const intervalPointGeometry = new THREE.CircleGeometry(0.1, 16);
    this.intervalPoint = new THREE.Mesh(intervalPointGeometry, intervalMaterial);
    this.intervalPoint.position.z = 0.02;
    this.graph.add(this.intervalPoint);
    
    const connectorMaterial = new THREE.LineDashedMaterial({
      color: 0xC1A87C,
      dashSize: 0.2,
      gapSize: 0.1
    });
    
    const connectorGeometry = new THREE.BufferGeometry();
    this.intervalConnector = new THREE.Line(connectorGeometry, connectorMaterial);
    this.intervalConnector.computeLineDistances();
    this.graph.add(this.intervalConnector);
    
    const slopeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xC1A87C,
      linewidth: 2
    });
    
    const slopeGeometry = new THREE.BufferGeometry();
    this.slopeLine = new THREE.Line(slopeGeometry, slopeMaterial);
    this.graph.add(this.slopeLine);
  }
  
  // Animation and update methods
  update() {
    if (this.state.playing) {
      this.state.time += 0.016;
      
      if (this.vehicle.position.x > 20) {
        this.state.time = 0;
        this.vehicle.position.x = -20;
        this.trailPoints = [];
        this.updateTrail();
      }
    }
    
    const newX = -20 + (this.state.time * this.state.speed);
    this.vehicle.position.x = Math.min(newX, 20);
    
    this.vehicle.children.forEach(child => {
      if (child.geometry && child.geometry.type === 'CylinderGeometry') {
        child.rotation.x += this.state.playing ? 0.1 * this.state.speed : 0;
      }
    });
    
    if (this.state.playing || this.trailPoints.length === 0) {
      this.trailPoints.push(new THREE.Vector3(
        this.vehicle.position.x,
        0.1,
        this.vehicle.position.z
      ));
      
      if (this.trailPoints.length > 100) {
        this.trailPoints.shift();
      }
      
      this.updateTrail();
    }
    
    const intervalX = this.vehicle.position.x + (this.state.timeInterval * this.state.speed);
    this.intervalMarker.position.x = Math.min(intervalX, 20);
    
    this.updateIntervalLine();
    this.updateGraph();
  }
  
  updateTrail() {
    const trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailPoints);
    this.trail.geometry.dispose();
    this.trail.geometry = trailGeometry;
  }
  
  updateIntervalLine() {
    const linePoints = [
      new THREE.Vector3(
        this.vehicle.position.x,
        0.5,
        this.vehicle.position.z
      ),
      new THREE.Vector3(
        this.intervalMarker.position.x,
        0.5,
        this.intervalMarker.position.z
      )
    ];
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    this.intervalLine.geometry.dispose();
    this.intervalLine.geometry = lineGeometry;
    this.intervalLine.computeLineDistances();
  }
  
  updateGraph() {
    const graphPoints = [];
    const timeStart = Math.max(0, this.state.time - 3);
    
    for (let t = timeStart; t <= timeStart + 7; t += 0.1) {
      const x = -3.9 + ((t - timeStart) / 7) * 7.8;
      const distance = this.state.speed * t;
      const y = -2.4 + (distance / 40) * 4.8;
      
      graphPoints.push(new THREE.Vector3(x, y, 0.02));
    }
    
    const plotGeometry = new THREE.BufferGeometry().setFromPoints(graphPoints);
    this.plotLine.geometry.dispose();
    this.plotLine.geometry = plotGeometry;
    
    const currentTimeRatio = (this.state.time - timeStart) / 7;
    const currentX = -3.9 + currentTimeRatio * 7.8;
    const currentY = -2.4 + (this.state.speed * this.state.time / 40) * 4.8;
    
    this.currentPoint.position.x = currentX;
    this.currentPoint.position.y = currentY;
    
    const intervalTime = this.state.time + this.state.timeInterval;
    const intervalTimeRatio = (intervalTime - timeStart) / 7;
    const intervalX = -3.9 + intervalTimeRatio * 7.8;
    const intervalY = -2.4 + (this.state.speed * intervalTime / 40) * 4.8;
    
    this.intervalPoint.position.x = intervalX;
    this.intervalPoint.position.y = intervalY;
    
    const connectorPoints = [
      new THREE.Vector3(currentX, currentY, 0.02),
      new THREE.Vector3(intervalX, intervalY, 0.02)
    ];
    
    const connectorGeometry = new THREE.BufferGeometry().setFromPoints(connectorPoints);
    this.intervalConnector.geometry.dispose();
    this.intervalConnector.geometry = connectorGeometry;
    this.intervalConnector.computeLineDistances();
    
    const slopeLength = 1.0;
    const slope = this.state.speed;
    
    const slopePoints = [
      new THREE.Vector3(
        currentX - slopeLength/2,
        currentY - (slope * slopeLength/2),
        0.02
      ),
      new THREE.Vector3(
        currentX + slopeLength/2,
        currentY + (slope * slopeLength/2),
        0.02
      )
    ];
    
    const slopeGeometry = new THREE.BufferGeometry().setFromPoints(slopePoints);
    this.slopeLine.geometry.dispose();
    this.slopeLine.geometry = slopeGeometry;
  }
  
  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    this.update();
    this.renderer.render(this.scene, this.camera);
  }
  
  // Public methods for external control
  setSpeed(speed) {
    this.state.speed = speed;
  }
  
  setTimeInterval(interval) {
    this.state.timeInterval = interval;
  }
  
  togglePlay() {
    this.state.playing = !this.state.playing;
    return this.state.playing;
  }
  
  reset() {
    this.state.time = 0;
    this.vehicle.position.x = -20;
    this.trailPoints = [];
    this.updateTrail();
  }
}