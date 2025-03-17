/**
 * Rate of Change Visualizer
 * Interactive SVG visualization for teaching derivatives with surreal animations and pseudo-3D effects
 */

class RateOfChangeVisualizer {
    constructor(container) {
        this.container = container;
        this.width = 800;
        this.height = 2400;
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
        
        // Create header
        this.createHeader();
        
        // Create title section
        this.createTitleSection();
        
        // Create main content
        this.createContentArea();
        
        // Create sliders
        this.createSliderSection();
        
        // Create practice exercises
        this.createExerciseSection();
        
        // Create footer
        this.createFooter();
        
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
     * Create header section
     */
    createHeader() {
        // Header rectangle
        this.headerGroup = this.svg.group();
        this.headerRect = this.headerGroup.rect(this.width, 80)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 });
        
        // Logo
        const logoGroup = this.headerGroup.group();
        const logoCircle = logoGroup.circle(40)
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 })
            .move(30, 20);
        
        // Logo lines
        logoGroup.line(30, 40, 70, 40).stroke({ color: this.colors.teal, width: 2 });
        logoGroup.line(50, 20, 50, 60).stroke({ color: this.colors.teal, width: 2 });
        logoGroup.path('M40,30 A10,10 0 0 1 60,30')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Title
        this.headerGroup.text('Calculus Visualizer')
            .font({
                family: 'Georgia',
                size: 24,
                anchor: 'start'
            })
            .fill(this.colors.teal)
            .move(85, 30);
        
        // Navigation buttons
        const navContainer = this.headerGroup.rect(280, 40)
            .radius(4)
            .fill('none')
            .stroke({ color: this.colors.lightGray, width: 1 })
            .move(480, 20);
        
        // Active "Derivatives" button
        const derivativesBtn = this.headerGroup.rect(70, 30)
            .radius(4)
            .fill(this.colors.teal)
            .move(490, 25);
        
        this.headerGroup.text('Derivatives')
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'middle',
                weight: 'normal'
            })
            .fill(this.colors.white)
            .move(525, 33);
        
        // Other nav buttons
        const navLabels = ['Integrals', 'Limits', 'Vectors'];
        
        navLabels.forEach((label, index) => {
            const x = 570 + index * 60;
            
            this.headerGroup.rect(55, 30)
                .radius(4)
                .fill('none')
                .stroke({ color: this.colors.lightGray, width: 1 })
                .move(x, 25);
                
            this.headerGroup.text(label)
                .font({
                    family: 'Arial',
                    size: 12,
                    anchor: 'middle',
                    weight: 'normal'
                })
                .fill(this.colors.brown)
                .move(x + 27, 33);
        });
        
        // Back button
        const backBtn = this.headerGroup.rect(50, 30)
            .radius(4)
            .fill('none')
            .stroke({ color: this.colors.teal, width: 1 })
            .move(400, 25);
            
        this.headerGroup.text('Back')
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'middle',
                weight: 'normal'
            })
            .fill(this.colors.teal)
            .move(425, 33);
            
        // Animate logo
        this.animateLogo(logoCircle);
    }
    
    /**
     * Create title and overview section
     */
    createTitleSection() {
        this.titleGroup = this.svg.group().move(0, 100);
        
        // Title text
        this.titleGroup.text('Derivatives: Rates of Change')
            .font({
                family: 'Georgia',
                size: 32,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(this.width / 2, 0);
        
        // Decorative line
        const lineWidth = 400;
        const line = this.titleGroup.line(
            this.width / 2 - lineWidth / 2, 60,
            this.width / 2 + lineWidth / 2, 60
        ).stroke({ 
            color: this.colors.tan, 
            width: 2,
            dasharray: '8,4'
        });
        
        // Center circle
        const circle = this.titleGroup.circle(10)
            .fill(this.colors.tan)
            .move(this.width / 2 - 5, 55);
        
        // Overview text
        const overviewTexts = [
            'How quantities change over time or input',
            'Click visualizations to explore in 3D-like depth',
            'Key in physics, biology, economics, and more'
        ];
        
        overviewTexts.forEach((text, index) => {
            this.titleGroup.text(text)
                .font({
                    family: 'Georgia',
                    size: 16,
                    anchor: 'middle'
                })
                .fill(this.colors.gray)
                .move(this.width / 2, 80 + index * 25);
        });
        
        // Animate line and circle
        this.animateTitleElements(line, circle);
    }
    
    /**
     * Create main content area with derivative topics
     */
    createContentArea() {
        // Main container
        this.contentGroup = this.svg.group().move(50, 300);
        
        // Content rectangle
        this.contentRect = this.contentGroup.rect(700, 1000)
            .radius(10)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 });
        
        // Create topic sections
        this.createTopicSection('amount', 0, 'Amount of Change', 'f(a + h) = f(a) + f\'(a)h', 'Click graph to see rate in 3D', 'Ex: f(3) = 2, f\'(3) = 5', 'f(3.2) ≈ 3');
        this.createTopicSection('average-vs-instantaneous', 1, 'Average vs Instantaneous', 'Average: [f(a + h) - f(a)] / h', 'Click to tilt graph in 3D', 'Instantaneous: f\'(a)');
        this.createTopicSection('motion', 2, 'Motion Along a Line', 'v(t) = s\'(t), a(t) = v\'(t)', 'Click to stretch path in 3D', 'Ex: s(t) = -16t^2 + 64');
        this.createTopicSection('population', 3, 'Population Growth', 'P(t) + P\'(t)h', 'Click to see growth in 3D', 'Ex: P(2) ≈ 18,000');
        this.createTopicSection('marginal', 4, 'Marginal Functions', 'MC(x) = C\'(x), MR(x) = R\'(x)', 'Click to rotate in 3D', 'Ex: MR(100) = 3');
    }
    
    /**
     * Create a topic section with visualization and explanation
     */
    createTopicSection(id, index, title, equation, instruction, example1, example2 = '') {
        const yOffset = index * 200;
        const sectionGroup = this.contentGroup.group().move(0, yOffset);
        
        // Left side (visualization)
        const vizContainer = sectionGroup.rect(320, 180)
            .radius(5)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 })
            .move(0, 0);
        
        // Create visualization based on type
        switch(id) {
            case 'amount':
                this.createAmountViz(sectionGroup);
                break;
            case 'average-vs-instantaneous':
                this.createRateViz(sectionGroup);
                break;
            case 'motion':
                this.createMotionViz(sectionGroup);
                break;
            case 'population':
                this.createPopulationViz(sectionGroup);
                break;
            case 'marginal':
                this.createMarginalViz(sectionGroup);
                break;
        }
        
        // Right side (explanation)
        const expContainer = sectionGroup.rect(280, 180)
            .radius(5)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 })
            .move(340, 0);
        
        // Title
        sectionGroup.text(`${index + 1}. ${title}`)
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'start',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(350, 20);
        
        // Equation
        sectionGroup.text(equation)
            .font({
                family: 'Georgia',
                size: 14,
                anchor: 'start',
                style: 'italic'
            })
            .fill(this.colors.brown)
            .move(350, 50);
        
        // Instructions
        sectionGroup.text(instruction)
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'start'
            })
            .fill(this.colors.gray)
            .move(350, 80);
        
        // Example 1
        sectionGroup.text(example1)
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'start'
            })
            .fill(this.colors.gray)
            .move(350, 110);
        
        // Example 2 (if provided)
        if (example2) {
            sectionGroup.text(example2)
                .font({
                    family: 'Arial',
                    size: 12,
                    anchor: 'start'
                })
                .fill(this.colors.gray)
                .move(350, 140);
        }
        
        // Store reference to section for interactivity
        this[`${id}Section`] = sectionGroup;
        this[`${id}Viz`] = vizContainer;
        
        // Add click handlers
        vizContainer.attr({ 'data-topic': id }).css({ cursor: 'pointer' });
    }
    
    /**
     * Create visualization for Amount of Change topic
     */
    createAmountViz(parent) {
        const vizGroup = parent.group().move(20, 20);
        
        // Coordinate system
        vizGroup.line(20, 140, 280, 140).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        vizGroup.line(40, 20, 40, 160).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Curve (quadratic)
        const curve = vizGroup.path('M40,140 Q160,40 280,100')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Tangent line
        const tangent = vizGroup.line(120, 80, 200, 110)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Secant line
        const secant = vizGroup.line(80, 120, 240, 95)
            .stroke({ color: this.colors.tan, width: 2 });
        
        // Point markers
        vizGroup.circle(6).fill(this.colors.tan).center(80, 120);  // Start point
        vizGroup.circle(6).fill(this.colors.tan).center(240, 95);  // End point
        vizGroup.circle(6).fill(this.colors.teal).center(160, 80); // Tangent point
        
        // Store elements for animation
        this.amountElements = { curve, tangent, secant };
    }
    
    /**
     * Create visualization for Average vs Instantaneous Rate topic
     */
    createRateViz(parent) {
        const vizGroup = parent.group().move(20, 20);
        
        // Coordinate system
        vizGroup.line(20, 140, 280, 140).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        vizGroup.line(40, 20, 40, 160).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Curve (cubic)
        const curve = vizGroup.path('M40,120 C100,140 160,40 280,70')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Horizontal secant
        const secant = vizGroup.line(80, 110, 240, 80)
            .stroke({ color: this.colors.tan, width: 2 });
            
        // Vertical tangent
        const tangent = vizGroup.line(160, 40, 160, 120)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point markers
        vizGroup.circle(6).fill(this.colors.tan).center(80, 110);   // Start point
        vizGroup.circle(6).fill(this.colors.tan).center(240, 80);   // End point
        vizGroup.circle(6).fill(this.colors.teal).center(160, 80);  // Tangent point
        
        // Store elements for animation
        this.rateElements = { curve, tangent, secant };
    }
    
    /**
     * Create visualization for Motion Along a Line topic
     */
    createMotionViz(parent) {
        const vizGroup = parent.group().move(20, 20);
        
        // Path line (horizontal axis)
        vizGroup.line(40, 140, 280, 140)
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Wavy path above the line
        const path = vizGroup.path('M40,120 C80,100 120,140 160,120 S240,100 280,120')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Moving object (circle)
        const circle = vizGroup.circle(12)
            .fill(this.colors.tan)
            .center(160, 120);
        
        // Store elements for animation
        this.motionElements = { path, circle };
    }
    
    /**
     * Create visualization for Population Growth topic
     */
    createPopulationViz(parent) {
        const vizGroup = parent.group().move(20, 20);
        
        // Coordinate system
        vizGroup.line(20, 140, 280, 140).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        vizGroup.line(40, 20, 40, 160).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Growth line
        const line = vizGroup.line(40, 120, 280, 40)
            .stroke({ color: this.colors.teal, width: 3 });
        
        // Tangent line
        const tangent = vizGroup.line(160, 80, 280, 40)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point marker
        vizGroup.circle(6).fill(this.colors.teal).center(160, 80);
        
        // Store elements for animation
        this.populationElements = { line, tangent };
    }
    
    /**
     * Create visualization for Marginal Functions topic
     */
    createMarginalViz(parent) {
        const vizGroup = parent.group().move(20, 20);
        
        // Coordinate system
        vizGroup.line(20, 140, 280, 140).stroke({ color: this.colors.gray, width: 1 }); // x-axis
        vizGroup.line(40, 20, 40, 160).stroke({ color: this.colors.gray, width: 1 });   // y-axis
        
        // Quadratic curve
        const curve = vizGroup.path('M40,60 Q160,140 280,40')
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 });
        
        // Vertical tangent line
        const tangent = vizGroup.line(160, 60, 160, 140)
            .stroke({ 
                color: this.colors.teal, 
                width: 2,
                dasharray: '5,3'
            });
        
        // Point marker
        vizGroup.circle(6).fill(this.colors.teal).center(160, 100);
        
        // Store elements for animation
        this.marginalElements = { curve, tangent };
    }
    
    /**
     * Create slider control section
     */
    createSliderSection() {
        this.sliderGroup = this.svg.group().move(90, 1420);
        
        // Slider container
        this.sliderGroup.rect(620, 120)
            .radius(10)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 });
        
        // Depth slider
        this.sliderGroup.text('Adjust Depth (Click Circle)')
            .font({
                family: 'Arial',
                size: 14,
                anchor: 'start'
            })
            .fill(this.colors.brown)
            .move(30, 20);
        
        const depthTrack = this.sliderGroup.rect(250, 6)
            .radius(3)
            .fill('none')
            .stroke({ color: this.colors.lightGray, width: 1 })
            .move(30, 50);
        
        this.depthHandle = this.sliderGroup.circle(16)
            .fill(this.colors.teal)
            .center(155, 53);
            
        // Rotate slider
        this.sliderGroup.text('Rotate View')
            .font({
                family: 'Arial',
                size: 14,
                anchor: 'start'
            })
            .fill(this.colors.brown)
            .move(340, 20);
        
        const rotateTrack = this.sliderGroup.rect(250, 6)
            .radius(3)
            .fill('none')
            .stroke({ color: this.colors.lightGray, width: 1 })
            .move(340, 50);
        
        this.rotateHandle = this.sliderGroup.circle(16)
            .fill(this.colors.teal)
            .center(465, 53);
            
        // Instruction
        this.sliderGroup.text('Click sliders to adjust all visuals')
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'middle'
            })
            .fill(this.colors.gray)
            .move(310, 90);
            
        // Make handles pulsate
        this.animateSliderHandles();
    }
    
    /**
     * Create practice exercises section
     */
    createExerciseSection() {
        this.exerciseGroup = this.svg.group().move(90, 1560);
        
        // Exercise container
        this.exerciseGroup.rect(620, 400)
            .radius(10)
            .fill(this.colors.background)
            .stroke({ color: this.colors.lightGray, width: 1 });
        
        // Title
        this.exerciseGroup.text('Practice Exercises')
            .font({
                family: 'Georgia',
                size: 20,
                anchor: 'middle',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(310, 30);
        
        // Questions
        const questions = [
            "f(10) = -5, f'(10) = 6. Find f(10.1).",
            "s(t) = -16t^2 + 64. Find v(2), avg vel [0,2].",
            "s(t) = t^3 - 4t + 2. Find v(1), a(1).",
            "P(0) = 3,000, P'(0) = 100. Pop in 3 days?",
            "R(x) = -0.03x^2 + 9x. MR(100)?"
        ];
        
        questions.forEach((q, i) => {
            this.exerciseGroup.text(`${i+1}. ${q}`)
                .font({
                    family: 'Arial',
                    size: 14,
                    anchor: 'start'
                })
                .fill(this.colors.gray)
                .move(40, 80 + i * 40);
        });
        
        // Submit button
        const submitBtn = this.exerciseGroup.rect(150, 40)
            .radius(5)
            .fill('none')
            .stroke({ color: this.colors.teal, width: 2 })
            .move(40, 300);
            
        this.exerciseGroup.text('Submit Answers')
            .font({
                family: 'Arial',
                size: 14,
                anchor: 'middle',
                weight: 'normal'
            })
            .fill(this.colors.teal)
            .move(115, 318);
            
        // Solutions text
        this.exerciseGroup.text('View solutions after submission')
            .font({
                family: 'Arial',
                size: 12,
                anchor: 'start',
                style: 'italic'
            })
            .fill(this.colors.gray)
            .move(210, 318);
            
        // Animate submit button
        this.animateSubmitButton(submitBtn);
    }
    
    /**
     * Create footer section
     */
    createFooter() {
        this.footerGroup = this.svg.group().move(0, 1990);
        
        // Title
        this.footerGroup.text('Related Topics')
            .font({
                family: 'Georgia',
                size: 18,
                anchor: 'start',
                weight: 'bold'
            })
            .fill(this.colors.brown)
            .move(90, 30);
        
        // Link buttons
        const topics = ['Tangent Slope', 'Instantaneous Velocity'];
        
        topics.forEach((topic, i) => {
            const x = 260 + i * 230;
            
            this.footerGroup.rect(200, 40)
                .radius(20)
                .fill('none')
                .stroke({ color: this.colors.teal, width: 2 })
                .move(x, 20);
                
            this.footerGroup.text(topic)
                .font({
                    family: 'Arial',
                    size: 14,
                    anchor: 'middle',
                    weight: 'normal'
                })
                .fill(this.colors.teal)
                .move(x + 100, 38);
        });
    }
    
    /**
     * Setup interactive elements
     */
    setupInteractivity() {
        // Setup topic clicks
        this.svg.findOne('rect[data-topic="amount"]').on('click', () => this.onTopicClick('amount'));
        this.svg.findOne('rect[data-topic="average-vs-instantaneous"]').on('click', () => this.onTopicClick('average-vs-instantaneous'));
        this.svg.findOne('rect[data-topic="motion"]').on('click', () => this.onTopicClick('motion'));
        this.svg.findOne('rect[data-topic="population"]').on('click', () => this.onTopicClick('population'));
        this.svg.findOne('rect[data-topic="marginal"]').on('click', () => this.onTopicClick('marginal'));
        
        // Setup slider interactions
        this.depthHandle.css({ cursor: 'pointer' }).on('click', (event) => {
            const mouseX = event.clientX;
            const trackStart = 30;
            const trackEnd = 280;
            const percentage = (mouseX - trackStart) / (trackEnd - trackStart);
            const depth = Math.min(10, Math.max(0, percentage * 10));
            
            this.setDepth(depth);
            
            // Update UI
            const depthValue = document.getElementById('depth-value');
            if (depthValue) depthValue.textContent = depth.toFixed(1);
        });
        
        this.rotateHandle.css({ cursor: 'pointer' }).on('click', (event) => {
            const mouseX = event.clientX;
            const trackStart = 340;
            const trackEnd = 590;
            const percentage = (mouseX - trackStart) / (trackEnd - trackStart);
            const rotation = Math.min(360, Math.max(0, percentage * 360));
            
            this.setRotation(rotation);
            
            // Update UI
            const rotateValue = document.getElementById('rotate-value');
            if (rotateValue) rotateValue.textContent = Math.round(rotation);
        });
    }
    
    /**
     * Handle topic visualization click
     */
    onTopicClick(topic) {
        // Toggle clicked state
        this.state.clickedTopics[topic] = !this.state.clickedTopics[topic];
        
        // Trigger 3D-like transformation
        this.applyTopicEffect(topic);
        
        // Update info panel values to match this topic
        this.updateInfoValues(topic);
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
                    this.amountElements.curve.animate(500).plot('M40,140 Q160,70 280,120');
                    this.amountElements.tangent.animate(500).plot(120, 70, 200, 90);
                } else {
                    // Reset
                    this.amountElements.curve.animate(500).plot('M40,140 Q160,40 280,100');
                    this.amountElements.tangent.animate(500).plot(120, 80, 200, 110);
                }
                break;
                
            case 'average-vs-instantaneous':
                if (isClicked) {
                    // Skew curve sideways, thicken secant
                    this.rateElements.curve.animate(500).plot('M40,120 C100,160 160,40 280,50');
                    this.rateElements.secant.animate(500).stroke({ width: 4 });
                } else {
                    // Reset
                    this.rateElements.curve.animate(500).plot('M40,120 C100,140 160,40 280,70');
                    this.rateElements.secant.animate(500).stroke({ width: 2 });
                }
                break;
                
            case 'motion':
                if (isClicked) {
                    // Flatten path vertically, enlarge circle
                    // Flatten path vertically, enlarge circle
                    this.motionElements.path.animate(500).plot('M40,130 C80,120 120,140 160,130 S240,120 280,130');
                    this.motionElements.circle.animate(500).radius(18);
                } else {
                    // Reset
                    this.motionElements.path.animate(500).plot('M40,120 C80,100 120,140 160,120 S240,100 280,120');
                    this.motionElements.circle.animate(500).radius(6);
                }
                break;
                
            case 'population':
                if (isClicked) {
                    // Expand line endpoints outward
                    this.populationElements.line.animate(500).plot(20, 130, 300, 20);
                } else {
                    // Reset
                    this.populationElements.line.animate(500).plot(40, 120, 280, 40);
                }
                break;
                
            case 'marginal':
                if (isClicked) {
                    // Rotate curve, change tangent color
                    this.marginalElements.curve.animate(500).plot('M40,100 Q160,40 280,100');
                    this.marginalElements.tangent.animate(500).stroke({ color: this.colors.tan });
                } else {
                    // Reset
                    this.marginalElements.curve.animate(500).plot('M40,60 Q160,140 280,40');
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
            this.amountElements.curve.transform({ scale: 1, skew: [0, depth * 3] });
        }
        
        if (this.rateElements) {
            this.rateElements.curve.transform({ scale: 1, skew: [depth * 3, 0] });
        }
        
        if (this.motionElements) {
            // Flatten path based on depth
            const pathString = `M40,${120 - depth * 5} C80,${100 - depth * 8} 120,${140 - depth * 5} 160,${120 - depth * 8} S240,${100 - depth * 5} 280,${120 - depth * 8}`;
            this.motionElements.path.plot(pathString);
        }
        
        if (this.populationElements) {
            // Adjust line thickness based on depth
            this.populationElements.line.stroke({ width: 3 + depth * 0.5 });
        }
        
        if (this.marginalElements) {
            // Adjust curve based on depth
            const curveString = `M40,${60 + depth * 4} Q160,${140 - depth * 8} 280,${40 + depth * 6}`;
            this.marginalElements.curve.plot(curveString);
        }
    }
    
    /**
     * Apply rotation effect to all visualizations
     */
    updateRotationEffect() {
        const rotation = this.state.rotation;
        
        // For simplicity, we'll just apply a slight perspective transform based on rotation
        // In a real implementation, this would use more complex 3D transforms
        
        const contentGroups = [
            this.amountSection, 
            this.rateElements, 
            this.motionElements, 
            this.populationElements, 
            this.marginalElements
        ];
        
        contentGroups.forEach(group => {
            if (group) {
                const radians = (rotation * Math.PI) / 180;
                const skewX = Math.sin(radians) * 0.5; // Limit skew amount
                const scaleY = 1 - Math.abs(Math.sin(radians)) * 0.2; // Slight scale effect
                
                // Apply transform if the element supports it
                if (group.transform) {
                    group.transform({ skew: [skewX, 0], scale: [1, scaleY] });
                }
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
     * Animate logo circle pulsing
     */
    animateLogo(logoCircle) {
        // Create pulsing animation
        logoCircle.animate({
            duration: 3000,
            ease: '<>',
            swing: true,
            times: Infinity
        }).attr({
            r: 22,  // Pulse from 20 to 22
        }).loop(true, true);
    }
    
    /**
     * Animate title line and circle
     */
    animateTitleElements(line, circle) {
        // Animate dash pattern on line
        line.animate({
            duration: 4000,
            ease: '<>',
            times: Infinity
        }).attr({
            'stroke-dashoffset': 20
        }).loop(true, true);
        
        // Pulse circle
        circle.animate({
            duration: 2000,
            ease: '<>',
            times: Infinity
        }).attr({
            r: 7
        }).loop(true, true);
    }
    
    /**
     * Animate slider handles
     */
    animateSliderHandles() {
        // Pulse the slider handles
        this.depthHandle.animate({
            duration: 2000,
            ease: '<>',
            times: Infinity
        }).attr({
            r: 10
        }).loop(true, true);
        
        this.rotateHandle.animate({
            duration: 2000,
            ease: '<>',
            times: Infinity,
            delay: 500  // Offset timing
        }).attr({
            r: 10
        }).loop(true, true);
    }
    
    /**
     * Animate submit button outline
     */
    animateSubmitButton(button) {
        // Pulse the button outline
        button.animate({
            duration: 2000,
            ease: '<>',
            times: Infinity
        }).attr({
            'stroke-width': 4
        }).loop(true, true);
    }
    
    /** 
     * Public methods for external control
     */
     
    /**
     * Set depth value (0-10)
     */
    setDepth(depth) {
        this.state.depth = depth;
        
        // Update depth handle position
        const handleX = 30 + ((depth / 10) * 250);
        this.depthHandle.center(handleX, 53);
        
        // Apply effect
        this.updateDepthEffect();
    }
    
    /**
     * Set rotation value (0-360)
     */
    setRotation(rotation) {
        this.state.rotation = rotation;
        
        // Update rotation handle position
        const handleX = 340 + ((rotation / 360) * 250);
        this.rotateHandle.center(handleX, 53);
        
        // Apply effect
        this.updateRotationEffect();
    }
    
    /**
     * Set current topic
     */
    setTopic(topic) {
        this.currentTopic = topic;
        
        // Highlight selected topic
        // Reset all
        ['amount', 'average-vs-instantaneous', 'motion', 'population', 'marginal'].forEach(t => {
            const vizEl = this[`${t}Viz`];
            if (vizEl) {
                vizEl.stroke({ color: this.colors.lightGray, width: 1 });
            }
        });
        
        // Highlight selected
        const selectedViz = this[`${topic}Viz`];
        if (selectedViz) {
            selectedViz.stroke({ color: this.colors.teal, width: 3 });
        }
        
        // Update info panel
        this.updateInfoValues(topic);
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
