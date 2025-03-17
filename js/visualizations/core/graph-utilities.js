// Graph utility functions for visualizations

const GraphUtils = {
  /**
   * Creates a 3D grid with axes and labels
   * @param {Object} options - Grid options
   * @returns {THREE.Group} Grid group containing all elements
   */
  createGrid: function(options = {}) {
    const {
      size = 10,
      divisions = 10,
      colorCenterLine = 0x444444,
      colorGrid = 0x888888,
      axisColors = {
        x: 0xff0000, // Red
        y: 0x00ff00, // Green
        z: 0x0000ff  // Blue
      },
      showLabels = true,
      labelSize = 0.5,
      labelStep = 2
    } = options;
    
    // Create container
    const gridGroup = new THREE.Group();
    
    // Add standard grid helper
    const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
    gridGroup.add(gridHelper);
    
    // Create axes
    const axisLength = size / 2 + 1; // Extend slightly beyond grid
    
    // X-axis
    const xAxisGeometry = new THREE.BufferGeometry();
    xAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0, axisLength, 0, 0
    ], 3));
    const xAxisMaterial = new THREE.LineBasicMaterial({ color: axisColors.x });
    const xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
    gridGroup.add(xAxis);
    
    // Y-axis
    const yAxisGeometry = new THREE.BufferGeometry();
    yAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0, 0, axisLength, 0
    ], 3));
    const yAxisMaterial = new THREE.LineBasicMaterial({ color: axisColors.y });
    const yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
    gridGroup.add(yAxis);
    
    // Z-axis
    const zAxisGeometry = new THREE.BufferGeometry();
    zAxisGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
      0, 0, 0, 0, 0, axisLength
    ], 3));
    const zAxisMaterial = new THREE.LineBasicMaterial({ color: axisColors.z });
    const zAxis = new THREE.Line(zAxisGeometry, zAxisMaterial);
    gridGroup.add(zAxis);
    
    // Add labels if enabled
    if (showLabels) {
      const loader = new THREE.FontLoader();
      const createLabels = function(font) {
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // Create axis labels (X, Y, Z)
        const createAxisLabel = (text, position, color) => {
          const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: labelSize,
            height: 0.1
          });
          const textMesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color }));
          textMesh.position.copy(position);
          gridGroup.add(textMesh);
        };
        
        createAxisLabel('X', new THREE.Vector3(axisLength + 0.5, 0, 0), axisColors.x);
        createAxisLabel('Y', new THREE.Vector3(0, axisLength + 0.5, 0), axisColors.y);
        createAxisLabel('Z', new THREE.Vector3(0, 0, axisLength + 0.5), axisColors.z);
        
        // Add numeric labels along axes
        for (let i = labelStep; i <= size / 2; i += labelStep) {
          // X axis positive
          createAxisLabel(i.toString(), new THREE.Vector3(i, -0.5, 0), axisColors.x);
          // X axis negative
          createAxisLabel((-i).toString(), new THREE.Vector3(-i, -0.5, 0), axisColors.x);
          
          // Y axis positive
          createAxisLabel(i.toString(), new THREE.Vector3(-0.5, i, 0), axisColors.y);
          // Y axis negative
          createAxisLabel((-i).toString(), new THREE.Vector3(-0.5, -i, 0), axisColors.y);
          
          // Z axis positive
          createAxisLabel(i.toString(), new THREE.Vector3(0, -0.5, i), axisColors.z);
          // Z axis negative
          createAxisLabel((-i).toString(), new THREE.Vector3(0, -0.5, -i), axisColors.z);
        }
      };
      
      // Note: In a real implementation, you would need to load an actual font
      // or use sprite-based labels which don't require font loading
    }
    
    return gridGroup;
  },
  
  /**
   * Creates a line representing a function in 3D space
   * @param {Function} fn - Function that maps x to y: f(x) = y
   * @param {Object} options - Line options
   * @returns {THREE.Line} Line object
   */
  createFunctionLine: function(fn, options = {}) {
    const {
      xRange = [-5, 5],
      segments = 100,
      color = 0xffffff,
      width = 2,
      zValue = 0
    } = options;
    
    const points = [];
    const xStart = xRange[0];
    const xEnd = xRange[1];
    const step = (xEnd - xStart) / segments;
    
    for (let x = xStart; x <= xEnd; x += step) {
      const y = fn(x);
      points.push(new THREE.Vector3(x, y, zValue));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: width });
    
    return new THREE.Line(geometry, material);
  },
  
  /**
   * Creates a point at a specific location on a function
   * @param {Function} fn - Function that maps x to y: f(x) = y
   * @param {number} x - X coordinate where to place the point
   * @param {Object} options - Point options
   * @returns {THREE.Mesh} Point object (sphere)
   */
  createPointOnFunction: function(fn, x, options = {}) {
    const {
      radius = 0.2,
      color = 0xffff00,
      zValue = 0,
      segments = 16
    } = options;
    
    const y = fn(x);
    const geometry = new THREE.SphereGeometry(radius, segments, segments);
    const material = new THREE.MeshBasicMaterial({ color });
    
    const point = new THREE.Mesh(geometry, material);
    point.position.set(x, y, zValue);
    
    return point;
  },
  
  /**
   * Creates a tangent line at a specific point on a function
   * @param {Function} fn - Function that maps x to y: f(x) = y
   * @param {number} x - X coordinate where to calculate tangent
   * @param {Object} options - Tangent line options
   * @returns {THREE.Line} Tangent line object
   */
  createTangentLine: function(fn, x, options = {}) {
    const {
      length = 2,
      color = 0xff0000,
      width = 2,
      zValue = 0
    } = options;
    
    // Calculate derivative/slope
    const h = 0.0001;
    const slope = (fn(x + h) - fn(x - h)) / (2 * h);
    
    // Calculate y at the point
    const y = fn(x);
    
    // Calculate endpoints of tangent line
    const halfLength = length / 2;
    const x1 = x - halfLength;
    const y1 = y - slope * halfLength;
    const x2 = x + halfLength;
    const y2 = y + slope * halfLength;
    
    // Create line geometry
    const points = [
      new THREE.Vector3(x1, y1, zValue),
      new THREE.Vector3(x2, y2, zValue)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: width });
    
    return new THREE.Line(geometry, material);
  },
  
  /**
   * Creates a secant line between two points on a function
   * @param {Function} fn - Function that maps x to y: f(x) = y
   * @param {number} x1 - First x coordinate
   * @param {number} x2 - Second x coordinate
   * @param {Object} options - Secant line options
   * @returns {THREE.Line} Secant line object
   */
  createSecantLine: function(fn, x1, x2, options = {}) {
    const {
      color = 0x00ffff,
      width = 2,
      zValue = 0,
      extendBeyondPoints = false,
      extensionFactor = 0.5
    } = options;
    
    // Calculate y values
    const y1 = fn(x1);
    const y2 = fn(x2);
    
    // Create points for the line
    let points;
    
    if (extendBeyondPoints) {
      // Calculate extension distances
      const dx = (x2 - x1) * extensionFactor;
      const slope = (y2 - y1) / (x2 - x1);
      const dy = dx * slope;
      
      // Extended points
      points = [
        new THREE.Vector3(x1 - dx, y1 - dy, zValue),
        new THREE.Vector3(x2 + dx, y2 + dy, zValue)
      ];
    } else {
      // Just use the two points directly
      points = [
        new THREE.Vector3(x1, y1, zValue),
        new THREE.Vector3(x2, y2, zValue)
      ];
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, linewidth: width });
    
    return new THREE.Line(geometry, material);
  }
};
