/**
 * Rate of Change Visualizer
 * Interactive SVG visualization for teaching derivatives with surreal animations and pseudo-3D effects
 */

class RateOfChangeVisualizer {
    constructor(container) {
        this.container = container;
        this.width = 800;
        this.height = 600; // Changed from 2400 to fit better in viewport
        this.currentTopic = 'amount';
        
        // State
        this.state = {
            depth: 0,
            rotation: 0,
            showTangent: true,
            showSecant: true,
            timeInterval: 0.5,
            isAnimating: false,
            clickedTopics: {}
        };
        
        // Colors
        this.colors = {
            background: '#F0EBE1',
            teal: '#225B7D',
            brown: '#2A2520',
            gray: '#554F47',
            tan: '#C1A87C',
            lightGray: '#D6D0C4',
            white: '#FFFFFF'
        };
        
        // Initialize SVG
        this.initSVG();
        
        // Create background animations
        this.createBackground();
        
        // Create content
        this.createContent();
        
        // Setup interactive elements
        this.setupInteractivity();
        
        // Initial state
        this.updateDepthEffect();
        this.updateRotationEffect();
        
        // Start background animations
        this.startBackgroundAnimations();
    }
    
    /**
     * Initialize the SVG Canvas
     */
    initSVG() {
        // Create SVG drawing
        this.svg = SVG().addTo(this.container).size(this.width, this.height);
        
        // Create a background
        this.svgBackground = this.svg.rect(this.width, this.height).fill(this.colors.background);
    }
    
    /**
     * Create surreal background with floating math symbols
     */
    createBackground() {
        // Create a group for background symbols
        this.backgroundGroup = this.svg.group();
        
        // Define math symbols to float in background
        const symbols = [
            'f′', '∫', '∂', 'dx', '∑', '→', 'Δ', '∞', 'lim'
        ];
        
        // Create 20 random symbols
        for (let i = 0; i < 20; i++) {
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const opacity = 0.05 + Math.random() * 0.1;
            const size = 20 + Math.random() * 60;
            
            const textElement = this.backgroundGroup.text(symbol)
                .font({
                    family: 'Georgia',
                    size: size,
                    anchor: 'middle',
                    weight: 'bold'
                })
                .fill({ color: this.colors.teal, opacity: opacity })
                .move(x, y);
                
            // Store for animation
            textElement.data({
                originalX: x,
                originalY: y,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: -0.1 - Math.random() * 0.5,
                opacity: opacity,
                opacityDir: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    
    /**
     * Create main content area with visualizations
     */
    createContent() {
        // Main container
        this.contentGroup = this.svg.group().move(50, 50);
        
        // Create all five visualizations side by side
        this.createAmountViz(0);
        this.createRateViz(1);
        this.createMotionViz(2);
        this.createPopulationViz(3);
        this.createMarginalViz(4);

        // Initially show only the first visualization
        this.showVisualization('amount');
    }
    
    /**
     * Show specific visualization and hide others
     */
    showVisualization(id) {
        // Hide all visualizations
        ['amount', 'average-vs-instantaneous', 'motion', 'population', 'marginal'].forEach(topic => {
            if (this[`${topic}Group`]) {
                this[`${topic}Group`].hide();
            }
        });
        
        // Show the selected visualization
        if (this[`${id}Group`]) {
            this[`${id}Group`].show();
            this.currentTopic = id;
            
            // Update info panel values
            this.updateInfoValues(id);
        }
    }
    
    /**
     * Create visualization for Amount of Change topic
     */
    createAmountViz(index) {
        const vizGroup = this.svg.group().move(50, 100);
        this.amountGroup = vizGroup;
        
        // Title
        vizGroup.text('Amount of Change')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 0);
            
        // Equation
        vizGroup.text('f(a + h) = f(a) + f\'(a)h')
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'middle',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 40);
        
        // Coordinate system
        const graphGroup = vizGroup.group().move(200, 100);
        graphGroup.line(0, 200, 300, 200).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        graphGroup.line(20, 0, 20, 300).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Curve (quadratic)
        const curve = graphGroup.path('M20,200 Q160,50 280,150')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Tangent line
        const tangent = graphGroup.line(120, 100, 200, 130)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Secant line
        const secant = graphGroup.line(80, 170, 240, 130)
            .stroke({ color: this.colors.tan, width: 2 });
        
        // Point markers
        graphGroup.circle(6).fill(this.colors.tan).center(80, 170);  // Start point
        graphGroup.circle(6).fill(this.colors.tan).center(240, 130);  // End point
        graphGroup.circle(6).fill(this.colors.teal).center(160, 100); // Tangent point
        
        // Store elements for animation
        this.amountElements = { curve, tangent, secant };
    }
    
    /**
     * Create visualization for Average vs Instantaneous Rate topic
     */
    createRateViz(index) {
        const vizGroup = this.svg.group().move(50, 100);
        this.averageVsInstantaneousGroup = vizGroup;
        
        // Title
        vizGroup.text('Average vs Instantaneous Rate')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 0);
            
        // Equation
        vizGroup.text('Average: [f(a + h) - f(a)] / h    Instantaneous: f\'(a)')
            .font({
                family: 'Georgia',
                size: 16,
                anchor: 'middle',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 40);
        
        // Coordinate system
        const graphGroup = vizGroup.group().move(200, 100);
        graphGroup.line(0, 200, 300, 200).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        graphGroup.line(20, 0, 20, 300).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Curve (cubic)
        const curve = graphGroup.path('M20,180 C100,200 160,50 280,100')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Horizontal secant
        const secant = graphGroup.line(80, 170, 240, 130)
            .stroke({ color: this.colors.tan, width: 2 });
            
        // Vertical tangent
        const tangent = graphGroup.line(160, 50, 160, 130)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point markers
        graphGroup.circle(6).fill(this.colors.tan).center(80, 170);   // Start point
        graphGroup.circle(6).fill(this.colors.tan).center(240, 130);   // End point
        graphGroup.circle(6).fill(this.colors.teal).center(160, 90);  // Tangent point
        
        // Store elements for animation
        this.rateElements = { curve, tangent, secant };
        
        // Hide initially
        vizGroup.hide();
    }
    
    /**
     * Create visualization for Motion Along a Line topic
     */
    createMotionViz(index) {
        const vizGroup = this.svg.group().move(50, 100);
        this.motionGroup = vizGroup;
        
        // Title
        vizGroup.text('Motion Along a Line')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 0);
            
        // Equation
        vizGroup.text('v(t) = s\'(t), a(t) = v\'(t)')
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'middle',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 40);
        
        // Coordinate system
        const graphGroup = vizGroup.group().move(200, 100);
        
        // Path line (horizontal axis)
        graphGroup.line(20, 200, 280, 200)
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Wavy path above the line
        const path = graphGroup.path('M20,150 C80,120 120,170 160,140 S240,120 280,150')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Moving object (circle)
        const circle = graphGroup.circle(12)
            .fill(this.colors.tan)
            .center(160, 140);
        
        // Store elements for animation
        this.motionElements = { path, circle };
        
        // Hide initially
        vizGroup.hide();
    }
    
