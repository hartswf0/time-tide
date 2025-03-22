/**
 * Adobe Killer Slit-Scan Camera
 * Main application script
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const video = document.getElementById('video');
    const sedimentCanvas = document.getElementById('sedimentCanvas');
    const ctx = sedimentCanvas.getContext('2d');
    const slitIndicator = document.getElementById('slitIndicator');
    
    // Buttons
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const exportButton = document.getElementById('exportButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const exportSettingsButton = document.getElementById('exportSettingsButton');
    const importSettingsButton = document.getElementById('importSettingsButton');
    
    // Camera selection
    const cameraSelect = document.getElementById('cameraSelect');
    
    // Sliders and values
    const slitWidthSlider = document.getElementById('slitWidth');
    const slitWidthValue = document.getElementById('slitWidthValue');
    const scanSpeedSlider = document.getElementById('scanSpeed');
    const scanSpeedValue = document.getElementById('scanSpeedValue');
    const tidalFactorSlider = document.getElementById('tidalFactor');
    const tidalFactorValue = document.getElementById('tidalFactorValue');
    const waveEnergySlider = document.getElementById('waveEnergy');
    const waveEnergyValue = document.getElementById('waveEnergyValue');
    const erosionThresholdSlider = document.getElementById('erosionThreshold');
    const erosionThresholdValue = document.getElementById('erosionThresholdValue');
    const compactionRateSlider = document.getElementById('compactionRate');
    const compactionRateValue = document.getElementById('compactionRateValue');
    const organicFactorSlider = document.getElementById('organicFactor');
    const organicFactorValue = document.getElementById('organicFactorValue');
    const colorShiftSlider = document.getElementById('colorShift');
    const colorShiftValue = document.getElementById('colorShiftValue');
    const layerOpacitySlider = document.getElementById('layerOpacity');
    const layerOpacityValue = document.getElementById('layerOpacityValue');
    const layerSpacingSlider = document.getElementById('layerSpacing');
    const layerSpacingValue = document.getElementById('layerSpacingValue');
    const layerOffsetSlider = document.getElementById('layerOffset');
    const layerOffsetValue = document.getElementById('layerOffsetValue');
    const layerDistortionSlider = document.getElementById('layerDistortion');
    const layerDistortionValue = document.getElementById('layerDistortionValue');
    const layerBlurSlider = document.getElementById('layerBlur');
    const layerBlurValue = document.getElementById('layerBlurValue');
    const maxLayersSlider = document.getElementById('maxLayers');
    const maxLayersValue = document.getElementById('maxLayersValue');
    
    // Selects
    const layeringModeSelect = document.getElementById('layeringMode');
    const blendModeSelect = document.getElementById('blendMode');
    const viewModeSelect = document.getElementById('viewMode');
    
    // Checkboxes
    const highlightCurrentCheckbox = document.getElementById('highlightCurrentCheckbox');
    const wavePatternToggle = document.getElementById('wavePatternToggle');
    
    // Heatmap color controls
    const baseHueSlider = document.getElementById('baseHueSlider');
    const baseHueValue = document.getElementById('baseHueValue');
    const saturationSlider = document.getElementById('saturationSlider');
    const saturationValue = document.getElementById('saturationValue');
    const valueSlider = document.getElementById('valueSlider');
    const valueValue = document.getElementById('valueValue');
    const hueShiftSlider = document.getElementById('hueShiftSlider');
    const hueShiftValue = document.getElementById('hueShiftValue');
    const hueShiftModeSelect = document.getElementById('hueShiftMode');
    const heatmapColorPanel = document.getElementById('heatmapColorPanel');
    
    // Stats elements
    const layerCountElement = document.getElementById('layerCount');
    const oldestLayerAgeElement = document.getElementById('oldestLayerAge');
    const averageMotionElement = document.getElementById('averageMotion');
    const wavePhaseElement = document.getElementById('wavePhase');
    const tidalCycleElement = document.getElementById('tidalCycle');
    const layeringModeDisplay = document.getElementById('layeringModeDisplay');
    const blendModeDisplay = document.getElementById('blendModeDisplay');
    const colorShiftDisplay = document.getElementById('colorShiftDisplay');
    
    // Application state
    let isCapturing = false;
    let slitPosition = 0;
    let highlightCurrent = true;
    let animationFrame;
    let stream;
    let availableCameras = [];
    let showWavePattern = false;
    let baseHue = 0;
    let saturation = 100;
    let value = 100;
    let hueShift = 0;
    let hueShiftMode = 'fixed';
    
    // Create sediment processor
    const sedimentProcessor = new AdobeKillerProcessor({
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
        layerSpacing: 20,
        layerOffset: 0,
        layerDistortion: 0,
        layerBlur: 0
    });
    
    // Initialize canvas
    function setupCanvas() {
        // Set canvas size
        const container = sedimentCanvas.parentElement;
        sedimentCanvas.width = container.clientWidth;
        sedimentCanvas.height = container.clientHeight;
    }
    
    // Enumerate available cameras
    async function enumerateCameras() {
        try {
            // Get list of available media devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            
            // Filter for video input devices
            availableCameras = devices.filter(device => device.kind === 'videoinput');
            
            // Clear existing options
            cameraSelect.innerHTML = '';
            
            // Add options for each camera
            if (availableCameras.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No cameras found';
                cameraSelect.appendChild(option);
                cameraSelect.disabled = true;
            } else {
                availableCameras.forEach(camera => {
                    const option = document.createElement('option');
                    option.value = camera.deviceId;
                    option.textContent = camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`;
                    cameraSelect.appendChild(option);
                });
                cameraSelect.disabled = false;
            }
        } catch (error) {
            console.error('Error enumerating cameras:', error);
        }
    }
    
    // Start camera capture
    async function startCapture() {
        try {
            console.log('Starting camera capture...');
            
            // Get selected camera ID
            const cameraId = cameraSelect.value;
            console.log('Selected camera ID:', cameraId || 'default');
            
            // Request camera access
            const constraints = {
                video: cameraId 
                    ? { deviceId: { exact: cameraId }, width: { ideal: 1280 }, height: { ideal: 720 } }
                    : { width: { ideal: 1280 }, height: { ideal: 720 } }
            };
            
            console.log('Camera constraints:', JSON.stringify(constraints));
            
            // Request camera access
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('Got camera stream, tracks:', stream.getVideoTracks().length);
            
            // Set video source
            video.srcObject = stream;
            
            // Wait for video to load metadata
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    console.log('Video metadata loaded, dimensions:', video.videoWidth, 'x', video.videoHeight);
                    resolve();
                };
            });
            
            // Start video playback
            await video.play();
            console.log('Video playback started');
            
            // Update UI
            isCapturing = true;
            startButton.disabled = true;
            stopButton.disabled = false;
            
            // Cancel any existing animation frame
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            
            // Start the capture loop
            console.log('Starting capture loop');
            animationFrame = requestAnimationFrame(captureLoop);
            
        } catch (error) {
            console.error('Error starting camera capture:', error);
            alert(`Failed to access camera: ${error.message}. Please ensure you have a camera connected and have granted permission.`);
        }
    }
    
    // Stop camera capture
    function stopCapture() {
        // Stop video stream
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            stream = null;
        }
        
        // Cancel animation
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        
        // Update UI
        isCapturing = false;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
    
    // Main capture loop
    function captureLoop() {
        if (isCapturing) {
            captureSlit();
            animationFrame = requestAnimationFrame(captureLoop);
        }
    }
    
    // Capture a single slit
    function captureSlit() {
        if (!isCapturing || !stream || !video.videoWidth) {
            console.log('Not ready to capture slit');
            return;
        }
        
        console.log('Capturing slit');
        
        // Create an offscreen canvas to process the video frame
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvas.width = video.videoWidth;
        offscreenCanvas.height = video.videoHeight;
        
        // Draw the current video frame to the offscreen canvas
        offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
        
        // Get current slit width
        const slitWidth = parseInt(slitWidthSlider.value);
        
        // Calculate slit position in pixels
        const slitX = Math.floor((offscreenCanvas.width - slitWidth) * (slitPosition / 100));
        
        // Extract the slit data
        const slitData = offscreenCtx.getImageData(slitX, 0, slitWidth, offscreenCanvas.height);
        
        // Update slit indicator position
        slitIndicator.style.left = `${slitPosition}%`;
        slitIndicator.style.width = `${slitWidth}px`;
        
        // Get current parameter values
        const tidalFactor = parseInt(tidalFactorSlider.value);
        const waveEnergy = parseInt(waveEnergySlider.value);
        const erosionThreshold = parseInt(erosionThresholdSlider.value);
        const compactionRate = parseInt(compactionRateSlider.value);
        const layeringMode = layeringModeSelect.value;
        const blendMode = blendModeSelect.value;
        const colorShift = parseInt(colorShiftSlider.value);
        const organicFactor = parseInt(organicFactorSlider.value);
        const layerOpacity = parseInt(layerOpacitySlider.value) / 100;
        const layerSpacing = parseInt(layerSpacingSlider.value);
        const layerOffset = parseInt(layerOffsetSlider.value);
        const layerDistortion = parseInt(layerDistortionSlider.value);
        const layerBlur = parseFloat(layerBlurSlider.value);
        
        // Process the slit with the sediment processor
        const processedData = sedimentProcessor.processSlit(
            slitData, 
            slitPosition, 
            Date.now(), 
            {
                tidalFactor,
                waveEnergy,
                erosionThreshold,
                compactionRate,
                layeringMode,
                blendMode,
                colorShift,
                organicFactor,
                layerOpacity,
                layerSpacing,
                layerOffset,
                layerDistortion,
                layerBlur,
                baseHue,
                saturation,
                value,
                hueShift,
                hueShiftMode
            }
        );
        
        // Move slit position for next frame
        const scanSpeed = parseInt(scanSpeedSlider.value);
        slitPosition = (slitPosition + scanSpeed / 10) % 100;
        
        // Render the sediment view
        renderSediment();
        
        // Update stats
        updateStats();
    }
    
    // Render sediment layers
    function renderSediment() {
        // Get current view mode
        const viewMode = viewModeSelect.value;
        
        // Get current parameter values
        const tidalFactor = parseInt(tidalFactorSlider.value);
        const waveEnergy = parseInt(waveEnergySlider.value);
        const layeringMode = layeringModeSelect.value;
        const blendMode = blendModeSelect.value;
        const layerSpacing = parseInt(layerSpacingSlider.value);
        const layerOffset = parseInt(layerOffsetSlider.value);
        const layerDistortion = parseInt(layerDistortionSlider.value);
        const layerBlur = parseFloat(layerBlurSlider.value);
        const maxLayers = parseInt(maxLayersSlider.value);
        
        // Update highlight current setting
        highlightCurrent = highlightCurrentCheckbox.checked;
        
        // Update the processor's maxLayers option
        if (sedimentProcessor && maxLayers) {
            sedimentProcessor.options.maxLayers = maxLayers;
        }
        
        // Clear canvas
        ctx.clearRect(0, 0, sedimentCanvas.width, sedimentCanvas.height);
        
        // Skip rendering if no processor
        if (!sedimentProcessor) return;
        
        // Render based on view mode
        if (viewMode === 'wireframe') {
            // Wireframe view
            sedimentProcessor.renderLayers(ctx, sedimentCanvas.width, sedimentCanvas.height, {
                showWireframe: true,
                highlightCurrent: highlightCurrent,
                tidalFactor: tidalFactor,
                waveEnergy: waveEnergy,
                showWavePattern: showWavePattern,
                layeringMode: layeringMode,
                blendMode: blendMode,
                layerSpacing: layerSpacing,
                layerOffset: layerOffset,
                layerDistortion: layerDistortion,
                layerBlur: layerBlur,
                baseHue: parseInt(baseHueSlider.value),
                saturation: parseInt(saturationSlider.value),
                value: parseInt(valueSlider.value),
                hueShift: parseInt(hueShiftSlider.value),
                hueShiftMode: hueShiftModeSelect.value
            });
        } else if (viewMode === 'heatmap') {
            // Heatmap view
            sedimentProcessor.renderHeatmap(ctx, sedimentCanvas.width, sedimentCanvas.height, {
                highlightCurrent: highlightCurrent,
                tidalFactor: tidalFactor,
                waveEnergy: waveEnergy,
                showWavePattern: showWavePattern,
                layeringMode: layeringMode,
                blendMode: blendMode,
                layerSpacing: layerSpacing,
                layerOffset: layerOffset,
                layerDistortion: layerDistortion,
                layerBlur: layerBlur,
                maxLayers: maxLayers,
                baseHue: parseInt(baseHueSlider.value),
                saturation: parseInt(saturationSlider.value),
                value: parseInt(valueSlider.value),
                hueShift: parseInt(hueShiftSlider.value),
                hueShiftMode: hueShiftModeSelect.value
            });
        } else {
            // Normal view
            sedimentProcessor.renderLayers(ctx, sedimentCanvas.width, sedimentCanvas.height, {
                highlightCurrent: highlightCurrent,
                tidalFactor: tidalFactor,
                waveEnergy: waveEnergy,
                showWavePattern: showWavePattern,
                layeringMode: layeringMode,
                blendMode: blendMode,
                layerSpacing: layerSpacing,
                layerOffset: layerOffset,
                layerDistortion: layerDistortion,
                layerBlur: layerBlur,
                baseHue: parseInt(baseHueSlider.value),
                saturation: parseInt(saturationSlider.value),
                value: parseInt(valueSlider.value),
                hueShift: parseInt(hueShiftSlider.value),
                hueShiftMode: hueShiftModeSelect.value
            });
        }
    }
    
    // Update statistics display
    function updateStats() {
        if (!sedimentProcessor.layers.length) return;
        
        // Calculate statistics
        const layerCount = sedimentProcessor.layers.length;
        const oldestLayer = sedimentProcessor.layers[0];
        const oldestLayerAge = Math.floor((Date.now() - oldestLayer.timestamp) / 1000);
        
        // Calculate average motion intensity
        const totalMotion = sedimentProcessor.layers.reduce((sum, layer) => sum + layer.motionIntensity, 0);
        const averageMotion = Math.round(totalMotion / layerCount);
        
        // Update display
        layerCountElement.textContent = layerCount;
        oldestLayerAgeElement.textContent = `${oldestLayerAge}s`;
        averageMotionElement.textContent = averageMotion;
        wavePhaseElement.textContent = Math.round(sedimentProcessor.wavePhase * 100) / 100;
        tidalCycleElement.textContent = Math.round(sedimentProcessor.tidalCycle * 100) / 100;
        
        // Update mode displays
        layeringModeDisplay.textContent = layeringModeSelect.value;
        blendModeDisplay.textContent = blendModeSelect.value;
        colorShiftDisplay.textContent = colorShiftSlider.value;
    }
    
    // Update UI values
    function updateUIValues() {
        slitWidthValue.textContent = slitWidthSlider.value;
        scanSpeedValue.textContent = scanSpeedSlider.value;
        tidalFactorValue.textContent = tidalFactorSlider.value;
        waveEnergyValue.textContent = waveEnergySlider.value;
        erosionThresholdValue.textContent = erosionThresholdSlider.value;
        compactionRateValue.textContent = compactionRateSlider.value;
        organicFactorValue.textContent = organicFactorSlider.value;
        colorShiftValue.textContent = colorShiftSlider.value;
        layerOpacityValue.textContent = layerOpacitySlider.value;
        layerSpacingValue.textContent = layerSpacingSlider.value;
        layerOffsetValue.textContent = layerOffsetSlider.value;
        layerDistortionValue.textContent = layerDistortionSlider.value;
        layerBlurValue.textContent = layerBlurSlider.value;
        maxLayersValue.textContent = maxLayersSlider.value;
        
        // Update heatmap color values
        baseHueValue.textContent = baseHueSlider.value;
        saturationValue.textContent = saturationSlider.value;
        valueValue.textContent = valueSlider.value;
        hueShiftValue.textContent = hueShiftSlider.value;
    }
    
    // Show/hide heatmap color controls based on view mode
    function updateHeatmapControlsVisibility() {
        heatmapColorPanel.style.display = 'block';
    }
    
    // Export data
    function exportData() {
        // Export directly as PNG without showing a dialog
        exportPNG();
    }
    
    // Export as PNG
    function exportPNG() {
        const canvas = document.getElementById('sedimentCanvas');
        if (!canvas) {
            alert("No canvas found to export!");
            return;
        }
        
        try {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `adobe-killer-${Date.now()}.png`;
            link.click();
        } catch (error) {
            alert("Error exporting image: " + error.message);
        }
    }
    
    // Export current settings to JSON file
    function exportSettings() {
        // Collect all current settings
        const settings = {
            slitWidth: slitWidthSlider.value,
            scanSpeed: scanSpeedSlider.value,
            tidalFactor: tidalFactorSlider.value,
            waveEnergy: waveEnergySlider.value,
            erosionThreshold: erosionThresholdSlider.value,
            compactionRate: compactionRateSlider.value,
            organicFactor: organicFactorSlider.value,
            layeringMode: document.getElementById('layeringMode').value,
            blendMode: document.getElementById('blendMode').value,
            colorShift: colorShiftSlider.value,
            layerOpacity: layerOpacitySlider.value,
            layerSpacing: layerSpacingSlider.value,
            layerOffset: layerOffsetSlider.value,
            layerDistortion: layerDistortionSlider.value,
            layerBlur: document.getElementById('layerBlur').value,
            maxLayers: maxLayersSlider.value,
            highlightCurrent: document.getElementById('highlightCurrentCheckbox').checked,
            showWavePattern: document.getElementById('wavePatternToggle').checked,
            baseHue: baseHueSlider.value,
            saturation: saturationSlider.value,
            value: valueSlider.value,
            hueShift: hueShiftSlider.value,
            hueShiftMode: hueShiftModeSelect.value,
            timestamp: Date.now()
        };
        
        // Create JSON file for download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute("href", dataStr);
        downloadLink.setAttribute("download", `adobe-killer-settings-${Date.now()}.json`);
        downloadLink.click();
    }
    
    // Import settings from JSON file
    function importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            
            reader.onload = readerEvent => {
                try {
                    const settings = JSON.parse(readerEvent.target.result);
                    
                    // Apply all settings to UI elements
                    if (settings.slitWidth) {
                        slitWidthSlider.value = settings.slitWidth;
                        slitWidthValue.textContent = settings.slitWidth;
                    }
                    
                    if (settings.scanSpeed) {
                        scanSpeedSlider.value = settings.scanSpeed;
                        scanSpeedValue.textContent = settings.scanSpeed;
                    }
                    
                    if (settings.tidalFactor) {
                        tidalFactorSlider.value = settings.tidalFactor;
                        tidalFactorValue.textContent = settings.tidalFactor;
                    }
                    
                    if (settings.waveEnergy) {
                        waveEnergySlider.value = settings.waveEnergy;
                        waveEnergyValue.textContent = settings.waveEnergy;
                    }
                    
                    if (settings.erosionThreshold) {
                        erosionThresholdSlider.value = settings.erosionThreshold;
                        erosionThresholdValue.textContent = settings.erosionThreshold;
                    }
                    
                    if (settings.compactionRate) {
                        compactionRateSlider.value = settings.compactionRate;
                        compactionRateValue.textContent = settings.compactionRate;
                    }
                    
                    if (settings.organicFactor) {
                        organicFactorSlider.value = settings.organicFactor;
                        organicFactorValue.textContent = settings.organicFactor;
                    }
                    
                    if (settings.layeringMode) {
                        document.getElementById('layeringMode').value = settings.layeringMode;
                    }
                    
                    if (settings.blendMode) {
                        document.getElementById('blendMode').value = settings.blendMode;
                    }
                    
                    if (settings.colorShift) {
                        colorShiftSlider.value = settings.colorShift;
                        colorShiftValue.textContent = settings.colorShift;
                    }
                    
                    if (settings.layerOpacity) {
                        layerOpacitySlider.value = settings.layerOpacity;
                        layerOpacityValue.textContent = settings.layerOpacity;
                    }
                    
                    if (settings.layerSpacing) {
                        layerSpacingSlider.value = settings.layerSpacing;
                        layerSpacingValue.textContent = settings.layerSpacing;
                    }
                    
                    if (settings.layerOffset) {
                        layerOffsetSlider.value = settings.layerOffset;
                        layerOffsetValue.textContent = settings.layerOffset;
                    }
                    
                    if (settings.layerDistortion) {
                        layerDistortionSlider.value = settings.layerDistortion;
                        layerDistortionValue.textContent = settings.layerDistortion;
                    }
                    
                    if (settings.layerBlur) {
                        document.getElementById('layerBlur').value = settings.layerBlur;
                        document.getElementById('layerBlurValue').textContent = settings.layerBlur;
                    }
                    
                    if (settings.maxLayers) {
                        maxLayersSlider.value = settings.maxLayers;
                        maxLayersValue.textContent = settings.maxLayers;
                    }
                    
                    if (settings.highlightCurrent !== undefined) {
                        document.getElementById('highlightCurrentCheckbox').checked = settings.highlightCurrent;
                    }
                    
                    if (settings.showWavePattern !== undefined) {
                        document.getElementById('wavePatternToggle').checked = settings.showWavePattern;
                    }
                    
                    if (settings.baseHue) {
                        baseHueSlider.value = settings.baseHue;
                        baseHueValue.textContent = settings.baseHue;
                    }
                    
                    if (settings.saturation) {
                        saturationSlider.value = settings.saturation;
                        saturationValue.textContent = settings.saturation;
                    }
                    
                    if (settings.value) {
                        valueSlider.value = settings.value;
                        valueValue.textContent = settings.value;
                    }
                    
                    if (settings.hueShift) {
                        hueShiftSlider.value = settings.hueShift;
                        hueShiftValue.textContent = settings.hueShift;
                    }
                    
                    if (settings.hueShiftMode) {
                        hueShiftModeSelect.value = settings.hueShiftMode;
                    }
                    
                    alert('Settings loaded successfully!');
                } catch (error) {
                    alert('Error loading settings: ' + error.message);
                }
            };
        };
        
        input.click();
    }
    
    // Toggle fullscreen mode
    function toggleFullscreen() {
        const container = document.getElementById('mainContainer');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Event listeners
    startButton.addEventListener('click', startCapture);
    stopButton.addEventListener('click', stopCapture);
    exportButton.addEventListener('click', exportData);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    exportSettingsButton.addEventListener('click', exportSettings);
    importSettingsButton.addEventListener('click', importSettings);
    
    // Checkbox event listeners
    wavePatternToggle.addEventListener('change', () => {
        showWavePattern = wavePatternToggle.checked;
        renderSediment();
    });
    highlightCurrentCheckbox.addEventListener('change', () => {
        highlightCurrent = highlightCurrentCheckbox.checked;
        renderSediment();
    });
    
    // Slider event listeners
    slitWidthSlider.addEventListener('input', updateUIValues);
    scanSpeedSlider.addEventListener('input', updateUIValues);
    tidalFactorSlider.addEventListener('input', updateUIValues);
    waveEnergySlider.addEventListener('input', updateUIValues);
    erosionThresholdSlider.addEventListener('input', updateUIValues);
    compactionRateSlider.addEventListener('input', updateUIValues);
    organicFactorSlider.addEventListener('input', updateUIValues);
    colorShiftSlider.addEventListener('input', updateUIValues);
    layerOpacitySlider.addEventListener('input', updateUIValues);
    layerSpacingSlider.addEventListener('input', updateUIValues);
    layerOffsetSlider.addEventListener('input', updateUIValues);
    layerDistortionSlider.addEventListener('input', updateUIValues);
    layerBlurSlider.addEventListener('input', updateUIValues);
    maxLayersSlider.addEventListener('input', updateUIValues);
    
    // Heatmap color control event listeners
    baseHueSlider.addEventListener('input', updateUIValues);
    saturationSlider.addEventListener('input', updateUIValues);
    valueSlider.addEventListener('input', updateUIValues);
    hueShiftSlider.addEventListener('input', updateUIValues);
    hueShiftModeSelect.addEventListener('change', renderSediment);
    
    // Select event listeners
    layeringModeSelect.addEventListener('change', renderSediment);
    blendModeSelect.addEventListener('change', renderSediment);
    viewModeSelect.addEventListener('change', () => {
        renderSediment();
        updateHeatmapControlsVisibility();
    });
    
    // Initialize
    setupCanvas();
    enumerateCameras();
    updateUIValues();
    updateHeatmapControlsVisibility();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setupCanvas();
        renderSediment();
    });
});
