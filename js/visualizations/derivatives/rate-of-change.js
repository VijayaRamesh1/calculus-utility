// Rate of Change Visualization
class RateOfChangeVisualization extends Visualization {
  constructor(container, options = {}) {
    // Set default options for this visualization
    const defaultOptions = {
      speed: 1,
      timeInterval: 0.5,
      pathType: 'linear', // linear, quadratic, sinusoidal
      showTangent: true,
      showSecant: true,
      showLabels: true,
      graphScale: 1,
      initialPosition: { x: -7, y: 0, z: 0 }
    };
    
    super(container, {...defaultOptions, ...options});
    
    // Initialize state for animation
    this.time = 0;
    this.animationState = {
      playing: false,
      speed: this.parameters.speed
    };
    
    // Create position function based on path type
    this.updatePositionFunction();
    
    // Initialize visualization elements
    this.createObjects();
    this.setupControls(container);
    
    // Set initial camera position
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
    
    // Start the animation loop
    this.start();
  }
  
  createObjects() {
    // Create coordinate system and grid
    this.grid = GraphUtils.createGrid({
      size: 20,
      divisions: 20,
      showLabels: this.parameters.showLabels
    });
    this.scene.add(this.grid);
    
    // Create a path/road along which the vehicle will travel
    this.createPath();
    
    // Create the vehicle (simple car model)
    this.createVehicle();
    
    // Create distance-time graph
    this.createGraph();
    
    // Create indicators for rate of change
    this.createRateIndicators();
  }
  
