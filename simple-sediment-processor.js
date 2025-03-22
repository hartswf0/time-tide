/**
 * Simple Sediment Processor
 * A simplified version of the sediment processor for the slit-scan camera
 * with enhanced visualization features inspired by wave patterns and erosion
 */

class SimpleSedimentProcessor {
    constructor(options = {}) {
        // Default options
        this.options = {
            maxLayers: 300,
            waveAmplitude: 5,
            waveFrequency: 0.02,
            erosionFactor: 0.01,
            compactionRate: 0.01,
            layeringMode: 'standard', // standard, overlap, stacked, random
            ...options
        };
        
        // Initialize state
        this.layers = [];
        this.tidalCycle = 0;
        this.lastTimestamp = 0;
        this.wavePhase = 0;
        this.erosionMap = new Map(); // Store erosion data by position
    }
    
    /**
     * Process a new slit from the camera feed
     * @param {ImageData} slitData - The image data for the current slit
     * @param {number} position - Position of the slit (0-100)
     * @param {number} timestamp - Current timestamp
     * @param {Object} params - Additional parameters (tidalFactor, waveEnergy, etc.)
     * @returns {Object} Processed sediment data
     */
    processSlit(slitData, position, timestamp, params = {}) {
        // Extract parameters with defaults
        const { 
            tidalFactor = 50, 
            waveEnergy = 70,
            erosionThreshold = 10,
            compactionRate = 10,
            layeringMode = this.options.layeringMode
        } = params;
        
        // Calculate time difference
        const timeDelta = this.lastTimestamp ? timestamp - this.lastTimestamp : 0;
        this.lastTimestamp = timestamp;
        
        // Update tidal cycle (0-2π)
        this.tidalCycle = (this.tidalCycle + (timeDelta * 0.0001 * (tidalFactor / 50))) % (Math.PI * 2);
        
        // Calculate wave effect
        const normalizedTidalFactor = tidalFactor / 100;
        const normalizedWaveEnergy = waveEnergy / 100;
        
        // Calculate wave displacement
        const waveDisplacement = Math.sin(this.tidalCycle) * 
                                this.options.waveAmplitude * 
                                normalizedTidalFactor * 
                                normalizedWaveEnergy;
        
        // Analyze motion in the slit
        const motionData = this.analyzeMotion(slitData);
        
        // Create new sediment layer with enhanced properties
        const newLayer = {
            data: slitData,
            position,
            timestamp,
            age: 0,
            waveDisplacement,
            motionIntensity: motionData.intensity,
            erosionFactor: (motionData.intensity / 255) * (erosionThreshold / 25),
            compaction: 1.0, // Will decrease over time based on compaction rate
            color: this.calculateLayerColor(motionData.intensity, tidalFactor, waveEnergy),
            layeringMode
        };
        
        // Add to layers array
        this.layers.push(newLayer);
        
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
            layeringMode
        };
    }
    
    /**
     * Analyze motion in the slit data
     * @param {ImageData} slitData - The image data for the current slit
     * @returns {Object} Motion analysis data
     */
    analyzeMotion(slitData) {
        // Simple motion analysis - average pixel brightness change
        const data = slitData.data;
        let totalIntensity = 0;
        
        // Sample pixels to calculate average intensity
        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Calculate grayscale value
            const intensity = (r + g + b) / 3;
            totalIntensity += intensity;
        }
        
        // Calculate average intensity (0-255)
        const avgIntensity = totalIntensity / (data.length / 16);
        
        return {
            intensity: avgIntensity,
            threshold: avgIntensity > 100 // Simple threshold for motion detection
        };
    }
    
    /**
     * Calculate layer color based on motion intensity and other factors
     * @param {number} intensity - Motion intensity
     * @param {number} tidalFactor - Tidal factor (0-100)
     * @param {number} waveEnergy - Wave energy (0-100)
     * @returns {string} CSS color string
     */
    calculateLayerColor(intensity, tidalFactor, waveEnergy) {
        // Normalize factors
        const normalizedTidal = tidalFactor / 100;
        const normalizedWave = waveEnergy / 100;
        
        // Base color components
        const r = Math.floor(intensity * 0.7);
        const g = Math.floor(intensity * 0.5 + (normalizedTidal * 50));
        const b = Math.floor(intensity * 0.3 + (normalizedWave * 100));
        
        // Return RGBA color with alpha based on intensity
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
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
        }
        
        // Limit number of layers
        if (this.layers.length > this.options.maxLayers) {
            this.layers.shift();
        }
    }
    
    /**
     * Render layers to a canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas context to render to
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} params - Rendering parameters
     */
    renderLayers(ctx, width, height, params = {}) {
        const { 
            showWireframe = false, 
            highlightCurrent = true,
            tidalFactor = 50,
            waveEnergy = 70,
            showWavePattern = false,
            layeringMode = 'standard'
        } = params;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw wave pattern background if enabled
        if (showWavePattern) {
            this.drawWavePattern(ctx, width, height, tidalFactor, waveEnergy);
        }
        
        // Sort layers based on layering mode
        let renderLayers = [...this.layers];
        
        switch (layeringMode) {
            case 'reverse':
                // Newest layers on bottom, oldest on top
                renderLayers.reverse();
                break;
                
            case 'random':
                // Random ordering of layers
                renderLayers.sort(() => Math.random() - 0.5);
                break;
                
            case 'intensity':
                // Sort by motion intensity (highest first)
                renderLayers.sort((a, b) => (b.motionIntensity || 0) - (a.motionIntensity || 0));
                break;
                
            // standard - keep original order (oldest first, newest last)
            default:
                break;
        }
        
        // Draw each layer
        for (let i = 0; i < renderLayers.length; i++) {
            const layer = renderLayers[i];
            const isNewest = layer === this.layers[this.layers.length - 1];
            
            // Calculate position in pixels with wave displacement
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layer.position / 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            const x = Math.floor((width * layer.position) / 100) + 
                     (layer.waveDisplacement || 0) + 
                     (showWavePattern ? waveEffect : 0);
            
            // Calculate layer height based on compaction
            const layerHeight = height * layer.compaction;
            
            // Calculate y position based on layering mode
            let yOffset;
            
            switch (layer.layeringMode || layeringMode) {
                case 'stacked':
                    // Stack layers from bottom to top
                    yOffset = height - layerHeight - (i * 2); // Small overlap
                    break;
                    
                case 'overlap':
                    // Layers overlap in center
                    yOffset = (height - layerHeight) / 2;
                    break;
                    
                case 'wave':
                    // Wave pattern for layer positions
                    const wavePos = Math.sin((i / renderLayers.length) * Math.PI * 2 + this.wavePhase);
                    yOffset = (height - layerHeight) * (0.5 + wavePos * 0.3);
                    break;
                    
                case 'standard':
                default:
                    // Standard - layers grow from bottom
                    yOffset = height - layerHeight;
                    break;
            }
            
            // Create temporary canvas for the slit
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = layer.data.width;
            tempCanvas.height = layer.data.height;
            tempCtx.putImageData(layer.data, 0, 0);
            
            // Apply erosion effect
            if (layer.erosionFactor > 0) {
                // Simple erosion - make the layer slightly transparent based on erosion factor
                ctx.globalAlpha = Math.max(0.2, 1 - (layer.erosionFactor * 2));
            } else {
                ctx.globalAlpha = 1.0;
            }
            
            // Draw the slit image
            ctx.drawImage(
                tempCanvas, 
                0, 0, layer.data.width, layer.data.height,
                x, yOffset, Math.max(1, layer.data.width), layerHeight
            );
            
            // Reset global alpha
            ctx.globalAlpha = 1.0;
            
            // Highlight newest layer if requested
            if (isNewest && highlightCurrent) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, yOffset, Math.max(1, layer.data.width), layerHeight);
            }
            
            // Draw wireframe if requested
            if (showWireframe) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x, yOffset, Math.max(1, layer.data.width), layerHeight);
            }
        }
    }
    
    /**
     * Draw wave pattern background
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} tidalFactor - Tidal factor (0-100)
     * @param {number} waveEnergy - Wave energy (0-100)
     */
    drawWavePattern(ctx, width, height, tidalFactor, waveEnergy) {
        const normalizedTidal = tidalFactor / 100;
        const normalizedWave = waveEnergy / 100;
        
        // Draw wave background
        ctx.fillStyle = `rgba(0, 30, 60, ${normalizedTidal * 0.2})`;
        ctx.fillRect(0, 0, width, height);
        
        // Draw wave lines
        ctx.strokeStyle = `rgba(0, 100, 255, ${normalizedWave * 0.3})`;
        ctx.lineWidth = 1;
        
        const waveHeight = 20 * normalizedWave;
        const waveCount = 5;
        
        for (let i = 0; i < waveCount; i++) {
            const yPos = height - (height / (waveCount + 1)) * (i + 1);
            
            ctx.beginPath();
            
            // Draw wavy line
            for (let x = 0; x < width; x += 5) {
                const phase = this.wavePhase + (x / width) * Math.PI * 4;
                const y = yPos + Math.sin(phase) * waveHeight;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        }
    }
    
    /**
     * Render motion heatmap
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {Object} params - Rendering parameters
     */
    renderHeatmap(ctx, width, height, params = {}) {
        const { tidalFactor = 50, waveEnergy = 70 } = params;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Fill with background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        // If no layers, show message
        if (!this.layers || this.layers.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No sediment layers yet. Start capturing to generate layers.', 
                        width/2, height/2);
            return;
        }
        
        // Draw heatmap for each layer
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            
            // Calculate position with wave effect
            const normalizedTidal = tidalFactor / 100;
            const waveEffect = Math.sin(this.wavePhase + (layer.position / 10)) * 
                              this.options.waveAmplitude * normalizedTidal * (waveEnergy / 100);
            
            const x = Math.floor((width * layer.position) / 100) + 
                     (layer.waveDisplacement || 0) + waveEffect;
            
            // Calculate intensity-based color
            const intensity = layer.motionIntensity || 0;
            const normalizedIntensity = intensity / 255;
            
            // Create gradient color based on motion intensity
            const r = Math.floor(255 * normalizedIntensity);
            const g = Math.floor(100 * normalizedIntensity);
            const b = Math.floor(50 * (1 - normalizedIntensity));
            
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
            
            // Draw heat point with size based on intensity
            const size = Math.max(1, layer.data.width) + (normalizedIntensity * 5);
            ctx.beginPath();
            ctx.arc(x + (size/2), height/2, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add time-based erosion effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let x = 0; x < width; x += 20) {
            const noiseHeight = Math.random() * 20;
            ctx.fillRect(x, height - noiseHeight, 10, noiseHeight);
        }
    }
    
    /**
     * Set the layering mode for all future layers
     * @param {string} mode - Layering mode ('standard', 'overlap', 'stacked', 'wave', 'random', 'reverse', 'intensity')
     */
    setLayeringMode(mode) {
        this.options.layeringMode = mode;
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
            layeringMode: this.options.layeringMode
        };
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleSedimentProcessor;
}
