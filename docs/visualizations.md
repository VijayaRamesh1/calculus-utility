# Visualization Implementation Guide

## Visualization Architecture

All visualizations are built on top of the base visualization class in `js/visualizations/core/visualization-base.js`. This provides common functionality for:

- Setting up the canvas
- Handling user interactions
- Updating the visualization
- Responsiveness

## Creating a New Visualization

1. Create a new JavaScript file in the appropriate directory under `js/visualizations/`
2. Extend the base visualization class
3. Implement the required methods:
   - `initialize()`: Set up the visualization
   - `update()`: Update the visualization (called on user interaction or data change)
   - `render()`: Render the visualization

## Example Implementation

```javascript
class RateOfChangeVisualization extends BaseVisualization {
    constructor(container, options) {
        super(container, options);
        this.initialize();
    }

    initialize() {
        // Set up the visualization
    }

    update(data) {
        // Update the visualization based on new data
    }

    render() {
        // Render the visualization
    }
}
```

## Best Practices

- Use the shared utilities in `js/visualizations/core/`
- Make visualizations interactive but intuitive
- Include clear labels and instructions
- Ensure visualizations work across different screen sizes
- Use consistent colors and styling
