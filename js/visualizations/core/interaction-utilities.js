// Interaction utility functions for visualizations

const InteractionUtils = {
  /**
   * Creates a slider control with label
   * @param {Object} options - Slider options
   * @param {Function} onChangeCallback - Callback when value changes
   * @returns {HTMLElement} Container element with slider and label
   */
  createSlider: function(options, onChangeCallback) {
    const {
      id,
      label,
      min = 0,
      max = 100,
      step = 1,
      value = 50,
      width = '100%'
    } = options;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'slider-container';
    container.style.width = width;
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    container.appendChild(labelElement);
    
    // Create value display
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = value;
    container.appendChild(valueDisplay);
    
    // Create slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    
    // Add event listener
    slider.addEventListener('input', function() {
      const newValue = parseFloat(this.value);
      valueDisplay.textContent = newValue;
      if (onChangeCallback) {
        onChangeCallback(newValue);
      }
    });
    
    container.appendChild(slider);
    return container;
  },
  
  /**
   * Creates a button control
   * @param {Object} options - Button options
   * @param {Function} onClickCallback - Callback when button is clicked
   * @returns {HTMLElement} Button element
   */
  createButton: function(options, onClickCallback) {
    const {
      id,
      label,
      className = 'control-button',
      icon = null
    } = options;
    
    // Create button
    const button = document.createElement('button');
    button.id = id;
    button.className = className;
    
    // Add icon if provided
    if (icon) {
      const iconElement = document.createElement('span');
      iconElement.className = `icon ${icon}`;
      button.appendChild(iconElement);
    }
    
    // Add label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    button.appendChild(labelElement);
    
    // Add event listener
    button.addEventListener('click', function() {
      if (onClickCallback) {
        onClickCallback();
      }
    });
    
    return button;
  },
  
  /**
   * Creates a set of playback controls (play/pause, reset)
   * @param {Object} options - Playback control options
   * @param {Object} callbacks - Callback functions for different controls
   * @returns {HTMLElement} Container with playback controls
   */
  createPlaybackControls: function(options, callbacks) {
    const {
      includePlay = true,
      includePause = true,
      includeReset = true,
      includeSpeed = true,
      speedOptions = [0.5, 1, 1.5, 2]
    } = options;
    
    const {
      onPlay,
      onPause,
      onReset,
      onSpeedChange
    } = callbacks;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'playback-controls';
    
    // Play button
    if (includePlay) {
      const playButton = this.createButton({
        id: 'play-button',
        label: 'Play',
        className: 'control-button play-button',
        icon: 'play-icon'
      }, onPlay);
      container.appendChild(playButton);
    }
    
    // Pause button
    if (includePause) {
      const pauseButton = this.createButton({
        id: 'pause-button',
        label: 'Pause',
        className: 'control-button pause-button',
        icon: 'pause-icon'
      }, onPause);
      container.appendChild(pauseButton);
    }
    
    // Reset button
    if (includeReset) {
      const resetButton = this.createButton({
        id: 'reset-button',
        label: 'Reset',
        className: 'control-button reset-button',
        icon: 'reset-icon'
      }, onReset);
      container.appendChild(resetButton);
    }
    
    // Speed control
    if (includeSpeed) {
      const speedContainer = document.createElement('div');
      speedContainer.className = 'speed-control';
      
      const speedLabel = document.createElement('label');
      speedLabel.textContent = 'Speed:';
      speedContainer.appendChild(speedLabel);
      
      const speedSelect = document.createElement('select');
      speedSelect.id = 'speed-select';
      
      speedOptions.forEach(speed => {
        const option = document.createElement('option');
        option.value = speed;
        option.textContent = `${speed}x`;
        if (speed === 1) option.selected = true;
        speedSelect.appendChild(option);
      });
      
      speedSelect.addEventListener('change', function() {
        const newSpeed = parseFloat(this.value);
        if (onSpeedChange) {
          onSpeedChange(newSpeed);
        }
      });
      
      speedContainer.appendChild(speedSelect);
      container.appendChild(speedContainer);
    }
    
    return container;
  },
  
  /**
   * Creates a toggle switch
   * @param {Object} options - Toggle options
   * @param {Function} onChangeCallback - Callback when toggle changes
   * @returns {HTMLElement} Container with toggle switch
   */
  createToggle: function(options, onChangeCallback) {
    const {
      id,
      label,
      checked = false
    } = options;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'toggle-container';
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    container.appendChild(labelElement);
    
    // Create toggle
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-switch-container';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = checked;
    
    const toggleSwitch = document.createElement('span');
    toggleSwitch.className = 'toggle-switch';
    
    toggleContainer.appendChild(checkbox);
    toggleContainer.appendChild(toggleSwitch);
    
    // Add event listener
    checkbox.addEventListener('change', function() {
      if (onChangeCallback) {
        onChangeCallback(this.checked);
      }
    });
    
    container.appendChild(toggleContainer);
    return container;
  },
  
  /**
   * Creates a dropdown select
   * @param {Object} options - Dropdown options
   * @param {Function} onChangeCallback - Callback when selection changes
   * @returns {HTMLElement} Container with dropdown
   */
  createDropdown: function(options, onChangeCallback) {
    const {
      id,
      label,
      options: selectOptions = [],
      defaultValue = null
    } = options;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'dropdown-container';
    
    // Create label
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    container.appendChild(labelElement);
    
    // Create select
    const select = document.createElement('select');
    select.id = id;
    
    // Add options
    selectOptions.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label;
      
      if (option.value === defaultValue) {
        optionElement.selected = true;
      }
      
      select.appendChild(optionElement);
    });
    
    // Add event listener
    select.addEventListener('change', function() {
      if (onChangeCallback) {
        onChangeCallback(this.value);
      }
    });
    
    container.appendChild(select);
    return container;
  },
  
  /**
   * Creates a panel for organizing controls
   * @param {Object} options - Panel options
   * @returns {HTMLElement} Panel container
   */
  createControlPanel: function(options = {}) {
    const {
      title = 'Controls',
      collapsible = true,
      initiallyCollapsed = false,
      className = 'control-panel'
    } = options;
    
    // Create panel
    const panel = document.createElement('div');
    panel.className = className;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'panel-header';
    
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    header.appendChild(titleElement);
    
    // Add collapse functionality if needed
    if (collapsible) {
      const collapseToggle = document.createElement('button');
      collapseToggle.className = 'collapse-toggle';
      collapseToggle.textContent = initiallyCollapsed ? '+' : '-';
      
      const contentContainer = document.createElement('div');
      contentContainer.className = 'panel-content';
      
      if (initiallyCollapsed) {
        contentContainer.style.display = 'none';
      }
      
      collapseToggle.addEventListener('click', function() {
        const isCollapsed = contentContainer.style.display === 'none';
        contentContainer.style.display = isCollapsed ? 'block' : 'none';
        this.textContent = isCollapsed ? '-' : '+';
      });
      
      header.appendChild(collapseToggle);
      panel.appendChild(header);
      panel.appendChild(contentContainer);
      
      // Method to add controls to the panel
      panel.addControl = function(control) {
        contentContainer.appendChild(control);
        return panel;
      };
    } else {
      panel.appendChild(header);
      
      const contentContainer = document.createElement('div');
      contentContainer.className = 'panel-content';
      panel.appendChild(contentContainer);
      
      // Method to add controls to the panel
      panel.addControl = function(control) {
        contentContainer.appendChild(control);
        return panel;
      };
    }
    
    return panel;
  }
};
