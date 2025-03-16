# Developer Guide

## Project Structure

The Calculus Utility project is organized as follows:

- **index.html**: Main landing page
- **css/**: Stylesheets for the application
- **js/**: JavaScript code
  - **visualizations/**: Interactive visualizations
  - **content/**: Content data (JSON)
  - **utilities/**: Helper utilities
- **assets/**: Static assets like icons and models
- **calculus/**: Topic-specific pages
- **libs/**: Third-party libraries
- **docs/**: Documentation

## Development Workflow

1. Clone the repository
2. Make changes to the relevant files
3. Test locally
4. Push changes to GitHub

## Adding a New Visualization

To add a new visualization:

1. Create a new JavaScript file in the appropriate directory under `js/visualizations/`
2. Create a new HTML page in the appropriate directory under `calculus/`
3. Create a new content JSON file under `js/content/topics/`
4. Update the navigation links as needed

## Coding Standards

- Use consistent indentation (2 spaces)
- Use clear, descriptive variable and function names
- Comment your code appropriately
- Follow a modular approach