  createPath() {
    // Create a visible path to represent the route of the vehicle
    const pathPoints = [];
    const pathSegments = 200;
    const tMax = 10; // Maximum time value
    
    for (let i = 0; i <= pathSegments; i++) {
      const t = (i / pathSegments) * tMax;
      const position = this.calculatePosition(t);
      pathPoints.push(new THREE.Vector3(position.x, position.y, position.z));
    }
    
    // Create curve from points
    const pathCurve = new THREE.CatmullRomCurve3(pathPoints);
    
    // Create tube geometry following the curve
    const pathGeometry = new THREE.TubeGeometry(pathCurve, 100, 0.1, 8, false);
    
    // Create material
    const pathMaterial = new THREE.MeshPhongMaterial({
      color: 0x4285F4,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    
    // Create mesh and add to scene
    this.pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
    this.scene.add(this.pathMesh);
  }
  
  createVehicle() {
    // Create a simple vehicle representation
    this.vehicle = new THREE.Group();
    
    // Vehicle body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.5);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xDB4437 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.2;
    this.vehicle.add(body);
    
    // Vehicle roof
    const roofGeometry = new THREE.BoxGeometry(0.4, 0.25, 0.5);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xDB4437 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.525;
    roof.position.x = -0.1;
    this.vehicle.add(roof);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    // Front-left wheel
    const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFL.rotation.z = Math.PI / 2;
    wheelFL.position.set(0.3, 0, 0.3);
    this.vehicle.add(wheelFL);
    
    // Front-right wheel
    const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelFR.rotation.z = Math.PI / 2;
    wheelFR.position.set(0.3, 0, -0.3);
    this.vehicle.add(wheelFR);
    
    // Rear-left wheel
    const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRL.rotation.z = Math.PI / 2;
    wheelRL.position.set(-0.3, 0, 0.3);
    this.vehicle.add(wheelRL);
    
    // Rear-right wheel
    const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheelRR.rotation.z = Math.PI / 2;
    wheelRR.position.set(-0.3, 0, -0.3);
    this.vehicle.add(wheelRR);
    
    // Add vehicle to scene
    this.scene.add(this.vehicle);
    
    // Position at the start of the path
    const initialPosition = this.calculatePosition(0);
    this.vehicle.position.copy(initialPosition);
  }
  
  createGraph() {
    // Create a graph group
    this.graph = new THREE.Group();
    this.graph.position.set(0, 6, 0);
    
    // Graph axes
    const axesHelper = new THREE.AxesHelper(6);
    this.graph.add(axesHelper);
    
    // Create x-axis label (Time)
    const timeLabel = new THREE.Mesh(
      new THREE.TextGeometry('Time', { size: 0.4, height: 0.1 }),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    timeLabel.position.set(6.2, 0, 0);
    this.graph.add(timeLabel);
    
    // Create y-axis label (Distance)
    const distanceLabel = new THREE.Mesh(
      new THREE.TextGeometry('Distance', { size: 0.4, height: 0.1 }),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    distanceLabel.position.set(0, 6.2, 0);
    distanceLabel.rotation.z = Math.PI / 2;
    this.graph.add(distanceLabel);
    
    // Create function line for position vs time
    const positionFn = (t) => {
      const position = this.calculatePosition(t);
      // For the graph, we'll use the x position as the function value
      return position.x + 8; // Shift to keep positive
    };
    
    this.functionLine = GraphUtils.createFunctionLine(positionFn, {
      xRange: [0, 10],
      segments: 100,
      color: 0x4285F4,
      width: 2
    });
    this.graph.add(this.functionLine);
    
    // Add current position indicator
    this.positionMarker = GraphUtils.createPointOnFunction(positionFn, 0, {
      radius: 0.15,
      color: 0xF4B400
    });
    this.graph.add(this.positionMarker);
    
    // Add graph to scene
    this.scene.add(this.graph);
  }
  
  createRateIndicators() {
    // Create tangent line to show instantaneous rate of change
    this.tangentLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0x0F9D58, linewidth: 3 })
    );
    this.graph.add(this.tangentLine);
    
    // Create secant line to show average rate of change
    this.secantLine = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xDB4437, linewidth: 3, dashSize: 0.2, gapSize: 0.1 })
    );
    this.graph.add(this.secantLine);
    
    // Create previous position marker
    this.prevPositionMarker = GraphUtils.createPointOnFunction((t) => {
      const position = this.calculatePosition(t);
      return position.x + 8;
    }, -this.parameters.timeInterval, {
      radius: 0.15,
      color: 0xF4B400,
      opacity: 0.5
    });
    this.graph.add(this.prevPositionMarker);
    
    // Create visual indicators for velocity and average velocity
    this.createVelocityArrows();
  }
  
  createVelocityArrows() {
    // Instantaneous velocity arrow
    const velocityArrowGeometry = new THREE.ConeGeometry(0.2, 0.6, 12);
    const velocityArrowMaterial = new THREE.MeshBasicMaterial({ color: 0x0F9D58 });
    this.velocityArrow = new THREE.Mesh(velocityArrowGeometry, velocityArrowMaterial);
    this.velocityArrow.rotation.z = -Math.PI / 2; // Point along x-axis initially
    this.scene.add(this.velocityArrow);
    
    // Velocity arrow shaft
    const velocityLineGeometry = new THREE.BoxGeometry(1, 0.05, 0.05);
    const velocityLineMaterial = new THREE.MeshBasicMaterial({ color: 0x0F9D58 });
    this.velocityLine = new THREE.Mesh(velocityLineGeometry, velocityLineMaterial);
    this.velocityLine.position.x = 0.5; // Offset to line up with arrow
    this.velocityArrow.add(this.velocityLine);
    
    // Average velocity arrow (similar to instantaneous but different color)
    const avgVelocityArrowGeometry = new THREE.ConeGeometry(0.2, 0.6, 12);
    const avgVelocityArrowMaterial = new THREE.MeshBasicMaterial({ color: 0xDB4437 });
    this.avgVelocityArrow = new THREE.Mesh(avgVelocityArrowGeometry, avgVelocityArrowMaterial);
    this.avgVelocityArrow.rotation.z = -Math.PI / 2; // Point along x-axis initially
    this.scene.add(this.avgVelocityArrow);
    
    // Average velocity arrow shaft
    const avgVelocityLineGeometry = new THREE.BoxGeometry(1, 0.05, 0.05);
    const avgVelocityLineMaterial = new THREE.MeshBasicMaterial({ color: 0xDB4437 });
    this.avgVelocityLine = new THREE.Mesh(avgVelocityLineGeometry, avgVelocityLineMaterial);
    this.avgVelocityLine.position.x = 0.5; // Offset to line up with arrow
    this.avgVelocityArrow.add(this.avgVelocityLine);
  }
  
  updatePositionFunction() {
    // Create the appropriate position function based on the selected path type
    this.positionFunction = MathUtils.createPositionFunction({
      type: this.parameters.pathType,
      initialPosition: this.parameters.initialPosition.x,
      velocity: this.parameters.speed,
      acceleration: 0.2,
      frequency: 0.5,
      amplitude: 2
    });
  }
  
  calculatePosition(t) {
    // Get the x position from our position function
    const x = this.positionFunction(t);
    
    // For simplicity, y is fixed and z is 0
    return new THREE.Vector3(x, 0, 0);
  }
  
  updateVisualization() {
    // Update time if animation is playing
    if (this.animationState.playing) {
      this.time += 0.016 * this.animationState.speed; // ~60fps times speed factor
    }
    
    // Calculate current and previous positions
    const currentPosition = this.calculatePosition(this.time);
    const prevTime = Math.max(0, this.time - this.parameters.timeInterval);
    const prevPosition = this.calculatePosition(prevTime);
    
    // Update vehicle position
    this.vehicle.position.copy(currentPosition);
    
    // Calculate velocity (derivative of position)
    const velocity = MathUtils.derivative(this.positionFunction, this.time);
    
    // Calculate average velocity
    const avgVelocity = MathUtils.averageRateOfChange(this.positionFunction, prevTime, this.time);
    
    // Update position marker on graph
    this.positionMarker.position.x = this.time;
    this.positionMarker.position.y = currentPosition.x + 8; // Shifted for visibility
    
    // Update previous position marker
    this.prevPositionMarker.position.x = prevTime;
    this.prevPositionMarker.position.y = prevPosition.x + 8;
    
    // Update tangent line (instantaneous rate of change/slope)
    if (this.parameters.showTangent) {
      // We'll create a line extending from the current point with the calculated slope
      const tangentLength = 1;
      const x1 = this.time - tangentLength / 2;
      const y1 = (currentPosition.x + 8) - velocity * tangentLength / 2;
      const x2 = this.time + tangentLength / 2;
      const y2 = (currentPosition.x + 8) + velocity * tangentLength / 2;
      
      // Create points array and update geometry
      const tangentPoints = [
        new THREE.Vector3(x1, y1, 0),
        new THREE.Vector3(x2, y2, 0)
      ];
      this.tangentLine.geometry.dispose();
      this.tangentLine.geometry = new THREE.BufferGeometry().setFromPoints(tangentPoints);
      
      // Make tangent line visible
      this.tangentLine.visible = true;
    } else {
      this.tangentLine.visible = false;
    }
    
    // Update secant line (average rate of change)
    if (this.parameters.showSecant) {
      // Create a line between the current and previous points
      const secantPoints = [
        new THREE.Vector3(prevTime, prevPosition.x + 8, 0),
        new THREE.Vector3(this.time, currentPosition.x + 8, 0)
      ];
      this.secantLine.geometry.dispose();
      this.secantLine.geometry = new THREE.BufferGeometry().setFromPoints(secantPoints);
      
      // Make secant line visible
      this.secantLine.visible = true;
    } else {
      this.secantLine.visible = false;
    }
    
    // Update velocity arrows
    // Instantaneous velocity arrow
    this.velocityArrow.position.copy(currentPosition);
    this.velocityArrow.position.y += 0.5; // Slightly above the vehicle
    this.velocityLine.scale.x = Math.abs(velocity); // Length proportional to speed
    
    // Average velocity arrow
    this.avgVelocityArrow.position.copy(new THREE.Vector3(
      (currentPosition.x + prevPosition.x) / 2,
      0.5,
      0
    ));
    this.avgVelocityLine.scale.x = Math.abs(avgVelocity);
    
    // Update UI displays if they exist
    this.updateUIDisplays(velocity, avgVelocity);
  }
  
  updateUIDisplays(velocity, avgVelocity) {
    // Update velocity display
    const velocityDisplay = document.getElementById('velocity-value');
    if (velocityDisplay) {
      velocityDisplay.textContent = velocity.toFixed(2);
    }
    
    // Update average velocity display
    const avgVelocityDisplay = document.getElementById('avg-velocity-value');
    if (avgVelocityDisplay) {
      avgVelocityDisplay.textContent = avgVelocity.toFixed(2);
    }
    
    // Update time interval display
    const timeIntervalDisplay = document.getElementById('time-interval-value');
    if (timeIntervalDisplay) {
      timeIntervalDisplay.textContent = this.parameters.timeInterval.toFixed(2);
    }
    
    // Update current time display
    const currentTimeDisplay = document.getElementById('current-time-value');
    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = this.time.toFixed(2);
    }
  }
  
  setupControls(container) {
    // Find or create controls container
    let controlsContainer = container.parentElement.querySelector('.controls');
    if (!controlsContainer) {
      controlsContainer = document.createElement('div');
      controlsContainer.className = 'controls';
      container.parentElement.appendChild(controlsContainer);
    }
    
    // Create main control panel
    const controlPanel = InteractionUtils.createControlPanel({
      title: 'Rate of Change Controls',
      collapsible: true,
      initiallyCollapsed: false
    });
    
    // Add playback controls
    const playbackControls = InteractionUtils.createPlaybackControls({
      includePlay: true,
      includePause: true,
      includeReset: true,
      includeSpeed: true,
      speedOptions: [0.5, 1, 1.5, 2]
    }, {
      onPlay: () => {
        this.animationState.playing = true;
      },
      onPause: () => {
        this.animationState.playing = false;
      },
      onReset: () => {
        this.time = 0;
        this.updateVisualization();
      },
      onSpeedChange: (speed) => {
        this.animationState.speed = speed;
      }
    });
    controlPanel.addControl(playbackControls);
    
    // Add time interval slider
    const timeIntervalSlider = InteractionUtils.createSlider({
      id: 'time-interval-slider',
      label: 'Time Interval:',
      min: 0.1,
      max: 3,
      step: 0.1,
      value: this.parameters.timeInterval
    }, (value) => {
      this.parameters.timeInterval = value;
      this.updateVisualization();
    });
    controlPanel.addControl(timeIntervalSlider);
    
    // Add path type dropdown
    const pathTypeDropdown = InteractionUtils.createDropdown({
      id: 'path-type-dropdown',
      label: 'Path Type:',
      options: [
        { value: 'linear', label: 'Linear (Constant Velocity)' },
        { value: 'quadratic', label: 'Quadratic (Acceleration)' },
        { value: 'sinusoidal', label: 'Sinusoidal (Periodic)' }
      ],
      defaultValue: this.parameters.pathType
    }, (value) => {
      this.parameters.pathType = value;
      this.updatePositionFunction();
      this.createPath(); // Recreate the path
    });
    controlPanel.addControl(pathTypeDropdown);
    
    // Add toggle for tangent line
    const tangentToggle = InteractionUtils.createToggle({
      id: 'tangent-toggle',
      label: 'Show Instantaneous Rate (Tangent Line):',
      checked: this.parameters.showTangent
    }, (checked) => {
      this.parameters.showTangent = checked;
      this.updateVisualization();
    });
    controlPanel.addControl(tangentToggle);
    
    // Add toggle for secant line
    const secantToggle = InteractionUtils.createToggle({
      id: 'secant-toggle',
      label: 'Show Average Rate (Secant Line):',
      checked: this.parameters.showSecant
    }, (checked) => {
      this.parameters.showSecant = checked;
      this.updateVisualization();
    });
    controlPanel.addControl(secantToggle);
    
    // Add info display panel
    const infoPanel = InteractionUtils.createControlPanel({
      title: 'Information',
      collapsible: true,
      initiallyCollapsed: false,
      className: 'info-panel'
    });
    
    // Add velocity display
    const velocityInfo = document.createElement('div');
    velocityInfo.className = 'info-item';
    velocityInfo.innerHTML = `
      <span class="info-label">Instantaneous Velocity:</span>
      <span id="velocity-value" class="info-value">0.00</span>
      <span class="info-unit">units/s</span>
    `;
    infoPanel.addControl(velocityInfo);
    
    // Add average velocity display
    const avgVelocityInfo = document.createElement('div');
    avgVelocityInfo.className = 'info-item';
    avgVelocityInfo.innerHTML = `
      <span class="info-label">Average Velocity:</span>
      <span id="avg-velocity-value" class="info-value">0.00</span>
      <span class="info-unit">units/s</span>
    `;
    infoPanel.addControl(avgVelocityInfo);
    
    // Add time interval display
    const timeIntervalInfo = document.createElement('div');
    timeIntervalInfo.className = 'info-item';
    timeIntervalInfo.innerHTML = `
      <span class="info-label">Time Interval:</span>
      <span id="time-interval-value" class="info-value">${this.parameters.timeInterval.toFixed(2)}</span>
      <span class="info-unit">s</span>
    `;
    infoPanel.addControl(timeIntervalInfo);
    
    // Add current time display
    const currentTimeInfo = document.createElement('div');
    currentTimeInfo.className = 'info-item';
    currentTimeInfo.innerHTML = `
      <span class="info-label">Current Time:</span>
      <span id="current-time-value" class="info-value">0.00</span>
      <span class="info-unit">s</span>
    `;
    infoPanel.addControl(currentTimeInfo);
    
    // Add explanatory text
    const explanationPanel = InteractionUtils.createControlPanel({
      title: 'Explanation',
      collapsible: true,
      initiallyCollapsed: true,
      className: 'explanation-panel'
    });
    
    const explanationText = document.createElement('div');
    explanationText.className = 'explanation-text';
    explanationText.innerHTML = `
      <p>This visualization demonstrates the concept of rate of change in calculus, specifically how derivatives measure the instantaneous rate of change of a quantity with respect to another.</p>
      <p>In this case, we're visualizing a vehicle moving along a path, and we're measuring:</p>
      <ul>
        <li><span style="color: #0F9D58;">Instantaneous velocity</span> (derivative): The velocity at a specific moment in time, shown by the tangent line on the graph and the green arrow.</li>
        <li><span style="color: #DB4437;">Average velocity</span> (average rate of change): The average velocity over a time interval, shown by the secant line on the graph and the red arrow.</li>
      </ul>
      <p>As the time interval gets smaller, the average rate of change (secant slope) approaches the instantaneous rate of change (tangent slope). This is the fundamental concept behind derivatives in calculus.</p>
      <p>The derivative of position with respect to time is velocity, which is what a car's speedometer shows.</p>
    `;
    explanationPanel.addControl(explanationText);
    
    // Add all panels to the controls container
    controlsContainer.appendChild(controlPanel);
    controlsContainer.appendChild(infoPanel);
    controlsContainer.appendChild(explanationPanel);
  }
  
  // Override the parent's onParameterChange method if needed
  onParameterChange(key, value) {
    super.onParameterChange(key, value);
    
    // Additional parameter-specific updates
    if (key === 'pathType') {
      this.updatePositionFunction();
      this.createPath();
    }
  }
}
