// Math utility functions for visualizations

const MathUtils = {
  /**
   * Linear interpolation between two values
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  lerp: function(a, b, t) {
    return a + (b - a) * t;
  },
  
  /**
   * Converts degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  degToRad: function(degrees) {
    return degrees * Math.PI / 180;
  },
  
  /**
   * Converts radians to degrees
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   */
  radToDeg: function(radians) {
    return radians * 180 / Math.PI;
  },
  
  /**
   * Maps a value from one range to another
   * @param {number} value - Value to map
   * @param {number} fromMin - Input range minimum
   * @param {number} fromMax - Input range maximum
   * @param {number} toMin - Output range minimum
   * @param {number} toMax - Output range maximum
   * @returns {number} Mapped value
   */
  map: function(value, fromMin, fromMax, toMin, toMax) {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
  },
  
  /**
   * Clamps a value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  clamp: function(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  /**
   * Calculates the average of an array of numbers
   * @param {Array<number>} values - Array of numbers
   * @returns {number} Average value
   */
  average: function(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  },
  
  /**
   * Calculates the derivative of a function at a point using central difference
   * @param {Function} fn - Function to differentiate
   * @param {number} x - Point at which to calculate derivative
   * @param {number} h - Step size (default: 0.0001)
   * @returns {number} Approximate derivative value
   */
  derivative: function(fn, x, h = 0.0001) {
    return (fn(x + h) - fn(x - h)) / (2 * h);
  },
  
  /**
   * Calculates the average rate of change between two points
   * @param {Function} fn - Function
   * @param {number} x1 - First x value
   * @param {number} x2 - Second x value
   * @returns {number} Average rate of change
   */
  averageRateOfChange: function(fn, x1, x2) {
    return (fn(x2) - fn(x1)) / (x2 - x1);
  },
  
  /**
   * Creates a function representing a position over time (e.g., distance)
   * @param {Object} params - Parameters for the function
   * @returns {Function} Position function f(t)
   */
  createPositionFunction: function(params = {}) {
    const {
      type = 'linear',  // linear, quadratic, sinusoidal
      initialPosition = 0,
      velocity = 1,
      acceleration = 0,
      frequency = 1,
      amplitude = 1
    } = params;
    
    switch (type) {
      case 'linear':
        return (t) => initialPosition + velocity * t;
      case 'quadratic':
        return (t) => initialPosition + velocity * t + 0.5 * acceleration * t * t;
      case 'sinusoidal':
        return (t) => initialPosition + amplitude * Math.sin(frequency * t);
      default:
        return (t) => t; // Identity function as fallback
    }
  }
};
