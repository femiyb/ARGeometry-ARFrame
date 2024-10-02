// Object to store interaction analytics
const analytics = {
    shapesLoaded: {
        box: 0,
        sphere: 0,
        cylinder: 0,
    },
    interactions: {
        pinchResizes: 0,
        dragMoves: 0,
        voiceCommandsUsed: 0,
        shapesCleared: 0,
    },
    timestamps: [],
};

// Function to log the loading of shapes
function logShapeLoaded(shape) {
    if (analytics.shapesLoaded[shape] !== undefined) {
        analytics.shapesLoaded[shape] += 1;
        logTimestamp(`Loaded ${shape}`);
        saveAnalytics();
        console.log(`Shape loaded: ${shape}`);
    }
}

// Function to log pinch-to-resize interactions
function logPinchResize() {
    analytics.interactions.pinchResizes += 1;
    logTimestamp('Pinch resize');
    saveAnalytics();
    console.log('Pinch resize interaction logged');
}

// Function to log drag-to-move interactions
function logDragMove() {
    analytics.interactions.dragMoves += 1;
    logTimestamp('Drag move');
    saveAnalytics();
    console.log('Drag move interaction logged');
}

// Function to log voice command usage
function logVoiceCommand() {
    analytics.interactions.voiceCommandsUsed += 1;
    logTimestamp('Voice command used');
    saveAnalytics();
    console.log('Voice command interaction logged');
}

// Function to log shape clearing
function logShapesCleared() {
    analytics.interactions.shapesCleared += 1;
    logTimestamp('Shapes cleared');
    saveAnalytics();
    console.log('Shapes cleared interaction logged');
}

// Helper function to log events with a timestamp
function logTimestamp(action) {
    const timestamp = new Date().toLocaleString();
    analytics.timestamps.push(`${action} at ${timestamp}`);
}

// Function to save analytics data to local storage
function saveAnalytics() {
    localStorage.setItem('arAnalytics', JSON.stringify(analytics));
}

// Function to load analytics data from local storage
function loadAnalytics() {
    const savedData = localStorage.getItem('arAnalytics');
    if (savedData) {
        Object.assign(analytics, JSON.parse(savedData));
    }
}

// Function to clear analytics data
function clearAnalyticsData() {
    localStorage.removeItem('arAnalytics');
    Object.keys(analytics.shapesLoaded).forEach(key => analytics.shapesLoaded[key] = 0);
    Object.keys(analytics.interactions).forEach(key => analytics.interactions[key] = 0);
    analytics.timestamps = [];
    console.log('Analytics data cleared');
}

// Load analytics data on page load
document.addEventListener('DOMContentLoaded', loadAnalytics);

// Integrate logging into existing functions
// Add these log calls into your other scripts:
// Example usage:
// logShapeLoaded('box');
// logPinchResize();
// logVoiceCommand();
// logShapesCleared();