    /**
     * Create visualization for Population Growth topic
     */
    createPopulationViz(index) {
        const vizGroup = this.svg.group().move(50, 100);
        this.populationGroup = vizGroup;
        
        // Title
        vizGroup.text('Population Growth')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 0);
            
        // Equation
        vizGroup.text('P(t) + P\'(t)h')
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'middle',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 40);
        
        // Coordinate system
        const graphGroup = vizGroup.group().move(200, 100);
        graphGroup.line(0, 200, 300, 200).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        graphGroup.line(20, 0, 20, 300).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Growth line
        const line = graphGroup.line(20, 180, 280, 40)
            .stroke({ color: this.colors.teal, width: 3 });
        
        // Tangent line
        const tangent = graphGroup.line(150, 110, 280, 40)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point marker
        graphGroup.circle(6).fill(this.colors.teal).center(150, 110);
        
        // Store elements for animation
        this.populationElements = { line, tangent };
        
        // Hide initially
        vizGroup.hide();
    }
    
    /**
     * Create visualization for Marginal Functions topic
     */
    createMarginalViz(index) {
        const vizGroup = this.svg.group().move(50, 100);
        this.marginalGroup = vizGroup;
        
        // Title
        vizGroup.text('Marginal Functions')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 0);
            
        // Equation
        vizGroup.text('MC(x) = C\'(x), MR(x) = R\'(x)')
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'middle',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 40);
        
        // Coordinate system
        const graphGroup = vizGroup.group().move(200, 100);
        graphGroup.line(0, 200, 300, 200).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        graphGroup.line(20, 0, 20, 300).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Quadratic curve
        const curve = graphGroup.path('M20,100 Q160,200 280,50')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Vertical tangent line
        const tangent = graphGroup.line(160, 100, 160, 200)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point marker
        graphGroup.circle(6).fill(this.colors.teal).center(160, 150);
        
        // Store elements for animation
        this.marginalElements = { curve, tangent };
        
        // Hide initially
        vizGroup.hide();
    }
    
    /**
     * Setup interactive elements
     */
    setupInteractivity() {
        // Add click events to all visualization elements
        this.svg.click((event) => {
            // Toggle clicked state for current topic
            const topic = this.currentTopic;
            this.state.clickedTopics[topic] = !this.state.clickedTopics[topic];
            
            // Apply 3D effect
            this.applyTopicEffect(topic);
        });
    }
    
    /**
     * Apply 3D-like effect to topic visualization
     */
    applyTopicEffect(topic) {
        const isClicked = this.state.clickedTopics[topic];
        
        switch(topic) {
            case 'amount':
                if (isClicked) {
                    // Stretch curve downward, rotate tangent
                    this.amountElements.curve.animate(500).plot('M20,200 Q160,70 280,150');
                    this.amountElements.tangent.animate(500).plot(120, 80, 200, 100);
                } else {
                    // Reset
                    this.amountElements.curve.animate(500).plot('M20,200 Q160,50 280,150');
                    this.amountElements.tangent.animate(500).plot(120, 100, 200, 130);
                }
                break;
                
            case 'average-vs-instantaneous':
                if (isClicked) {
                    // Skew curve sideways, thicken secant
                    this.rateElements.curve.animate(500).plot('M20,180 C100,220 160,50 280,80');
                    this.rateElements.secant.animate(500).stroke({ width: 4 });
                } else {
                    // Reset
                    this.rateElements.curve.animate(500).plot('M20,180 C100,200 160,50 280,100');
                    this.rateElements.secant.animate(500).stroke({ width: 2 });
                }
                break;
                
            case 'motion':
                if (isClicked) {
                    // Flatten path vertically, enlarge circle
                    this.motionElements.path.animate(500).plot('M20,170 C80,160 120,180 160,170 S240,160 280,170');
                    this.motionElements.circle.animate(500).radius(18);
                } else {
                    // Reset
                    this.motionElements.path.animate(500).plot('M20,150 C80,120 120,170 160,140 S240,120 280,150');
                    this.motionElements.circle.animate(500).radius(6);
                }
                break;
                
            case 'population':
                if (isClicked) {
                    // Expand line endpoints outward
                    this.populationElements.line.animate(500).plot(0, 190, 300, 20);
                } else {
                    // Reset
                    this.populationElements.line.animate(500).plot(20, 180, 280, 40);
                }
                break;
                
            case 'marginal':
                if (isClicked) {
                    // Rotate curve, change tangent color
                    this.marginalElements.curve.animate(500).plot('M20,140 Q160,50 280,140');
                    this.marginalElements.tangent.animate(500).stroke({ color: this.colors.tan });
                } else {
                    // Reset
                    this.marginalElements.curve.animate(500).plot('M20,100 Q160,200 280,50');
                    this.marginalElements.tangent.animate(500).stroke({ color: this.colors.teal });
                }
                break;
        }
    }
    
    /**
     * Update info panel values based on selected topic
     */
    updateInfoValues(topic) {
        // Get the info display elements
        const instantRateEl = document.getElementById('instant-rate');
        const avgRateEl = document.getElementById('avg-rate');
        const timeIntervalEl = document.getElementById('time-interval');
        
        if (!instantRateEl || !avgRateEl || !timeIntervalEl) return;
        
        // Set values based on topic
        switch(topic) {
            case 'amount':
                instantRateEl.textContent = '5.00';
                avgRateEl.textContent = '4.00';
                timeIntervalEl.textContent = '0.20';
                break;
                
            case 'average-vs-instantaneous':
                instantRateEl.textContent = '-3.00';
                avgRateEl.textContent = '-2.50';
                timeIntervalEl.textContent = '0.50';
                break;
                
            case 'motion':
                instantRateEl.textContent = '-32.00';
                avgRateEl.textContent = '-32.00';
                timeIntervalEl.textContent = '2.00';
                break;
                
            case 'population':
                instantRateEl.textContent = '100.00';
                avgRateEl.textContent = '97.00';
                timeIntervalEl.textContent = '1.00';
                break;
                
            case 'marginal':
                instantRateEl.textContent = '3.00';
                avgRateEl.textContent = '2.75';
                timeIntervalEl.textContent = '0.10';
                break;
        }
    }
    
    /**
     * Apply depth effect to all visualizations
     */
    updateDepthEffect() {
        const depth = this.state.depth;
        
        // Scale curves based on depth
        if (this.amountElements) {
            // Use SVG.js transform methods to apply 3D-like effects
            this.amountElements.curve.transform({ skew: [0, depth * 2] });
        }
        
        if (this.rateElements) {
            this.rateElements.curve.transform({ skew: [depth * 2, 0] });
        }
        
        if (this.motionElements && this.motionElements.path) {
            // Create depth effect by modifying the path
            const pathDepth = depth * 5;
            const pathString = `M20,${150 - pathDepth} C80,${120 - pathDepth * 1.2} 120,${170 - pathDepth} 160,${140 - pathDepth * 1.2} S240,${120 - pathDepth} 280,${150 - pathDepth}`;
            this.motionElements.path.plot(pathString);
        }
        
        if (this.populationElements) {
            // Adjust line thickness based on depth
            this.populationElements.line.stroke({ width: 3 + depth * 0.5 });
        }
        
        if (this.marginalElements) {
            // Adjust curve based on depth
            const pathDepth = depth * 10;
            const curveString = `M20,${100 + pathDepth} Q160,${200 - pathDepth} 280,${50 + pathDepth}`;
            this.marginalElements.curve.plot(curveString);
        }
    }
    
    /**
     * Apply rotation effect to all visualizations
     */
    updateRotationEffect() {
        const rotation = this.state.rotation;
        
        // For simplicity, we'll just apply a slight perspective transform based on rotation
        const groups = [
            this.amountGroup, 
            this.averageVsInstantaneousGroup, 
            this.motionGroup, 
            this.populationGroup, 
            this.marginalGroup
        ];
        
        groups.forEach(group => {
            if (group) {
                const radians = (rotation * Math.PI) / 180;
                const skewX = Math.sin(radians) * 0.2; // Limit skew amount
                
                // Apply transform
                group.transform({ skew: [skewX, 0], rotate: rotation / 20 });
            }
        });
    }
    
    /**
     * Start background animation loop
     */
    startBackgroundAnimations() {
        // Use requestAnimationFrame for smooth animation
        const animate = () => {
            this.animateBackgroundSymbols();
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Animate floating background symbols
     */
    animateBackgroundSymbols() {
        // Animate each background symbol
        this.backgroundGroup.children().forEach(symbol => {
            const data = symbol.data();
            
            // Move symbol
            let x = symbol.x() + data.speedX;
            let y = symbol.y() + data.speedY;
            
            // Wrap around if outside bounds
            if (y < -100) y = this.height + 50;
            if (x < -50) x = this.width + 50;
            if (x > this.width + 50) x = -50;
            
            symbol.move(x, y);
            
            // Fade in/out
            let opacity = data.opacity + (0.0005 * data.opacityDir);
            
            // Change direction if reaching limits
            if (opacity > 0.15 || opacity < 0.05) {
                data.opacityDir *= -1;
            }
            
            data.opacity = opacity;
            symbol.fill({ opacity: opacity });
        });
    }
    
    /** 
     * Public methods for external control
     */
     
    /**
     * Set depth value (0-10)
     */
    setDepth(depth) {
        this.state.depth = depth;
        this.updateDepthEffect();
    }
    
    /**
     * Set rotation value (0-360)
     */
    setRotation(rotation) {
        this.state.rotation = rotation;
        this.updateRotationEffect();
    }
    
    /**
     * Set current topic
     */
    setTopic(topic) {
        this.showVisualization(topic);
    }
    
    /**
     * Toggle tangent lines
     */
    toggleTangent(show) {
        this.state.showTangent = show;
        
        // Update tangent lines visibility
        ['amount', 'average-vs-instantaneous', 'population', 'marginal'].forEach(topic => {
            const elements = this[`${topic}Elements`];
            if (elements && elements.tangent) {
                elements.tangent.opacity(show ? 1 : 0);
            }
        });
    }
    
    /**
     * Toggle secant lines
     */
    toggleSecant(show) {
        this.state.showSecant = show;
        
        // Update secant lines visibility
        ['amount', 'average-vs-instantaneous'].forEach(topic => {
            const elements = this[`${topic}Elements`];
            if (elements && elements.secant) {
                elements.secant.opacity(show ? 1 : 0);
            }
        });
    }
}
