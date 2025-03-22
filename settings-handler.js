/**
 * Adobe Killer Slit-Scan Camera
 * Settings handler module
 */

document.addEventListener('DOMContentLoaded', () => {
    // Connect the settings buttons to their functions
    const exportSettingsButton = document.getElementById('exportSettingsButton');
    const importSettingsButton = document.getElementById('importSettingsButton');
    const exportButton = document.getElementById('exportButton');
    
    if (exportSettingsButton) {
        exportSettingsButton.addEventListener('click', exportSettings);
    }
    
    if (importSettingsButton) {
        importSettingsButton.addEventListener('click', importSettings);
    }
    
    if (exportButton) {
        exportButton.addEventListener('click', exportPNG);
    }
    
    // Export current settings to JSON file
    function exportSettings() {
        // Get all slider elements
        const slitWidthSlider = document.getElementById('slitWidth');
        const scanSpeedSlider = document.getElementById('scanSpeed');
        const tidalFactorSlider = document.getElementById('tidalFactor');
        const waveEnergySlider = document.getElementById('waveEnergy');
        const erosionThresholdSlider = document.getElementById('erosionThreshold');
        const compactionRateSlider = document.getElementById('compactionRate');
        const organicFactorSlider = document.getElementById('organicFactor');
        const layerOpacitySlider = document.getElementById('layerOpacity');
        const layerSpacingSlider = document.getElementById('layerSpacing');
        const layerOffsetSlider = document.getElementById('layerOffset');
        const layerDistortionSlider = document.getElementById('layerDistortion');
        const colorShiftSlider = document.getElementById('colorShift');
        
        // Collect all current settings
        const settings = {
            slitWidth: slitWidthSlider ? slitWidthSlider.value : null,
            scanSpeed: scanSpeedSlider ? scanSpeedSlider.value : null,
            tidalFactor: tidalFactorSlider ? tidalFactorSlider.value : null,
            waveEnergy: waveEnergySlider ? waveEnergySlider.value : null,
            erosionThreshold: erosionThresholdSlider ? erosionThresholdSlider.value : null,
            compactionRate: compactionRateSlider ? compactionRateSlider.value : null,
            organicFactor: organicFactorSlider ? organicFactorSlider.value : null,
            layeringMode: document.getElementById('layeringMode') ? document.getElementById('layeringMode').value : null,
            blendMode: document.getElementById('blendMode') ? document.getElementById('blendMode').value : null,
            colorShift: colorShiftSlider ? colorShiftSlider.value : null,
            layerOpacity: layerOpacitySlider ? layerOpacitySlider.value : null,
            layerSpacing: layerSpacingSlider ? layerSpacingSlider.value : null,
            layerOffset: layerOffsetSlider ? layerOffsetSlider.value : null,
            layerDistortion: layerDistortionSlider ? layerDistortionSlider.value : null,
            layerBlur: document.getElementById('layerBlur') ? document.getElementById('layerBlur').value : null,
            maxLayers: document.getElementById('maxLayers') ? document.getElementById('maxLayers').value : null,
            highlightCurrent: document.getElementById('highlightCurrentCheckbox') ? document.getElementById('highlightCurrentCheckbox').checked : null,
            showWavePattern: document.getElementById('wavePatternToggle') ? document.getElementById('wavePatternToggle').checked : null,
            timestamp: Date.now()
        };
        
        // Create JSON file for download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute("href", dataStr);
        downloadLink.setAttribute("download", `adobe-killer-settings-${Date.now()}.json`);
        downloadLink.click();
        
        console.log("Settings exported:", settings);
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
                    console.log("Imported settings:", settings);
                    
                    // Apply all settings to UI elements
                    updateSliderValue('slitWidth', settings.slitWidth);
                    updateSliderValue('scanSpeed', settings.scanSpeed);
                    updateSliderValue('tidalFactor', settings.tidalFactor);
                    updateSliderValue('waveEnergy', settings.waveEnergy);
                    updateSliderValue('erosionThreshold', settings.erosionThreshold);
                    updateSliderValue('compactionRate', settings.compactionRate);
                    updateSliderValue('organicFactor', settings.organicFactor);
                    updateSelectValue('layeringMode', settings.layeringMode);
                    updateSelectValue('blendMode', settings.blendMode);
                    updateSliderValue('colorShift', settings.colorShift);
                    updateSliderValue('layerOpacity', settings.layerOpacity);
                    updateSliderValue('layerSpacing', settings.layerSpacing);
                    updateSliderValue('layerOffset', settings.layerOffset);
                    updateSliderValue('layerDistortion', settings.layerDistortion);
                    updateSliderValue('layerBlur', settings.layerBlur);
                    updateSliderValue('maxLayers', settings.maxLayers);
                    updateCheckboxValue('highlightCurrentCheckbox', settings.highlightCurrent);
                    updateCheckboxValue('wavePatternToggle', settings.showWavePattern);
                    
                    alert('Settings loaded successfully!');
                } catch (error) {
                    console.error("Error loading settings:", error);
                    alert('Error loading settings: ' + error.message);
                }
            };
        };
        
        input.click();
    }
    
    // Helper function to update slider values
    function updateSliderValue(id, value) {
        if (value === null || value === undefined) return;
        
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(id + 'Value');
        
        if (slider) {
            slider.value = value;
            // Trigger any event listeners
            const event = new Event('input', { bubbles: true });
            slider.dispatchEvent(event);
        }
        
        if (valueDisplay) {
            valueDisplay.textContent = value;
        }
    }
    
    // Helper function to update select values
    function updateSelectValue(id, value) {
        if (value === null || value === undefined) return;
        
        const select = document.getElementById(id);
        if (select) {
            select.value = value;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
        }
    }
    
    // Helper function to update checkbox values
    function updateCheckboxValue(id, value) {
        if (value === null || value === undefined) return;
        
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = value;
            // Trigger change event
            const event = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(event);
        }
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
            console.error("Error exporting PNG:", error);
            alert("Error exporting image: " + error.message);
        }
    }
});
