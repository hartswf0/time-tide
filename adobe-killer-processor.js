/**
 * Adobe Killer Sediment Processor
 * A professional-grade sediment processor with advanced features
 * that Adobe would never make
 */

class AdobeKillerProcessor {
    constructor(options = {}) {
        // Default options
        this.options = {
            maxLayers: 500,
            waveAmplitude: 5,
            waveFrequency: 0.02,
            erosionFactor: 0.01,
            compactionRate: 0.01,
            layeringMode: 'standard',
            blendMode: 'normal',
            colorShift: 0,
            organicFactor: 50,
            layerOpacity: 0.8,
            layerSpacing: 0,
            layerOffset: 0,
            layerDistortion: 0,
            layerBlur: 0,
            baseHue: 0,
            saturation: 100,
            value: 100,
            hueShift: 0,
            hueShiftMode: 'fixed',
            ...options
        };
        
        // Initialize state
        this.layers = [];
        this.tidalCycle = 0;
        this.lastTimestamp = 0;
        this.wavePhase = 0;
        this.erosionMap = new Map();
        this.blendModes = [
            'normal', 'multiply', 'screen', 'overlay', 
            'darken', 'lighten', 'color-dodge', 'color-burn',
            'hard-light', 'soft-light', 'difference', 'exclusion',
            'hue', 'saturation', 'color', 'luminosity',
            'organic-flow', 'erosion-blend', 'wave-distort'
        ];
        
        // Initialize stratigraphy pattern
        this.stratigraphyPattern = this.createStratigraphyPattern();
        
        // Initialize brick pattern
        this.brickPattern = this.createBrickPattern();
    }
    
    /**
     * Process a new slit from the camera feed
     * @param {ImageData} slitData - The image data for the current slit
     * @param {number} position - Position of the slit (0-100)
     * @param {number} timestamp - Current timestamp
     * @param {Object} options - Additional parameters
     * @returns {Object} Processed sediment data
     */
    processSlit(slitData, position, timestamp, options = {}) {
        console.log('Processing slit at position:', position, 'with dimensions:', slitData.width, 'x', slitData.height);
        
        // Extract options with defaults
        const tidalFactor = options.tidalFactor || 50;
        const waveEnergy = options.waveEnergy || 50;
        const erosionThreshold = options.erosionThreshold || 50;
        const compactionRate = options.compactionRate || 5;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const colorShift = options.colorShift || this.options.colorShift;
        const organicFactor = options.organicFactor || this.options.organicFactor;
        const layerOpacity = options.layerOpacity || this.options.layerOpacity;
        const layerSpacing = options.layerSpacing || this.options.layerSpacing;
        const layerOffset = options.layerOffset || this.options.layerOffset;
        const layerDistortion = options.layerDistortion || this.options.layerDistortion;
        const layerBlur = options.layerBlur || this.options.layerBlur;
        
        // Calculate time difference
        const timeDelta = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
        this.lastTimestamp = timestamp;
        
        // Update tidal cycle (0-2π)
        this.tidalCycle = (this.tidalCycle + (timeDelta * 0.0001 * (tidalFactor / 50))) % (Math.PI * 2);
        
        // Calculate wave effect
        const normalizedTidalFactor = tidalFactor / 100;
        const normalizedWaveEnergy = waveEnergy / 100;
        const normalizedOrganicFactor = organicFactor / 100;
        
        // Calculate wave displacement with organic variation
        const waveDisplacement = Math.sin(this.tidalCycle) * 
                                this.options.waveAmplitude * 
                                normalizedTidalFactor * 
                                normalizedWaveEnergy;
        
        // Add organic variation
        const organicVariation = normalizedOrganicFactor * 
                               Math.sin(timestamp * 0.001) * 
                               Math.cos(position * 0.1);
        
        // Analyze motion in the slit
        const motionData = this.analyzeMotion(slitData);
        console.log('Motion analysis:', motionData.intensity);
        
        // Create new sediment layer with enhanced properties
        const newLayer = {
            data: slitData,
            position,
            timestamp,
            age: 0,
            waveDisplacement,
            motionIntensity: motionData.intensity,
            erosionFactor: (motionData.intensity / 255) * (erosionThreshold / 25),
            compaction: 1.0,
            color: this.calculateLayerColor(motionData.intensity, tidalFactor, waveEnergy, colorShift),
            layeringMode,
            blendMode,
            organicVariation,
            opacity: layerOpacity,
            layerSpacing,
            layerOffset,
            layerDistortion,
            layerBlur,
            // Add stratigraphy-specific properties
            stratigraphyType: Math.floor(Math.random() * 5), // 0-4 different types of strata
            // Add brickwork-specific properties
            brickRow: this.layers.length % 2, // Alternating rows for brick pattern
            brickSize: 10 + Math.floor(Math.random() * 20) // Random brick size between 10-30
        };
        
        // Add to layers array
        this.layers.push(newLayer);
        console.log('Added new layer. Total layers:', this.layers.length);
        
        // Limit the number of layers
        if (this.layers.length > this.options.maxLayers) {
            this.layers.shift(); // Remove oldest layer
            console.log('Removed oldest layer. Maintaining max layers:', this.options.maxLayers);
        }
        
        // Apply erosion and compaction to existing layers
        // Note: compactionRate can now be 0 (no compaction)
        this.processLayers(compactionRate / 1000);
        
        // Increment wave phase
        this.wavePhase = (this.wavePhase + 0.05 * normalizedWaveEnergy) % (Math.PI * 2);
        
        // Return processed data
        return {
            layer: newLayer,
            layerCount: this.layers.length,
            waveDisplacement,
            motionIntensity: motionData.intensity,
            layeringMode,
            blendMode
        };
    }
    
    /**
     * Analyze motion in the slit data
     * @param {ImageData} slitData - The image data for the current slit
     * @returns {Object} Motion analysis data
     */
    analyzeMotion(slitData) {
        // Enhanced motion analysis with frequency detection
        const data = slitData.data;
        let totalIntensity = 0;
        let redChannel = 0;
        let greenChannel = 0;
        let blueChannel = 0;
        let highFreqCount = 0;
        
        // Sample pixels to calculate average intensity and color channels
        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate grayscale value
            const intensity = (r + g + b) / 3;
            totalIntensity += intensity;
            
            // Track color channels
            redChannel += r;
            greenChannel += g;
            blueChannel += b;
            
            // Detect high frequency changes (edges)
            if (i > 16 && Math.abs(intensity - (data[i-16] + data[i-15] + data[i-14])/3) > 30) {
                highFreqCount++;
            }
        }
        
        // Calculate average values
        const pixelCount = data.length / 16;
        const avgIntensity = totalIntensity / pixelCount;
        const avgRed = redChannel / pixelCount;
        const avgGreen = greenChannel / pixelCount;
        const avgBlue = blueChannel / pixelCount;
        const highFreqRatio = highFreqCount / pixelCount;
        
        return {
            intensity: avgIntensity,
            threshold: avgIntensity > 100,
            colorProfile: {
                red: avgRed / 255,
                green: avgGreen / 255,
                blue: avgBlue / 255
            },
            highFrequency: highFreqRatio,
            dominantChannel: Math.max(avgRed, avgGreen, avgBlue) === avgRed ? 'red' : 
                            Math.max(avgRed, avgGreen, avgBlue) === avgGreen ? 'green' : 'blue'
        };
    }
    
    /**
     * Calculate layer color based on motion intensity and other factors
     * @param {number} intensity - Motion intensity
     * @param {number} tidalFactor - Tidal factor (0-100)
     * @param {number} waveEnergy - Wave energy (0-100)
     * @param {number} colorShift - Color shift amount (0-100)
     * @returns {string} CSS color string
     */
    calculateLayerColor(intensity, tidalFactor, waveEnergy, colorShift = 0) {
        // Normalize factors
        const normalizedTidal = tidalFactor / 100;
        const normalizedWave = waveEnergy / 100;
        const normalizedShift = colorShift / 100;
        
        // Calculate phase shift for color cycling
        const colorPhase = this.tidalCycle * normalizedShift;
        
        // Get HSV color controls if they exist in options
        const baseHue = this.options.baseHue !== undefined ? this.options.baseHue : 0;
        const saturation = this.options.saturation !== undefined ? this.options.saturation / 100 : 1;
        const value = this.options.value !== undefined ? this.options.value / 100 : 1;
        const hueShift = this.options.hueShift !== undefined ? this.options.hueShift : 0;
        const hueShiftMode = this.options.hueShiftMode || 'fixed';
        
        // Calculate final hue based on hue shift mode
        let finalHue = baseHue;
        
        if (hueShiftMode === 'position') {
            // Shift hue based on intensity
            const normalizedIntensity = intensity / 255;
            finalHue = (baseHue + (normalizedIntensity * hueShift)) % 360;
        } else if (hueShiftMode === 'intensity') {
            // Shift hue based on motion intensity
            const intensityNormalized = Math.min(1, intensity / 255);
            finalHue = (baseHue + intensityNormalized * hueShift) % 360;
        } else if (hueShiftMode === 'time') {
            // Shift hue based on time
            const timeNormalized = (Date.now() % 10000) / 10000;
            finalHue = (baseHue + timeNormalized * hueShift) % 360;
        }
        
        // If HSV controls are defined, use them
        if (this.options.baseHue !== undefined) {
            // Convert HSV to RGB
            const color = this.hsvToRgb(finalHue / 360, saturation, value);
            return `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
        } else {
            // Use legacy color calculation for backward compatibility
            // Base color components with color shifting
            const r = Math.floor(intensity * 0.7 + Math.sin(colorPhase) * 50);
            const g = Math.floor(intensity * 0.5 + (normalizedTidal * 50) + Math.sin(colorPhase + 2.1) * 50);
            const b = Math.floor(intensity * 0.3 + (normalizedWave * 100) + Math.sin(colorPhase + 4.2) * 50);
            
            // Return RGBA color with alpha based on intensity
            return `rgba(${Math.max(0, Math.min(255, r))}, ${Math.max(0, Math.min(255, g))}, ${Math.max(0, Math.min(255, b))}, 0.7)`;
        }
    }
    
    /**
     * Process all layers (apply erosion, compaction, and limit max layers)
     * @param {number} compactionRate - Rate of compaction to apply (can be 0)
     */
    processLayers(compactionRate = 0.01) {
        // Age all layers and apply effects
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            
            // Increment age
            layer.age++;
            
            // Apply compaction (layers get thinner over time) if compaction rate > 0
            if (compactionRate > 0) {
                layer.compaction = Math.max(0.1, layer.compaction - compactionRate);
            }
            
            // Apply erosion based on neighboring layers
            if (i > 0 && i < this.layers.length - 1) {
                const prevLayer = this.layers[i - 1];
                const nextLayer = this.layers[i + 1];
                
                // Calculate erosion based on neighboring motion intensity
                const neighboringMotion = (prevLayer.motionIntensity + nextLayer.motionIntensity) / 2;
                layer.erosionFactor = Math.max(layer.erosionFactor, 
                                              (neighboringMotion / 255) * 0.05);
            }
            
            // Apply organic variation over time
            layer.organicVariation = (layer.organicVariation + 0.01) % 1;
        }
        
        // Limit number of layers
        if (this.layers.length > this.options.maxLayers) {
            this.layers.shift();
        }
    }
    
    /**
     * Apply blend mode between two colors
     * @param {Object} baseColor - Base color {r,g,b,a}
     * @param {Object} blendColor - Blend color {r,g,b,a}
     * @param {string} mode - Blend mode
     * @returns {Object} Result color {r,g,b,a}
     */
    applyBlendMode(baseColor, blendColor, mode) {
        // Extract color components
        const { r: r1, g: g1, b: b1, a: a1 = 1 } = baseColor;
        const { r: r2, g: g2, b: b2, a: a2 = 1 } = blendColor;
        
        let result = { r: 0, g: 0, b: 0, a: 1 };
        
        // Apply blend mode
        switch (mode) {
            case 'normal':
                // Standard alpha blending
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'multiply':
                // Multiply colors
                result = {
                    r: (r1 * r2) / 255,
                    g: (g1 * g2) / 255,
                    b: (b1 * b2) / 255,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'screen':
                // Screen colors
                result = {
                    r: 255 - (((255 - r1) * (255 - r2)) / 255),
                    g: 255 - (((255 - g1) * (255 - g2)) / 255),
                    b: 255 - (((255 - b1) * (255 - b2)) / 255),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'overlay':
                // Overlay blend
                result = {
                    r: r1 < 128 ? (2 * r1 * r2) / 255 : 255 - (2 * (255 - r1) * (255 - r2)) / 255,
                    g: g1 < 128 ? (2 * g1 * g2) / 255 : 255 - (2 * (255 - g1) * (255 - g2)) / 255,
                    b: b1 < 128 ? (2 * b1 * b2) / 255 : 255 - (2 * (255 - b1) * (255 - b2)) / 255,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'darken':
                // Darken
                result = {
                    r: Math.min(r1, r2),
                    g: Math.min(g1, g2),
                    b: Math.min(b1, b2),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'lighten':
                // Lighten
                result = {
                    r: Math.max(r1, r2),
                    g: Math.max(g1, g2),
                    b: Math.max(b1, b2),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'color-dodge':
                // Color dodge
                result = {
                    r: r1 === 0 ? 0 : Math.min(255, (r2 * 255) / (255 - r1)),
                    g: g1 === 0 ? 0 : Math.min(255, (g2 * 255) / (255 - g1)),
                    b: b1 === 0 ? 0 : Math.min(255, (b2 * 255) / (255 - b1)),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'color-burn':
                // Color burn
                result = {
                    r: r1 === 255 ? 255 : Math.max(0, 255 - ((255 - r2) * 255) / r1),
                    g: g1 === 255 ? 255 : Math.max(0, 255 - ((255 - g2) * 255) / g1),
                    b: b1 === 255 ? 255 : Math.max(0, 255 - ((255 - b2) * 255) / b1),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'hard-light':
                // Hard light
                result = {
                    r: r2 < 128 ? (r1 * r2) / 128 : 255 - ((255 - r1) * (255 - r2)) / 128,
                    g: g2 < 128 ? (g1 * g2) / 128 : 255 - ((255 - g1) * (255 - g2)) / 128,
                    b: b2 < 128 ? (b1 * b2) / 128 : 255 - ((255 - b1) * (255 - b2)) / 128,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'soft-light':
                // Soft light
                result = {
                    r: r1 < 128 ? r1 - (r1 * (128 - r2)) / 128 : r1 + ((r2 - 128) * (255 - r1)) / 128,
                    g: g1 < 128 ? g1 - (g1 * (128 - g2)) / 128 : g1 + ((g2 - 128) * (255 - g1)) / 128,
                    b: b1 < 128 ? b1 - (b1 * (128 - b2)) / 128 : b1 + ((b2 - 128) * (255 - b1)) / 128,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'difference':
                // Difference
                result = {
                    r: Math.abs(r1 - r2),
                    g: Math.abs(g1 - g2),
                    b: Math.abs(b1 - b2),
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'exclusion':
                // Exclusion
                result = {
                    r: r1 + r2 - 2 * r1 * r2 / 255,
                    g: g1 + g2 - 2 * g1 * g2 / 255,
                    b: b1 + b2 - 2 * b1 * b2 / 255,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'hue':
                // Hue
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'saturation':
                // Saturation
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'color':
                // Color
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'luminosity':
                // Luminosity
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'organic-flow':
                // Custom organic flow blend
                const flowFactor = Math.sin(this.tidalCycle) * 0.5 + 0.5;
                result = {
                    r: r1 * (1 - flowFactor) + r2 * flowFactor,
                    g: g1 * (1 - flowFactor) + g2 * flowFactor,
                    b: b1 * (1 - flowFactor) + b2 * flowFactor,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            case 'erosion-blend':
                // Erosion-based blend
                const erosionFactor = Math.min(1, (r2 + g2 + b2) / (3 * 255) * 2);
                result = {
                    r: r1 * (1 - erosionFactor) + r2 * erosionFactor,
                    g: g1 * (1 - erosionFactor) + g2 * erosionFactor,
                    b: b1 * (1 - erosionFactor) + g2 * erosionFactor,
                    a: a1 + a2 * (1 - a1) * erosionFactor
                };
                break;
                
            case 'wave-distort':
                // Wave distortion blend
                const waveFactor = Math.sin(this.wavePhase + (r1 + g1 + b1) / 30) * 0.5 + 0.5;
                result = {
                    r: r1 + (r2 - r1) * waveFactor,
                    g: g1 + (g2 - g1) * waveFactor,
                    b: b1 + (b2 - b1) * waveFactor,
                    a: a1 + a2 * (1 - a1)
                };
                break;
                
            default:
                // Default to normal
                result = {
                    r: r2,
                    g: g2,
                    b: b2,
                    a: a1 + a2 * (1 - a1)
                };
        }
        
        // Ensure values are in valid range
        return {
            r: Math.max(0, Math.min(255, result.r)),
            g: Math.max(0, Math.min(255, result.g)),
            b: Math.max(0, Math.min(255, result.b)),
            a: Math.max(0, Math.min(1, result.a))
        };
    }
    
    /**
     * Set the layering mode for all future layers
     * @param {string} mode - Layering mode
     */
    setLayeringMode(mode) {
        this.options.layeringMode = mode;
    }
    
    /**
     * Set the blend mode for all future layers
     * @param {string} mode - Blend mode
     */
    setBlendMode(mode) {
        if (this.blendModes.includes(mode)) {
            this.options.blendMode = mode;
        }
    }
    
    /**
     * Set the color shift amount
     * @param {number} shift - Color shift amount (0-100)
     */
    setColorShift(shift) {
        this.options.colorShift = Math.max(0, Math.min(100, shift));
    }
    
    /**
     * Set the organic factor
     * @param {number} factor - Organic factor (0-100)
     */
    setOrganicFactor(factor) {
        this.options.organicFactor = Math.max(0, Math.min(100, factor));
    }
    
    /**
     * Set the layer opacity
     * @param {number} opacity - Layer opacity (0-1)
     */
    setLayerOpacity(opacity) {
        this.options.layerOpacity = Math.max(0, Math.min(1, opacity));
    }
    
    /**
     * Set the layer spacing
     * @param {number} spacing - Layer spacing (0-100)
     */
    setLayerSpacing(spacing) {
        this.options.layerSpacing = Math.max(0, Math.min(100, spacing));
    }
    
    /**
     * Set the layer offset
     * @param {number} offset - Layer offset (0-100)
     */
    setLayerOffset(offset) {
        this.options.layerOffset = Math.max(0, Math.min(100, offset));
    }
    
    /**
     * Set the layer distortion
     * @param {number} distortion - Layer distortion (0-100)
     */
    setLayerDistortion(distortion) {
        this.options.layerDistortion = Math.max(0, Math.min(100, distortion));
    }
    
    /**
     * Set the layer blur
     * @param {number} blur - Layer blur (0-100)
     */
    setLayerBlur(blur) {
        this.options.layerBlur = Math.max(0, Math.min(100, blur));
    }
    
    /**
     * Get available blend modes
     * @returns {Array} Array of blend mode names
     */
    getBlendModes() {
        return [...this.blendModes];
    }
    
    /**
     * Get current system statistics
     * @returns {Object} System statistics
     */
    getStats() {
        // Calculate average motion intensity
        let totalMotion = 0;
        this.layers.forEach(layer => {
            totalMotion += layer.motionIntensity || 0;
        });
        
        const avgMotion = this.layers.length ? totalMotion / this.layers.length : 0;
        
        return {
            layerCount: this.layers.length,
            oldestLayerAge: this.layers.length ? this.layers[0].age : 0,
            averageMotion: avgMotion.toFixed(2),
            wavePhase: (this.wavePhase / (Math.PI * 2) * 360).toFixed(1) + '°',
            tidalCycle: (this.tidalCycle / (Math.PI * 2) * 360).toFixed(1) + '°',
            layeringMode: this.options.layeringMode,
            blendMode: this.options.blendMode,
            colorShift: this.options.colorShift,
            organicFactor: this.options.organicFactor,
            layerSpacing: this.options.layerSpacing,
            layerOffset: this.options.layerOffset,
            layerDistortion: this.options.layerDistortion,
            layerBlur: this.options.layerBlur
        };
    }
    
    /**
     * Render sediment layers to a canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context to render to
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} options - Rendering options
     */
    renderLayers(ctx, width, height, options = {}) {
        // Extract options
        const showWireframe = options.showWireframe || false;
        const highlightCurrent = options.highlightCurrent !== undefined ? options.highlightCurrent : true;
        const tidalFactor = options.tidalFactor !== undefined ? options.tidalFactor : 50;
        const waveEnergy = options.waveEnergy !== undefined ? options.waveEnergy : 50;
        const showWavePattern = options.showWavePattern !== undefined ? options.showWavePattern : false;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const layerSpacing = options.layerSpacing !== undefined ? options.layerSpacing : this.options.layerSpacing;
        const layerOffset = options.layerOffset !== undefined ? options.layerOffset : this.options.layerOffset;
        const layerDistortion = options.layerDistortion !== undefined ? options.layerDistortion : this.options.layerDistortion;
        const layerBlur = options.layerBlur !== undefined ? options.layerBlur : this.options.layerBlur;
        
        // Calculate wave phase and tidal cycle
        const now = Date.now();
        const wavePhase = (now % 10000) / 10000;
        this.wavePhase = wavePhase * Math.PI * 2;
        const tidalCycle = Math.sin(now / 10000 * Math.PI * 2) * 0.5 + 0.5;
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            // Draw a wave pattern background
            ctx.save();
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 30, 60, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 10, 30, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw wave lines
            const waveCount = 5 + Math.floor(waveEnergy / 20);
            const waveAmplitude = 5 + (waveEnergy / 10);
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < waveCount; i++) {
                const yPos = (height / (waveCount + 1)) * (i + 1);
                const phaseOffset = i * 0.2;
                
                ctx.beginPath();
                for (let x = 0; x < width; x += 5) {
                    const y = yPos + Math.sin(this.wavePhase + phaseOffset + (x * 0.01)) * waveAmplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // Sort layers based on layering mode
        let sortedLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                sortedLayers.reverse();
                break;
                
            case 'random':
                sortedLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                sortedLayers.sort((a, b) => a.motionIntensity - b.motionIntensity);
                break;
                
            // Standard, overlap, stacked, wave, stratigraphy, and brickwork modes use default sorting
        }
        
        // Set composite operation based on blend mode
        let compositeOperation = 'source-over'; // default
        
        switch (blendMode) {
            case 'multiply':
                compositeOperation = 'multiply';
                break;
                
            case 'screen':
                compositeOperation = 'screen';
                break;
                
            case 'overlay':
                compositeOperation = 'overlay';
                break;
                
            case 'darken':
                compositeOperation = 'darken';
                break;
                
            case 'lighten':
                compositeOperation = 'lighten';
                break;
                
            case 'color-dodge':
                compositeOperation = 'color-dodge';
                break;
                
            case 'color-burn':
                compositeOperation = 'color-burn';
                break;
                
            case 'hard-light':
                compositeOperation = 'hard-light';
                break;
                
            case 'soft-light':
                compositeOperation = 'soft-light';
                break;
                
            case 'difference':
                compositeOperation = 'difference';
                break;
                
            case 'exclusion':
                compositeOperation = 'exclusion';
                break;
                
            case 'hue':
                compositeOperation = 'hue';
                break;
                
            case 'saturation':
                compositeOperation = 'saturation';
                break;
                
            case 'color':
                compositeOperation = 'color';
                break;
                
            case 'luminosity':
                compositeOperation = 'luminosity';
                break;
                
            // Custom blend modes will be handled separately
        }
        
        // Special handling for stratigraphy mode
        if (layeringMode === 'stratigraphy') {
            // Draw minimal reference grid
            ctx.drawImage(this.stratigraphyPattern, 0, 0, width, height);
            
            // Add data visualization frame - high contrast, minimal ink
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, width - 20, height - 20);
            
            // Add time indicator at bottom
            const indicatorWidth = 100;
            const indicatorHeight = 20;
            ctx.fillStyle = 'rgba(255, 60, 30, 0.9)';
            ctx.fillRect(width/2 - indicatorWidth/2, height - indicatorHeight - 5, indicatorWidth, indicatorHeight);
            
            // Add text label for clarity
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('STRATIGRAPHY MODE', width/2, height - 10);
        }
        
        // Special handling for brickwork mode
        if (layeringMode === 'brickwork') {
            // Create pattern from brick canvas
            const brickPattern = ctx.createPattern(this.brickPattern, 'repeat');
            ctx.fillStyle = brickPattern;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Draw each layer
        sortedLayers.forEach((layer, index) => {
            // Calculate layer width and height
            const layerWidth = layer.data.width;
            const isNewest = layer === this.layers[this.layers.length - 1];
            
            // Calculate y position based on layering mode
            let yPosition;
            
            switch (layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    yPosition = height - ((index + 1) * (height / (sortedLayers.length + 1)));
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    yPosition = (height - layer.data.height) / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((index / sortedLayers.length) * Math.PI * 2 + this.wavePhase);
                    yPosition = (height - layer.data.height) * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'stratigraphy':
                    // Maximize data-to-ink ratio with high-information visualization
                    
                    // Calculate data-rich position based on layer properties
                    const normalizedAge = index / sortedLayers.length;
                    const layerOpacity = 0.7 + (normalizedAge * 0.3); // Newer layers more visible
                    
                    // Create data-rich horizontal bands
                    const bandHeight = 2 + (layerSpacing / 5);
                    yPosition = height - 30 - (index * bandHeight);
                    
                    // Skip if outside visible area
                    if (yPosition < 0 || yPosition > height) return;
                    
                    // Create a temporary canvas for this layer
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = layer.data.width;
                    tempCanvas.height = layer.data.height;
                    tempCtx.putImageData(layer.data, 0, 0);
                    
                    // Draw the layer data as a horizontal band - maximum data visibility
                    ctx.drawImage(
                        tempCanvas, 
                        0, 0, layer.data.width, layer.data.height,
                        0, yPosition, width, bandHeight
                    );
                    
                    // Add data markers - high information, low ink
                    // Color-code based on layer properties for additional data channel
                    const markerColor = `rgba(${200 + (layer.stratigraphyType * 10)}, ${50 + (layer.age % 100)}, ${30 + (layer.motion * 2)}, ${layerOpacity})`;
                    
                    // Left data marker
                    ctx.fillStyle = markerColor;
                    ctx.fillRect(0, yPosition, 5, bandHeight);
                    
                    // Right data marker
                    ctx.fillRect(width - 5, yPosition, 5, bandHeight);
                    
                    // Add data points at intervals - maximizing information
                    const dataPoints = 10;
                    const pointSpacing = width / dataPoints;
                    
                    for (let i = 0; i < dataPoints; i++) {
                        // Skip some points based on data properties to encode more information
                        if ((i + layer.stratigraphyType) % 3 === 0) {
                            const pointX = i * pointSpacing;
                            const pointHeight = bandHeight * (0.5 + (layer.motion / 100));
                            
                            ctx.fillStyle = markerColor;
                            ctx.fillRect(pointX, yPosition, 2, pointHeight);
                        }
                    }
                    
                    // Add time indicator for significant layers
                    if (index % 10 === 0 || layer.motion > 50) {
                        const timeX = width - 40;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'right';
                        ctx.fillText(`T-${index}`, timeX, yPosition + bandHeight - 1);
                    }
                    
                    // Add motion value indicator for high-motion layers
                    if (layer.motion > 30) {
                        const motionX = 40;
                        ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'left';
                        ctx.fillText(`M:${layer.motion}`, motionX, yPosition + bandHeight - 1);
                    }
                    return;
                    
                case 'brickwork':
                    // Brickwork pattern - alternating rows with offset
                    const brickHeight = 5 + (layerSpacing / 5);
                    const rowOffset = layer.brickRow * (width / 4); // Offset every other row
                    yPosition = height - ((index + 1) * brickHeight);
                    
                    // Adjust x position for brickwork pattern
                    if (layer.brickRow === 1) {
                        // Apply offset for odd rows
                        xPosition = (Math.floor((width * layer.position) / 100) + rowOffset) % width;
                    }
                    break;
                    
                case 'standard':
                default:
                    // Standard - layers grow from bottom
                    yPosition = height - layer.data.height;
                    break;
            }
            
            // Calculate x position
            let xPosition;
            
            // Calculate position in pixels with wave displacement
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layer.position / 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            // Only set xPosition if not already set (for brickwork)
            if (xPosition === undefined) {
                xPosition = Math.floor(width * layer.position) / 100 + 
                         (layer.waveDisplacement || 0) + 
                         (showWavePattern ? waveEffect : 0);
            }
            
            // Apply layer offset
            if (layerOffset > 0) {
                const offsetAmount = (layerOffset / 100) * (width * 0.4);
                xPosition += Math.sin(index * 0.1) * offsetAmount;
            }
            
            // Set global composite operation
            ctx.globalCompositeOperation = compositeOperation;
            
            // Set global alpha for layer opacity
            ctx.globalAlpha = layer.opacity || this.options.layerOpacity;
            
            // Create temporary canvas for the slit
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = layer.data.width;
            tempCanvas.height = layer.data.height;
            tempCtx.putImageData(layer.data, 0, 0);
            
            // Apply blur if specified
            if (layerBlur > 0) {
                const blurAmount = layerBlur * 10;
                tempCtx.filter = `blur(${blurAmount}px)`;
                const blurredCanvas = document.createElement('canvas');
                blurredCanvas.width = tempCanvas.width;
                blurredCanvas.height = tempCanvas.height;
                const blurredCtx = blurredCanvas.getContext('2d');
                blurredCtx.drawImage(tempCanvas, 0, 0);
                tempCanvas = blurredCanvas;
                tempCtx = blurredCtx;
            }
            
            // Apply erosion effect
            if (layer.erosionFactor > 0) {
                // Simple erosion - make the layer slightly transparent based on erosion factor
                ctx.globalAlpha = Math.max(0.2, 1 - (layer.erosionFactor * 2));
            }
            
            // Calculate layer height based on compaction
            const layerHeight = layer.data.height * (layer.compaction || 1.0);
            
            // Special rendering for stratigraphy mode
            if (layeringMode === 'stratigraphy') {
                // Already handled above
                return;
            }
            
            // Special rendering for brickwork mode
            if (layeringMode === 'brickwork') {
                // Create a hyperclay architectural rendering
                
                // Calculate a grid position based on layer properties
                const gridSize = 20 + (layerSpacing * 2);
                const gridX = Math.floor(index / 5) % Math.floor(width / gridSize);
                const gridY = Math.floor(index / 5 / Math.floor(width / gridSize));
                
                // Calculate actual position
                const brickX = gridX * gridSize;
                const brickY = gridY * gridSize;
                
                // Calculate brick dimensions based on layer properties
                const brickWidth = gridSize - 2;
                const brickHeight = gridSize - 2;
                
                // Create a temporary canvas for the brick
                const brickCanvas = document.createElement('canvas');
                const brickCtx = brickCanvas.getContext('2d');
                brickCanvas.width = brickWidth;
                brickCanvas.height = brickHeight;
                
                // Draw the original slit data stretched to fill the brick
                brickCtx.drawImage(
                    tempCanvas, 
                    0, 0, layer.data.width, layer.data.height,
                    0, 0, brickWidth, brickHeight
                );
                
                // Apply a distortion effect based on layer properties
                const distortionCanvas = document.createElement('canvas');
                const distortionCtx = distortionCanvas.getContext('2d');
                distortionCanvas.width = brickWidth;
                distortionCanvas.height = brickHeight;
                
                // Create a distortion pattern
                const distortionPattern = distortionCtx.createLinearGradient(0, 0, brickWidth, brickHeight);
                distortionPattern.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                distortionPattern.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
                distortionPattern.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                
                distortionCtx.fillStyle = distortionPattern;
                distortionCtx.fillRect(0, 0, brickWidth, brickHeight);
                
                // Apply the distortion to the brick
                brickCtx.globalCompositeOperation = 'overlay';
                brickCtx.drawImage(distortionCanvas, 0, 0);
                brickCtx.globalCompositeOperation = 'source-over';
                
                // Draw the brick onto the main canvas
                ctx.save();
                
                // Add a slight rotation based on layer properties
                const rotation = (layer.brickRow % 2 === 0) ? -0.05 : 0.05;
                ctx.translate(brickX + brickWidth/2, brickY + brickHeight/2);
                ctx.rotate(rotation);
                
                // Draw the brick
                ctx.drawImage(brickCanvas, -brickWidth/2, -brickHeight/2);
                
                // Add mortar lines
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(-brickWidth/2, -brickHeight/2, brickWidth, brickHeight);
                
                // Add wear and tear based on layer age
                if (layer.age > 10) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    
                    // Add cracks
                    ctx.beginPath();
                    ctx.moveTo(-brickWidth/2 + Math.random() * brickWidth/3, -brickHeight/2);
                    ctx.lineTo(-brickWidth/2 + Math.random() * brickWidth, brickHeight/2 - Math.random() * brickHeight/3);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    
                    // Add chips and damage
                    for (let i = 0; i < 3; i++) {
                        const chipX = -brickWidth/2 + Math.random() * brickWidth;
                        const chipY = -brickHeight/2 + Math.random() * brickHeight;
                        const chipSize = 1 + Math.random() * 3;
                        ctx.beginPath();
                        ctx.arc(chipX, chipY, chipSize, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                ctx.restore();
            }
            
            // Apply distortion if enabled (for other modes)
            else if (layerDistortion > 0) {
                // Save context state
                ctx.save();
                
                // Create distorted path for clipping
                const distortionAmount = layerDistortion / 100;
                const points = 20; // Number of points to create curve
                
                ctx.beginPath();
                
                for (let i = 0; i <= points; i++) {
                    const x = xPosition + (i / points) * layerWidth;
                    const distortionY = Math.sin(i * 0.5 + index) * (layerHeight * distortionAmount);
                    const y = yPosition + distortionY;
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.clip();
                
                // Draw the slit image
                ctx.drawImage(
                    tempCanvas, 
                    0, 0, layer.data.width, layer.data.height,
                    xPosition, yPosition, layerWidth, layerHeight
                );
                
                // Restore context state
                ctx.restore();
            } else {
                // Draw the slit image directly
                ctx.drawImage(
                    tempCanvas, 
                    0, 0, layer.data.width, layer.data.height,
                    xPosition, yPosition, layerWidth, layerHeight
                );
            }
            
            // Reset global alpha
            ctx.globalAlpha = 1.0;
            
            // Draw wireframe if enabled
            if (showWireframe) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(xPosition, yPosition, layerWidth, layerHeight);
            }
            
            // Highlight newest layer if enabled
            if (highlightCurrent && isNewest) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.lineWidth = 2;
                ctx.strokeRect(xPosition - 2, yPosition - 2, layerWidth + 4, layerHeight + 4);
            }
        });
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }
    
    /**
     * Render heatmap visualization of motion intensity
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} options - Additional rendering options
     */
    renderHeatmap(ctx, width, height, options = {}) {
        // Extract options with defaults
        const tidalFactor = options.tidalFactor !== undefined ? options.tidalFactor : 50;
        const waveEnergy = options.waveEnergy !== undefined ? options.waveEnergy : 50;
        const showWavePattern = options.showWavePattern !== undefined ? options.showWavePattern : false;
        const maxLayers = options.maxLayers !== undefined ? options.maxLayers : this.options.maxLayers;
        const highlightCurrent = options.highlightCurrent !== undefined ? options.highlightCurrent : true;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const layerSpacing = options.layerSpacing !== undefined ? options.layerSpacing : this.options.layerSpacing;
        const layerOffset = options.layerOffset !== undefined ? options.layerOffset : this.options.layerOffset;
        const layerDistortion = options.layerDistortion !== undefined ? options.layerDistortion : this.options.layerDistortion;
        const layerBlur = options.layerBlur !== undefined ? options.layerBlur : this.options.layerBlur;
        const baseHue = options.baseHue !== undefined ? options.baseHue : 0;
        const saturation = options.saturation !== undefined ? options.saturation : 100;
        const value = options.value !== undefined ? options.value : 100;
        const hueShift = options.hueShift !== undefined ? options.hueShift : 0;
        const hueShiftMode = options.hueShiftMode || 'fixed';
        
        // Calculate wave phase
        const now = Date.now();
        const wavePhase = (now % 10000) / 10000;
        this.wavePhase = wavePhase * Math.PI * 2;
        
        // Calculate tidal cycle
        const tidalCycle = Math.sin(now / 10000 * Math.PI * 2) * 0.5 + 0.5;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            // Draw a wave pattern background
            ctx.save();
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 30, 60, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 10, 30, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw wave lines
            const waveCount = 5 + Math.floor(waveEnergy / 20);
            const waveAmplitude = 5 + (waveEnergy / 10);
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < waveCount; i++) {
                const yPos = (height / (waveCount + 1)) * (i + 1);
                const phaseOffset = i * 0.2;
                
                ctx.beginPath();
                for (let x = 0; x < width; x += 5) {
                    const y = yPos + Math.sin(this.wavePhase + phaseOffset + (x * 0.01)) * waveAmplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // If no layers, return
        if (this.layers.length === 0) {
            return;
        }
        
        // Calculate the number of layers to display
        const layersToDisplay = Math.min(maxLayers, this.layers.length);
        
        // Sort layers based on layering mode
        let sortedLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                sortedLayers.reverse();
                break;
                
            case 'random':
                sortedLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                sortedLayers.sort((a, b) => a.motionIntensity - b.motionIntensity);
                break;
                
            // Other modes use default sorting
        }
        
        // Get the layers to display
        const visibleLayers = sortedLayers.slice(-layersToDisplay);
        
        // Set composite operation based on blend mode
        const originalCompositeOperation = ctx.globalCompositeOperation;
        switch (blendMode) {
            case 'multiply':
                ctx.globalCompositeOperation = 'multiply';
                break;
                
            case 'screen':
                ctx.globalCompositeOperation = 'screen';
                break;
                
            case 'overlay':
                ctx.globalCompositeOperation = 'overlay';
                break;
                
            case 'lighten':
                ctx.globalCompositeOperation = 'lighten';
                break;
                
            case 'color-dodge':
                ctx.globalCompositeOperation = 'color-dodge';
                break;
                
            case 'soft-light':
                ctx.globalCompositeOperation = 'soft-light';
                break;
                
            default:
                ctx.globalCompositeOperation = 'source-over';
        }
        
        // Special handling for stratigraphy mode
        if (layeringMode === 'stratigraphy') {
            // Draw minimal reference grid
            ctx.drawImage(this.stratigraphyPattern, 0, 0, width, height);
            
            // Add data visualization frame
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, width - 20, height - 20);
            
            // Add time indicator at bottom
            const indicatorWidth = 100;
            const indicatorHeight = 20;
            ctx.fillStyle = 'rgba(255, 60, 30, 0.9)';
            ctx.fillRect(width/2 - indicatorWidth/2, height - indicatorHeight - 5, indicatorWidth, indicatorHeight);
            
            // Add text label for clarity
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('HEAT STRATIGRAPHY', width/2, height - 10);
        }
        
        // Special handling for brickwork mode
        if (layeringMode === 'brickwork') {
            // Create pattern from brick canvas
            const brickPattern = ctx.createPattern(this.brickPattern, 'repeat');
            ctx.fillStyle = brickPattern;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Draw heatmap for each layer
        visibleLayers.forEach((layer, index) => {
            // Calculate normalized position in the canvas (0-1)
            const layerPosition = layer.position / 100;
            
            // Calculate wave effect
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layerPosition * 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            // Apply wave displacement and layer offset
            const normalizedOffset = layerOffset / 100;
            const offsetX = width * normalizedOffset;
            
            // Apply layer distortion
            const distortionFactor = layerDistortion / 100;
            const distortion = Math.sin(layerPosition * Math.PI * 2) * distortionFactor * 20;
            
            // Calculate x position with all effects
            let x = Math.floor(width * layerPosition) + 
                  (layer.waveDisplacement || 0) + 
                  (showWavePattern ? waveEffect : 0) + 
                  offsetX + 
                  distortion;
            
            // Calculate y position based on layering mode
            let yPos;
            
            // Calculate intensity based on motion
            const intensity = layer.motionIntensity / 255;
            
            // Calculate hue based on shift mode
            let finalHue = baseHue;
            
            switch (hueShiftMode) {
                case 'layer':
                    // Shift hue based on layer position
                    finalHue = (baseHue + (index / visibleLayers.length) * hueShift) % 360;
                    break;
                    
                case 'time':
                    // Shift hue based on time
                    const timeNormalized = (Date.now() % 10000) / 10000;
                    finalHue = (baseHue + timeNormalized * hueShift) % 360;
                    break;
                    
                case 'fixed':
                default:
                    // Use base hue
                    finalHue = baseHue;
            }
            
            switch (layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    yPos = height - ((index + 1) * (height / (visibleLayers.length + 1)));
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    yPos = (height - layer.data.height) / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((index / visibleLayers.length) * Math.PI * 2 + this.wavePhase);
                    yPos = (height - layer.data.height) * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'stratigraphy':
                    // Maximize data-to-ink ratio with high-information visualization
                    const bandHeight = 2 + (layerSpacing / 5);
                    yPos = height - 30 - (index * bandHeight);
                    
                    // Skip if outside visible area
                    if (yPos < 0 || yPos > height) return;
                    
                    // Convert HSV to RGB for the heat color
                    const heatColor = this.hsvToRgb(
                        finalHue / 360,
                        saturation / 100,
                        value / 100
                    );
                    
                    // Draw heat band
                    ctx.fillStyle = `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0.7)`;
                    ctx.fillRect(0, yPos, width, bandHeight);
                    
                    // Add heat point
                    const pointSize = 3 + (intensity * 5);
                    ctx.beginPath();
                    ctx.arc(x, yPos + bandHeight/2, pointSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add time indicator for significant layers
                    if (index % 10 === 0 || intensity > 0.5) {
                        const timeX = width - 40;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'right';
                        ctx.fillText(`T-${index}`, timeX, yPos + bandHeight - 1);
                    }
                    
                    // Add motion value indicator for high-motion layers
                    if (intensity > 0.3) {
                        const motionX = 40;
                        ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'left';
                        ctx.fillText(`M:${Math.floor(intensity * 100)}`, motionX, yPos + bandHeight - 1);
                    }
                    return;
                    
                case 'brickwork':
                    // Brickwork pattern - alternating rows with offset
                    const rowHeight = height / (visibleLayers.length + 1);
                    const rowOffset = (index % 2) * (width / 4);
                    yPos = index * rowHeight;
                    x = (x + rowOffset) % width;
                    break;
                    
                default:
                    // Standard mode - layers stacked from bottom to top
                    const normalizedSpacing = layerSpacing / 100;
                    yPos = height - ((index + 1) * (height / (layersToDisplay + normalizedSpacing * 10)));
            }
            
            // Apply blur effect
            const blurAmount = layerBlur * 2;
            if (blurAmount > 0) {
                ctx.shadowBlur = blurAmount;
                ctx.shadowColor = 'rgba(255, 100, 50, 0.5)';
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Convert HSV to RGB for the heat color
            const heatColor = this.hsvToRgb(
                finalHue / 360,
                saturation / 100,
                Math.min(1, value / 100 + (intensity * 0.5)) // Boost value based on intensity
            );
            
            // Calculate heat point size based on intensity, layer width, and layer height
            const baseSize = Math.max(5, layer.data.width / 4);
            const size = baseSize + (intensity * baseSize * 2);
            
            // Create a radial gradient for the heat point
            const gradient = ctx.createRadialGradient(x, yPos, 0, x, yPos, size);
            gradient.addColorStop(0, `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0.9)`);
            gradient.addColorStop(0.7, `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0.5)`);
            gradient.addColorStop(1, `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0)`);
            
            // Draw heat point
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, yPos, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw horizontal heat trail
            const trailLength = Math.min(width/2, layer.data.width + (intensity * 150) + (layerDistortion * 2));
            
            // Create gradient for trail
            const trailGradient = ctx.createLinearGradient(
                x, yPos, 
                Math.max(0, x - trailLength), yPos
            );
            
            trailGradient.addColorStop(0, `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0.7)`);
            trailGradient.addColorStop(1, `rgba(${heatColor.r}, ${heatColor.g}, ${heatColor.b}, 0)`);
            
            ctx.strokeStyle = trailGradient;
            ctx.lineWidth = Math.max(2, size * 0.4);
            ctx.beginPath();
            ctx.moveTo(x, yPos);
            ctx.lineTo(Math.max(0, x - trailLength), yPos);
            ctx.stroke();
            
            // Highlight current layer if it's the most recent and highlighting is enabled
            if (highlightCurrent && index === visibleLayers.length - 1) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, yPos, size + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Reset composite operation and shadow
        ctx.globalCompositeOperation = originalCompositeOperation;
        ctx.shadowBlur = 0;
        
        // Add grid overlay for reference
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        // Vertical grid lines
        for (let x = 0; x < width; x += width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = 0; y < height; y += height / 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    /**
     * Get heat color based on intensity and color shift
     * @param {number} intensity - Intensity value (0-1)
     * @param {number} colorShift - Color shift value (0-1)
     * @returns {Object} RGB color values
     */
    getHeatColor(intensity, colorShift) {
        // Base heat colors (red to yellow to white)
        let r, g, b;
        
        if (colorShift < 0.33) {
            // Red to yellow to white heat scale
            r = Math.min(255, Math.floor(200 + (intensity * 55)));
            g = Math.min(255, Math.floor(intensity * 200));
            b = Math.min(255, Math.floor(intensity * 100));
        } else if (colorShift < 0.66) {
            // Blue to cyan to white heat scale
            r = Math.min(255, Math.floor(intensity * 100));
            g = Math.min(255, Math.floor(intensity * 200));
            b = Math.min(255, Math.floor(200 + (intensity * 55)));
        } else {
            // Green to yellow to white heat scale
            r = Math.min(255, Math.floor(intensity * 200));
            g = Math.min(255, Math.floor(200 + (intensity * 55)));
            b = Math.min(255, Math.floor(intensity * 100));
        }
        
        return { r, g, b };
    }
    
    /**
     * Convert HSL color to RGB
     * @param {number} h - Hue (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} l - Lightness (0-1)
     * @returns {Object} RGB color object
     */
    hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    /**
     * Convert HSV color to RGB
     * @param {number} h - Hue (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {Object} RGB color values
     */
    hsvToRgb(h, s, v) {
        let r, g, b;
        
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    /**
     * Create stratigraphy pattern for geological layering
     * @returns {Canvas} Stratigraphy pattern canvas
     */
    createStratigraphyPattern() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;
        
        // Create high-contrast data visualization grid
        // Using minimal ink for maximum data representation
        
        // Clear background - no wasted ink
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create minimal grid system for data reference
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.5;
        
        // Draw minimal grid lines - only what's needed for reference
        const gridSpacing = 50;
        for (let i = 0; i <= canvas.width; i += gridSpacing) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        // Add data measurement points at intersections
        for (let x = gridSpacing; x < canvas.width; x += gridSpacing) {
            for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
                if ((x / gridSpacing + y / gridSpacing) % 3 === 0) {
                    ctx.fillStyle = 'rgba(255, 100, 50, 0.2)';
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        // Add measurement scales on edges - useful data
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '8px sans-serif';
        
        for (let i = 0; i <= canvas.width; i += gridSpacing) {
            // Bottom scale
            ctx.fillText(i.toString(), i, canvas.height - 5);
            // Right scale
            ctx.fillText(i.toString(), canvas.width - 15, i);
        }
        
        return canvas;
    }
    
    /**
     * Create brick pattern for brickwork layering
     * @returns {Canvas} Brick pattern canvas
     */
    createBrickPattern() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 400;
        
        // Create a more conceptual representation of architectural time
        // Using a grid that distorts and evolves
        
        // Fill with dark background
        ctx.fillStyle = 'rgba(30, 30, 30, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create evolving grid system - from ancient to modern
        const gridSizes = [
            { size: 80, opacity: 0.7, lineWidth: 3 },   // Ancient megalithic
            { size: 40, opacity: 0.6, lineWidth: 2 },   // Classical
            { size: 20, opacity: 0.5, lineWidth: 1.5 }, // Medieval
            { size: 10, opacity: 0.4, lineWidth: 1 },   // Industrial
            { size: 5, opacity: 0.3, lineWidth: 0.5 }   // Modern
        ];
        
        // Draw each grid system with distortion
        gridSizes.forEach((grid, index) => {
            ctx.strokeStyle = `rgba(200, 180, 160, ${grid.opacity})`;
            ctx.lineWidth = grid.lineWidth;
            
            // Horizontal lines with distortion
            for (let y = 0; y <= canvas.height; y += grid.size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                
                for (let x = 0; x <= canvas.width; x += 10) {
                    // Add increasing distortion for newer grids
                    const distortionFactor = (index + 1) * 0.5;
                    const distortion = Math.sin(x * 0.01 + y * 0.01) * distortionFactor;
                    ctx.lineTo(x, y + distortion);
                }
                ctx.stroke();
            }
            
            // Vertical lines with distortion
            for (let x = 0; x <= canvas.width; x += grid.size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                
                for (let y = 0; y <= canvas.height; y += 10) {
                    // Add increasing distortion for newer grids
                    const distortionFactor = (index + 1) * 0.5;
                    const distortion = Math.sin(y * 0.01 + x * 0.01) * distortionFactor;
                    ctx.lineTo(x + distortion, y);
                }
                ctx.stroke();
            }
        });
        
        // Add architectural elements - arches, columns, etc.
        for (let i = 0; i < 12; i++) {
            const x = 20 + (i % 4) * 100;
            const y = 20 + Math.floor(i / 4) * 100;
            const width = 60;
            const height = 80;
            
            // Draw arch
            ctx.fillStyle = 'rgba(120, 100, 80, 0.7)';
            ctx.beginPath();
            ctx.rect(x, y + height/2, width, height/2);
            ctx.arc(x + width/2, y + height/2, width/2, Math.PI, 0);
            ctx.fill();
            
            // Add texture
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 0.5;
            
            // Horizontal mortar lines
            for (let j = y + height/2; j < y + height; j += 10) {
                ctx.beginPath();
                ctx.moveTo(x, j);
                ctx.lineTo(x + width, j);
                ctx.stroke();
            }
            
            // Vertical mortar lines
            for (let j = x; j <= x + width; j += 10) {
                const startY = y + height/2;
                const endY = y + height;
                ctx.beginPath();
                ctx.moveTo(j, startY);
                ctx.lineTo(j, endY);
                ctx.stroke();
            }
            
            // Arch mortar lines
            for (let angle = 0; angle <= Math.PI; angle += Math.PI/8) {
                const startX = x + width/2 + Math.cos(angle) * width/2;
                const startY = y + height/2 + Math.sin(angle) * width/2;
                ctx.beginPath();
                ctx.moveTo(x + width/2, y + height/2);
                ctx.lineTo(startX, startY);
                ctx.stroke();
            }
        }
        
        return canvas;
    }
    
    /**
     * Create noise pattern for erosion blend mode
     * @param {number} intensity - Erosion intensity (0-1)
     * @returns {Canvas} Noise pattern canvas
     */
    createNoisePattern(intensity) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(100, 100);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;
            const value = noise < (255 * intensity) ? 0 : 255;
            
            data[i] = value;         // R
            data[i + 1] = value;     // G
            data[i + 2] = value;     // B
            data[i + 3] = noise;     // A
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }
    
    /**
     * Create wave pattern for wave-distort blend mode
     * @param {number} hue - Hue value (0-360)
     * @param {number} saturation - Saturation value (0-100)
     * @param {number} lightness - Lightness value (0-100)
     * @param {number} phase - Wave phase (0-1)
     * @returns {Canvas} Wave pattern canvas
     */
    createWavePattern(hue, saturation, lightness, phase) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 100, 100);
        
        for (let i = 0; i <= 10; i++) {
            const stop = i / 10;
            const waveOffset = Math.sin(stop * Math.PI * 4 + phase * Math.PI * 2) * 0.5 + 0.5;
            const h = (hue + waveOffset * 60) % 360;
            gradient.addColorStop(stop, `hsla(${h}, ${saturation}%, ${lightness}%, 0.8)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 100, 100);
        
        return canvas;
    }
    
    /**
     * Draw wave pattern overlay
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} options - Options for wave pattern
     */
    drawWavePattern(ctx, width, height, options) {
        // Create wave pattern
        const wavePattern = this.createWavePattern(0, 100, 50, options.wavePhase);
        
        // Draw wave pattern
        ctx.globalCompositeOperation = 'overlay';
        ctx.drawImage(wavePattern, 0, 0, width, height);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
    }
    
    renderSediment(ctx, width, height, options = {}) {
        // Extract options with defaults
        const tidalFactor = options.tidalFactor !== undefined ? options.tidalFactor : 50;
        const waveEnergy = options.waveEnergy !== undefined ? options.waveEnergy : 50;
        const showWavePattern = options.showWavePattern !== undefined ? options.showWavePattern : false;
        const maxLayers = options.maxLayers !== undefined ? options.maxLayers : this.options.maxLayers;
        const highlightCurrent = options.highlightCurrent !== undefined ? options.highlightCurrent : true;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const layerSpacing = options.layerSpacing !== undefined ? options.layerSpacing : this.options.layerSpacing;
        const layerOffset = options.layerOffset !== undefined ? options.layerOffset : this.options.layerOffset;
        const layerDistortion = options.layerDistortion !== undefined ? options.layerDistortion : this.options.layerDistortion;
        const layerBlur = options.layerBlur !== undefined ? options.layerBlur : this.options.layerBlur;
        
        // HSV color controls
        const baseHue = options.baseHue !== undefined ? options.baseHue : 0;
        const saturation = options.saturation !== undefined ? options.saturation : 100;
        const value = options.value !== undefined ? options.value : 100;
        const hueShift = options.hueShift !== undefined ? options.hueShift : 0;
        const hueShiftMode = options.hueShiftMode || 'fixed';
        
        // Calculate wave phase
        const now = Date.now();
        const wavePhase = (now % 10000) / 10000;
        this.wavePhase = wavePhase * Math.PI * 2;
        
        // Calculate tidal cycle
        const tidalCycle = Math.sin(now / 10000 * Math.PI * 2) * 0.5 + 0.5;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            // Draw a wave pattern background
            ctx.save();
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 30, 60, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 10, 30, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw wave lines
            const waveCount = 5 + Math.floor(waveEnergy / 20);
            const waveAmplitude = 5 + (waveEnergy / 10);
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < waveCount; i++) {
                const yPos = (height / (waveCount + 1)) * (i + 1);
                const phaseOffset = i * 0.2;
                
                ctx.beginPath();
                for (let x = 0; x < width; x += 5) {
                    const y = yPos + Math.sin(this.wavePhase + phaseOffset + (x * 0.01)) * waveAmplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // If no layers, return
        if (this.layers.length === 0) {
            return;
        }
        
        // Calculate the number of layers to display
        const layersToDisplay = Math.min(maxLayers, this.layers.length);
        
        // Sort layers based on layering mode
        let sortedLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                sortedLayers.reverse();
                break;
                
            case 'random':
                sortedLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                sortedLayers.sort((a, b) => a.motionIntensity - b.motionIntensity);
                break;
                
            // Other modes use default sorting
        }
        
        // Get the layers to display
        const visibleLayers = sortedLayers.slice(-layersToDisplay);
        
        // Set composite operation based on blend mode
        const originalCompositeOperation = ctx.globalCompositeOperation;
        switch (blendMode) {
            case 'multiply':
                ctx.globalCompositeOperation = 'multiply';
                break;
            case 'screen':
                ctx.globalCompositeOperation = 'screen';
                break;
            case 'overlay':
                ctx.globalCompositeOperation = 'overlay';
                break;
            case 'lighten':
                ctx.globalCompositeOperation = 'lighten';
                break;
            case 'color-dodge':
                ctx.globalCompositeOperation = 'color-dodge';
                break;
            case 'soft-light':
                ctx.globalCompositeOperation = 'soft-light';
                break;
            default:
                ctx.globalCompositeOperation = 'source-over';
        }
        
        // Special handling for stratigraphy mode
        if (layeringMode === 'stratigraphy') {
            // Draw minimal reference grid
            ctx.drawImage(this.stratigraphyPattern, 0, 0, width, height);
            
            // Add data visualization frame
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, width - 20, height - 20);
            
            // Add time indicator at bottom
            const indicatorWidth = 100;
            const indicatorHeight = 20;
            ctx.fillStyle = 'rgba(255, 60, 30, 0.9)';
            ctx.fillRect(width/2 - indicatorWidth/2, height - indicatorHeight - 5, indicatorWidth, indicatorHeight);
            
            // Add text label for clarity
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('SEDIMENT STRATIGRAPHY', width/2, height - 10);
        }
        
        // Special handling for brickwork mode
        if (layeringMode === 'brickwork') {
            // Create pattern from brick canvas
            const brickPattern = ctx.createPattern(this.brickPattern, 'repeat');
            ctx.fillStyle = brickPattern;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Draw each layer
        visibleLayers.forEach((layer, index) => {
            // Calculate normalized position in the canvas (0-1)
            const layerPosition = layer.position / 100;
            
            // Calculate wave effect
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layerPosition * 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            // Apply wave displacement and layer offset
            const normalizedOffset = layerOffset / 100;
            const offsetX = width * normalizedOffset;
            
            // Apply layer distortion
            const distortionFactor = layerDistortion / 100;
            const distortion = Math.sin(layerPosition * Math.PI * 2) * distortionFactor * 20;
            
            // Calculate x position with all effects
            const x = Math.floor(width * layerPosition) + 
                    (layer.waveDisplacement || 0) + 
                    (showWavePattern ? waveEffect : 0) + 
                    offsetX + 
                    distortion;
            
            // Calculate y position based on layering mode
            let y;
            
            // Calculate hue based on shift mode
            let finalHue = baseHue;
            
            switch (hueShiftMode) {
                case 'layer':
                    // Shift hue based on layer position
                    finalHue = (baseHue + (index / visibleLayers.length) * hueShift) % 360;
                    break;
                    
                case 'time':
                    // Shift hue based on time
                    const timeNormalized = (Date.now() % 10000) / 10000;
                    finalHue = (baseHue + timeNormalized * hueShift) % 360;
                    break;
                    
                case 'fixed':
                default:
                    // Use base hue
                    finalHue = baseHue;
            }
            
            // Convert HSV to RGB for the layer color
            const layerColor = this.hsvToRgb(
                finalHue / 360,
                saturation / 100,
                value / 100
            );
            
            switch (layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    y = height - ((index + 1) * (height / (visibleLayers.length + 1)));
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    y = height / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((index / visibleLayers.length) * Math.PI * 2 + this.wavePhase);
                    y = height * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'stratigraphy':
                    // Maximize data-to-ink ratio with high-information visualization
                    const bandHeight = 2 + (layerSpacing / 5);
                    y = height - 30 - (index * bandHeight);
                    
                    // Skip if outside visible area
                    if (y < 0 || y > height) return;
                    
                    // Draw sediment band
                    ctx.fillStyle = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.7)`;
                    ctx.fillRect(0, y, width, bandHeight);
                    
                    // Add sediment point
                    const pointSize = 3;
                    ctx.beginPath();
                    ctx.arc(x, y + bandHeight/2, pointSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add time indicator for significant layers
                    if (index % 10 === 0) {
                        const timeX = width - 40;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'right';
                        ctx.fillText(`T-${index}`, timeX, y + bandHeight - 1);
                    }
                    return;
                    
                case 'brickwork':
                    // Brickwork pattern - alternating rows with offset
                    const rowHeight = height / (visibleLayers.length + 1);
                    const rowOffset = (index % 2) * (width / 4);
                    y = index * rowHeight;
                    break;
                    
                default:
                    // Standard mode - layers stacked from bottom to top
                    const normalizedSpacing = layerSpacing / 100;
                    y = height - ((index + 1) * (height / (layersToDisplay + normalizedSpacing * 10)));
            }
            
            // Apply blur effect
            const blurAmount = layerBlur * 2;
            if (blurAmount > 0) {
                ctx.shadowBlur = blurAmount;
                ctx.shadowColor = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.5)`;
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw the layer
            if (layer.data && layer.data.imageData) {
                // Draw the layer data
                ctx.putImageData(layer.data.imageData, x, y);
            } else if (layer.data && layer.data.width) {
                // Draw a rectangle for the layer
                ctx.fillStyle = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.8)`;
                ctx.fillRect(x, y, layer.data.width, 1);
            }
            
            // Highlight current layer if it's the most recent and highlighting is enabled
            if (highlightCurrent && index === visibleLayers.length - 1) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(x + (layer.data ? layer.data.width : 10) / 2, y, 8, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Reset composite operation and shadow
        ctx.globalCompositeOperation = originalCompositeOperation;
        ctx.shadowBlur = 0;
    }
    
    renderWireframe(ctx, width, height, options = {}) {
        // Extract options with defaults
        const tidalFactor = options.tidalFactor !== undefined ? options.tidalFactor : 50;
        const waveEnergy = options.waveEnergy !== undefined ? options.waveEnergy : 50;
        const showWavePattern = options.showWavePattern !== undefined ? options.showWavePattern : false;
        const maxLayers = options.maxLayers !== undefined ? options.maxLayers : this.options.maxLayers;
        const highlightCurrent = options.highlightCurrent !== undefined ? options.highlightCurrent : true;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const layerSpacing = options.layerSpacing !== undefined ? options.layerSpacing : this.options.layerSpacing;
        const layerOffset = options.layerOffset !== undefined ? options.layerOffset : this.options.layerOffset;
        const layerDistortion = options.layerDistortion !== undefined ? options.layerDistortion : this.options.layerDistortion;
        const layerBlur = options.layerBlur !== undefined ? options.layerBlur : this.options.layerBlur;
        
        // HSV color controls
        const baseHue = options.baseHue !== undefined ? options.baseHue : 0;
        const saturation = options.saturation !== undefined ? options.saturation : 100;
        const value = options.value !== undefined ? options.value : 100;
        const hueShift = options.hueShift !== undefined ? options.hueShift : 0;
        const hueShiftMode = options.hueShiftMode || 'fixed';
        
        // Calculate wave phase
        const now = Date.now();
        const wavePhase = (now % 10000) / 10000;
        this.wavePhase = wavePhase * Math.PI * 2;
        
        // Calculate tidal cycle
        const tidalCycle = Math.sin(now / 10000 * Math.PI * 2) * 0.5 + 0.5;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            // Draw a wave pattern background
            ctx.save();
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 30, 60, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 10, 30, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw wave lines
            const waveCount = 5 + Math.floor(waveEnergy / 20);
            const waveAmplitude = 5 + (waveEnergy / 10);
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < waveCount; i++) {
                const yPos = (height / (waveCount + 1)) * (i + 1);
                const phaseOffset = i * 0.2;
                
                ctx.beginPath();
                for (let x = 0; x < width; x += 5) {
                    const y = yPos + Math.sin(this.wavePhase + phaseOffset + (x * 0.01)) * waveAmplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // If no layers, return
        if (this.layers.length === 0) {
            return;
        }
        
        // Calculate the number of layers to display
        const layersToDisplay = Math.min(maxLayers, this.layers.length);
        
        // Sort layers based on layering mode
        let sortedLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                sortedLayers.reverse();
                break;
                
            case 'random':
                sortedLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                sortedLayers.sort((a, b) => a.motionIntensity - b.motionIntensity);
                break;
                
            // Other modes use default sorting
        }
        
        // Get the layers to display
        const visibleLayers = sortedLayers.slice(-layersToDisplay);
        
        // Set composite operation based on blend mode
        const originalCompositeOperation = ctx.globalCompositeOperation;
        switch (blendMode) {
            case 'multiply':
                ctx.globalCompositeOperation = 'multiply';
                break;
            case 'screen':
                ctx.globalCompositeOperation = 'screen';
                break;
            case 'overlay':
                ctx.globalCompositeOperation = 'overlay';
                break;
            case 'lighten':
                ctx.globalCompositeOperation = 'lighten';
                break;
            case 'color-dodge':
                ctx.globalCompositeOperation = 'color-dodge';
                break;
            case 'soft-light':
                ctx.globalCompositeOperation = 'soft-light';
                break;
            default:
                ctx.globalCompositeOperation = 'source-over';
        }
        
        // Draw grid for reference
        ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
        ctx.lineWidth = 0.5;
        
        // Vertical grid lines
        for (let x = 0; x < width; x += width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let y = 0; y < height; y += height / 10) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw wireframe for each layer
        visibleLayers.forEach((layer, index) => {
            // Calculate normalized position in the canvas (0-1)
            const layerPosition = layer.position / 100;
            
            // Calculate wave effect
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layerPosition * 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            // Apply wave displacement and layer offset
            const normalizedOffset = layerOffset / 100;
            const offsetX = width * normalizedOffset;
            
            // Apply layer distortion
            const distortionFactor = layerDistortion / 100;
            const distortion = Math.sin(layerPosition * Math.PI * 2) * distortionFactor * 20;
            
            // Calculate x position with all effects
            const x = Math.floor(width * layerPosition) + 
                    (layer.waveDisplacement || 0) + 
                    (showWavePattern ? waveEffect : 0) + 
                    offsetX + 
                    distortion;
            
            // Calculate y position based on layering mode
            let y;
            
            // Calculate intensity based on motion
            const intensity = layer.motionIntensity ? layer.motionIntensity / 255 : 0.5;
            
            // Calculate hue based on shift mode
            let finalHue = baseHue;
            
            switch (hueShiftMode) {
                case 'layer':
                    // Shift hue based on layer position
                    finalHue = (baseHue + (index / visibleLayers.length) * hueShift) % 360;
                    break;
                    
                case 'time':
                    // Shift hue based on time
                    const timeNormalized = (Date.now() % 10000) / 10000;
                    finalHue = (baseHue + timeNormalized * hueShift) % 360;
                    break;
                    
                case 'fixed':
                default:
                    // Use base hue
                    finalHue = baseHue;
            }
            
            // Convert HSV to RGB for the wireframe color
            const wireColor = this.hsvToRgb(
                finalHue / 360,
                saturation / 100,
                value / 100
            );
            
            switch (layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    y = height - ((index + 1) * (height / (visibleLayers.length + 1)));
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    y = height / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((index / visibleLayers.length) * Math.PI * 2 + this.wavePhase);
                    y = height * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'stratigraphy':
                    // Maximize data-to-ink ratio with high-information visualization
                    const bandHeight = 2 + (layerSpacing / 5);
                    y = height - 30 - (index * bandHeight);
                    
                    // Skip if outside visible area
                    if (y < 0 || y > height) return;
                    
                    // Draw wireframe band
                    ctx.strokeStyle = `rgba(${wireColor.r}, ${wireColor.g}, ${wireColor.b}, 0.7)`;
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                    
                    // Add wireframe point
                    const pointSize = 3;
                    ctx.beginPath();
                    ctx.arc(x, y, pointSize, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Add time indicator for significant layers
                    if (index % 10 === 0) {
                        const timeX = width - 40;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'right';
                        ctx.fillText(`T-${index}`, timeX, y + bandHeight - 1);
                    }
                    return;
                    
                case 'brickwork':
                    // Brickwork pattern - alternating rows with offset
                    const rowHeight = height / (visibleLayers.length + 1);
                    const rowOffset = (index % 2) * (width / 4);
                    y = index * rowHeight;
                    break;
                    
                default:
                    // Standard mode - layers stacked from bottom to top
                    const normalizedSpacing = layerSpacing / 100;
                    y = height - ((index + 1) * (height / (layersToDisplay + normalizedSpacing * 10)));
            }
            
            // Apply blur effect
            const blurAmount = layerBlur * 2;
            if (blurAmount > 0) {
                ctx.shadowBlur = blurAmount;
                ctx.shadowColor = `rgba(${wireColor.r}, ${wireColor.g}, ${wireColor.b}, 0.5)`;
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw the wireframe
            ctx.strokeStyle = `rgba(${wireColor.r}, ${wireColor.g}, ${wireColor.b}, 0.8)`;
            ctx.lineWidth = 1;
            
            // Draw horizontal line
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + (layer.data ? layer.data.width : 10), y);
            ctx.stroke();
            
            // Draw vertical lines at endpoints
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x + (layer.data ? layer.data.width : 10), y - 5);
            ctx.lineTo(x + (layer.data ? layer.data.width : 10), y + 5);
            ctx.stroke();
            
            // Draw motion intensity indicator
            if (layer.motionIntensity) {
                const normalizedIntensity = layer.motionIntensity / 255;
                const intensityHeight = normalizedIntensity * 20;
                
                ctx.beginPath();
                ctx.moveTo(x + (layer.data ? layer.data.width : 10) / 2, y);
                ctx.lineTo(x + (layer.data ? layer.data.width : 10) / 2, y - intensityHeight);
                ctx.stroke();
                
                // Add a point at the top of the intensity line
                ctx.beginPath();
                ctx.arc(x + (layer.data ? layer.data.width : 10) / 2, y - intensityHeight, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Highlight current layer if it's the most recent and highlighting is enabled
            if (highlightCurrent && index === visibleLayers.length - 1) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(x + (layer.data ? layer.data.width : 10) / 2, y, 8, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Reset composite operation and shadow
        ctx.globalCompositeOperation = originalCompositeOperation;
        ctx.shadowBlur = 0;
    }
    
    renderNormal(ctx, width, height, options = {}) {
        // Extract options with defaults
        const tidalFactor = options.tidalFactor !== undefined ? options.tidalFactor : 50;
        const waveEnergy = options.waveEnergy !== undefined ? options.waveEnergy : 50;
        const showWavePattern = options.showWavePattern !== undefined ? options.showWavePattern : false;
        const maxLayers = options.maxLayers !== undefined ? options.maxLayers : this.options.maxLayers;
        const highlightCurrent = options.highlightCurrent !== undefined ? options.highlightCurrent : true;
        const layeringMode = options.layeringMode || this.options.layeringMode;
        const blendMode = options.blendMode || this.options.blendMode;
        const layerSpacing = options.layerSpacing !== undefined ? options.layerSpacing : this.options.layerSpacing;
        const layerOffset = options.layerOffset !== undefined ? options.layerOffset : this.options.layerOffset;
        const layerDistortion = options.layerDistortion !== undefined ? options.layerDistortion : this.options.layerDistortion;
        const layerBlur = options.layerBlur !== undefined ? options.layerBlur : this.options.layerBlur;
        
        // HSV color controls
        const baseHue = options.baseHue !== undefined ? options.baseHue : 0;
        const saturation = options.saturation !== undefined ? options.saturation : 100;
        const value = options.value !== undefined ? options.value : 100;
        const hueShift = options.hueShift !== undefined ? options.hueShift : 0;
        const hueShiftMode = options.hueShiftMode || 'fixed';
        
        // Calculate wave phase
        const now = Date.now();
        const wavePhase = (now % 10000) / 10000;
        this.wavePhase = wavePhase * Math.PI * 2;
        
        // Calculate tidal cycle
        const tidalCycle = Math.sin(now / 10000 * Math.PI * 2) * 0.5 + 0.5;
        
        // Clear the canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill with background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            // Draw a wave pattern background
            ctx.save();
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, 'rgba(0, 30, 60, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 10, 30, 0.3)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Draw wave lines
            const waveCount = 5 + Math.floor(waveEnergy / 20);
            const waveAmplitude = 5 + (waveEnergy / 10);
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < waveCount; i++) {
                const yPos = (height / (waveCount + 1)) * (i + 1);
                const phaseOffset = i * 0.2;
                
                ctx.beginPath();
                for (let x = 0; x < width; x += 5) {
                    const y = yPos + Math.sin(this.wavePhase + phaseOffset + (x * 0.01)) * waveAmplitude;
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        // If no layers, return
        if (this.layers.length === 0) {
            return;
        }
        
        // Calculate the number of layers to display
        const layersToDisplay = Math.min(maxLayers, this.layers.length);
        
        // Sort layers based on layering mode
        let sortedLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                sortedLayers.reverse();
                break;
                
            case 'random':
                sortedLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                sortedLayers.sort((a, b) => a.motionIntensity - b.motionIntensity);
                break;
                
            // Other modes use default sorting
        }
        
        // Get the layers to display
        const visibleLayers = sortedLayers.slice(-layersToDisplay);
        
        // Set composite operation based on blend mode
        const originalCompositeOperation = ctx.globalCompositeOperation;
        switch (blendMode) {
            case 'multiply':
                ctx.globalCompositeOperation = 'multiply';
                break;
            case 'screen':
                ctx.globalCompositeOperation = 'screen';
                break;
            case 'overlay':
                ctx.globalCompositeOperation = 'overlay';
                break;
            case 'lighten':
                ctx.globalCompositeOperation = 'lighten';
                break;
            case 'color-dodge':
                ctx.globalCompositeOperation = 'color-dodge';
                break;
            case 'soft-light':
                ctx.globalCompositeOperation = 'soft-light';
                break;
            default:
                ctx.globalCompositeOperation = 'source-over';
        }
        
        // Special handling for stratigraphy mode
        if (layeringMode === 'stratigraphy') {
            // Draw minimal reference grid
            ctx.drawImage(this.stratigraphyPattern, 0, 0, width, height);
            
            // Add data visualization frame
            ctx.strokeStyle = 'rgba(255, 60, 30, 0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 10, width - 20, height - 20);
            
            // Add time indicator at bottom
            const indicatorWidth = 100;
            const indicatorHeight = 20;
            ctx.fillStyle = 'rgba(255, 60, 30, 0.9)';
            ctx.fillRect(width/2 - indicatorWidth/2, height - indicatorHeight - 5, indicatorWidth, indicatorHeight);
            
            // Add text label for clarity
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('SEDIMENT STRATIGRAPHY', width/2, height - 10);
        }
        
        // Special handling for brickwork mode
        if (layeringMode === 'brickwork') {
            // Create pattern from brick canvas
            const brickPattern = ctx.createPattern(this.brickPattern, 'repeat');
            ctx.fillStyle = brickPattern;
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, width, height);
            ctx.globalAlpha = 1.0;
        }
        
        // Draw each layer
        visibleLayers.forEach((layer, index) => {
            // Calculate normalized position in the canvas (0-1)
            const layerPosition = layer.position / 100;
            
            // Calculate wave effect
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layerPosition * 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            // Apply wave displacement and layer offset
            const normalizedOffset = layerOffset / 100;
            const offsetX = width * normalizedOffset;
            
            // Apply layer distortion
            const distortionFactor = layerDistortion / 100;
            const distortion = Math.sin(layerPosition * Math.PI * 2) * distortionFactor * 20;
            
            // Calculate x position with all effects
            const x = Math.floor(width * layerPosition) + 
                    (layer.waveDisplacement || 0) + 
                    (showWavePattern ? waveEffect : 0) + 
                    offsetX + 
                    distortion;
            
            // Calculate y position based on layering mode
            let y;
            
            // Calculate hue based on shift mode
            let finalHue = baseHue;
            
            switch (hueShiftMode) {
                case 'layer':
                    // Shift hue based on layer position
                    finalHue = (baseHue + (index / visibleLayers.length) * hueShift) % 360;
                    break;
                    
                case 'time':
                    // Shift hue based on time
                    const timeNormalized = (Date.now() % 10000) / 10000;
                    finalHue = (baseHue + timeNormalized * hueShift) % 360;
                    break;
                    
                case 'fixed':
                default:
                    // Use base hue
                    finalHue = baseHue;
            }
            
            // Convert HSV to RGB for the layer color
            const layerColor = this.hsvToRgb(
                finalHue / 360,
                saturation / 100,
                value / 100
            );
            
            switch (layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    y = height - ((index + 1) * (height / (visibleLayers.length + 1)));
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    y = height / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((index / visibleLayers.length) * Math.PI * 2 + this.wavePhase);
                    y = height * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'stratigraphy':
                    // Maximize data-to-ink ratio with high-information visualization
                    const bandHeight = 2 + (layerSpacing / 5);
                    y = height - 30 - (index * bandHeight);
                    
                    // Skip if outside visible area
                    if (y < 0 || y > height) return;
                    
                    // Draw sediment band
                    ctx.fillStyle = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.7)`;
                    ctx.fillRect(0, y, width, bandHeight);
                    
                    // Add sediment point
                    const pointSize = 3;
                    ctx.beginPath();
                    ctx.arc(x, y + bandHeight/2, pointSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Add time indicator for significant layers
                    if (index % 10 === 0) {
                        const timeX = width - 40;
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.font = '8px monospace';
                        ctx.textAlign = 'right';
                        ctx.fillText(`T-${index}`, timeX, y + bandHeight - 1);
                    }
                    return;
                    
                case 'brickwork':
                    // Brickwork pattern - alternating rows with offset
                    const rowHeight = height / (visibleLayers.length + 1);
                    const rowOffset = (index % 2) * (width / 4);
                    y = index * rowHeight;
                    break;
                    
                default:
                    // Standard mode - layers stacked from bottom to top
                    const normalizedSpacing = layerSpacing / 100;
                    y = height - ((index + 1) * (height / (layersToDisplay + normalizedSpacing * 10)));
            }
            
            // Apply blur effect
            const blurAmount = layerBlur * 2;
            if (blurAmount > 0) {
                ctx.shadowBlur = blurAmount;
                ctx.shadowColor = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.5)`;
            } else {
                ctx.shadowBlur = 0;
            }
            
            // Draw the layer with the original image data
            if (layer.data && layer.data.imageData) {
                // Draw the layer data
                ctx.putImageData(layer.data.imageData, x, y);
            } else if (layer.data && layer.data.width) {
                // Draw a rectangle for the layer
                ctx.fillStyle = `rgba(${layerColor.r}, ${layerColor.g}, ${layerColor.b}, 0.8)`;
                ctx.fillRect(x, y, layer.data.width, 1);
            }
            
            // Highlight current layer if it's the most recent and highlighting is enabled
            if (highlightCurrent && index === visibleLayers.length - 1) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(x + (layer.data ? layer.data.width : 10) / 2, y, 8, 0, Math.PI * 2);
                ctx.stroke();
            }
        });
        
        // Reset composite operation and shadow
        ctx.globalCompositeOperation = originalCompositeOperation;
        ctx.shadowBlur = 0;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdobeKillerProcessor;
}
