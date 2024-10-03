// Global variable to track the currently loaded shape
let isOpenCVReady = false;
let isTensorFlowReady = false;

let currentShape = ''; // Default to no shape
// Global variables
let shapeObjects = []; // Array to store all loaded shapes
let currentIndex = -1; // Index of the currently selected shape

window.onload = function () {
    var script = document.createElement('script');
    script.src = "https://docs.opencv.org/5.x/opencv.js";
    script.onload = function () {
      console.log('OpenCV.js loaded successfully');
      // Your OpenCV-dependent code can go here
    };
    script.onerror = function () {
      console.error('Failed to load OpenCV.js');
    };
    document.head.appendChild(script);
  };
  

// Function to load shapes once everything is ready
function loadShapeWhenReady(shapeType) {
    if (isOpenCVReady && isTensorFlowReady) {
        loadShape(shapeType);
    } else {
        console.log("Waiting for TensorFlow and OpenCV to be ready...");
    }
}

// Add initialization flag checks for OpenCV and TensorFlow
document.addEventListener('DOMContentLoaded', () => {
    cv['onRuntimeInitialized'] = () => {
        console.log('OpenCV.js is ready!');
        isOpenCVReady = true; // Mark OpenCV as ready
        checkReadyAndStart();
    };

    cocoSsd.load().then((loadedModel) => {
        model = loadedModel;
        console.log('COCO-SSD model loaded successfully');
        isTensorFlowReady = true; // Mark TensorFlow as ready
        checkReadyAndStart();
    });
})

// Function to check readiness of OpenCV and TensorFlow
function checkReadyAndStart() {
    if (isOpenCVReady && isTensorFlowReady) {
        console.log('Both OpenCV and TensorFlow are ready!');
        startCamera(); // Start the camera and AR logic only after both are ready
    }
}

// Function to load a shape into the AR scene
function loadShape(shapeType) {
    if (currentShape === shapeType) return;

    const shapeContainer = document.getElementById('shape-container');
    shapeContainer.innerHTML = ''; 

    let shapeEntity;
    let shapeProperties = {};

    switch (shapeType) {
        case 'box':
            shapeEntity = document.createElement('a-box');
            shapeProperties = {
                shape: 'Box',
            //    explanation: 'A box is a six-sided 3D shape with rectangular faces. It has length, width, and height.',
                dimensions: '1 x 1 x 1',
                color: '#4CC3D9',
                formula: 'Volume = length × width × height',
                volume: 1 * 1 * 1,
            };
            shapeEntity.setAttribute('position', '0 1.5 -4');
            shapeEntity.setAttribute('rotation', '0 45 0');
            shapeEntity.setAttribute('color', shapeProperties.color);
            shapeEntity.setAttribute('depth', '1');
            shapeEntity.setAttribute('height', '1');
            shapeEntity.setAttribute('width', '1');
            shapeEntity.setAttribute('material', 'src: #wood-texture');
            shapeEntity.setAttribute('sound', 'on: click; src: #box-sound');
          //  speak('You have loaded a box. It is a three-dimensional shape with length, width, and height.');
            break;

        case 'sphere':
            shapeEntity = document.createElement('a-sphere');
            shapeProperties = {
                shape: 'Sphere',
               // explanation: 'A sphere is a perfectly round 3D shape. Every point on its surface is equidistant from its center.',
                dimensions: 'Radius: 0.5',
                color: '#EF2D5E',
                formula: 'Volume = (4/3)πr³',
                volume: (4 / 3) * Math.PI * Math.pow(0.5, 3),
            };
            shapeEntity.setAttribute('position', '0 1.5 -4');
            shapeEntity.setAttribute('radius', '0.5');
            shapeEntity.setAttribute('color', shapeProperties.color);
            shapeEntity.setAttribute('material', 'src: #metal-texture');
            shapeEntity.setAttribute('sound', 'on: click; src: #sphere-sound');
           // speak('You have loaded a sphere. It is a round, three-dimensional shape.');
            break;

        case 'cylinder':
            shapeEntity = document.createElement('a-cylinder');
            shapeProperties = {
                shape: 'Cylinder',
              //  explanation: 'A cylinder is a 3D shape with circular ends and straight sides. It has a radius and a height.',
                dimensions: 'Radius: 0.3, Height: 1.5',
                color: '#FFC65D',
                formula: 'Volume = πr²h',
                volume: Math.PI * Math.pow(0.3, 2) * 1.5,
            };
            shapeEntity.setAttribute('position', '0 1.5 -4');
            shapeEntity.setAttribute('radius', '0.3');
            shapeEntity.setAttribute('height', '1.5');
            shapeEntity.setAttribute('color', shapeProperties.color);
            shapeEntity.setAttribute('sound', 'on: click; src: #cylinder-sound');
           // speak('You have loaded a cylinder. It is a three-dimensional shape with a circular base.');
            break;

        default:
            console.warn('Invalid shape type');
            return;
    }

    // Create the tooltip text
    const tooltip = document.createElement('a-text');
    tooltip.setAttribute('value', `Shape: ${shapeProperties.shape}\nDimensions: ${shapeProperties.dimensions}\nFormula: ${shapeProperties.formula}`);
    tooltip.setAttribute('position', '0 2 -4');
    tooltip.setAttribute('color', '#FFFFFF');
    tooltip.setAttribute('align', 'center');
    tooltip.setAttribute('width', '4'); // Adjust the width of the text
    tooltip.setAttribute('visible', 'false'); // Hide it initially

    // Add hover events to show/hide the tooltip
    shapeEntity.addEventListener('mouseenter', () => tooltip.setAttribute('visible', 'true'));
    shapeEntity.addEventListener('mouseleave', () => tooltip.setAttribute('visible', 'false'));
    
    // Add an event listener to show the explanation when the shape is clicked
    shapeEntity.addEventListener('click', () => {
        speak(shapeProperties.explanation);
    });
    // Modify shape loading to start quiz on shape click
    shapeEntity.addEventListener('click', () => {
        startQuiz(); // Start quiz when shape is clicked
        speak(shapeProperties.explanation);
    });


    // Append the shape and tooltip to the container
    shapeContainer.appendChild(shapeEntity);
    shapeContainer.appendChild(tooltip);

    // Add the object to the array of selectable shapes
    shapeObjects.push(shapeEntity);

    // Select the newly added object
    currentIndex = shapeObjects.length - 1;
    updateSelectedObject();

    // Update the current shape
    currentShape = shapeType;

    // Show the volume calculator and update it
    updateVolumeCalculator();
    document.getElementById('volume-calculator').style.display = 'block';
}

// Function to update the appearance of the currently selected object
function updateSelectedObject() {
    shapeObjects.forEach((obj, index) => {
        if (index === currentIndex) {
            obj.setAttribute('color', '#FFFF00'); // Highlight the selected object in yellow
            obj.setAttribute('outline', 'enabled: true'); // Optional: Add an outline if you have an outline component
        } else {
            obj.setAttribute('color', obj.getAttribute('original-color')); // Restore the original color
            obj.removeAttribute('outline'); // Optional: Remove the outline from unselected objects
        }
    });
}


// Function to start the quiz
function startQuiz() {
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-feedback').innerText = '';
}

// Function to check the quiz answer
function checkAnswer(answer) {
    if (answer === 'correct') {
        document.getElementById('quiz-feedback').innerText = 'Correct!';
        speak('Correct! Well done.');
    } else {
        document.getElementById('quiz-feedback').innerText = 'Incorrect, try again.';
        speak('Incorrect, try again.');
    }
}



// Function to update the volume calculator based on the current shape
function updateVolumeCalculator() {
    // Set the dropdown to the current shape
    document.getElementById('shape-select').value = currentShape;

    // Display the appropriate input fields
    showFormula();
}

// Function to clear all shapes from the AR scene
function clearShapes() {
    const shapeContainer = document.getElementById('shape-container');
    shapeContainer.innerHTML = ''; // Clear all shapes
    currentShape = ''; // Reset the current shape
    shapeObjects = []; // Array to store all loaded shapes
    currentIndex = -1; // Index of the currently selected shape
    // Hide the volume calculator
    document.getElementById('volume-calculator').style.display = 'none';
}

// Function to show the input fields and formula for the selected shape
function showFormula() {
    const selectedShape = document.getElementById('shape-select').value;
    document.querySelectorAll('.shape-inputs').forEach((el) => el.style.display = 'none');
    document.getElementById(`${selectedShape}-inputs`).style.display = 'block';
}

// Function to calculate volume based on selected shape and input values
function calculateVolume() {
    const shape = document.getElementById('shape-select').value;
    let volume;

    switch (shape) {
        case 'box':
            const length = parseFloat(document.getElementById('length').value);
            const width = parseFloat(document.getElementById('width').value);
            const height = parseFloat(document.getElementById('height').value);
            volume = length * width * height;
            break;
        case 'sphere':
            const radiusSphere = parseFloat(document.getElementById('radius-sphere').value);
            volume = (4 / 3) * Math.PI * Math.pow(radiusSphere, 3);
            break;
        case 'cylinder':
            const radiusCylinder = parseFloat(document.getElementById('radius-cylinder').value);
            const heightCylinder = parseFloat(document.getElementById('height-cylinder').value);
            volume = Math.PI * Math.pow(radiusCylinder, 2) * heightCylinder;
            break;
        default:
            volume = 0;
    }

    document.getElementById('volume-result').innerText = `Volume: ${volume.toFixed(2)}`;
}

// Function to toggle voice commands (integrated with voice-commands.js)
function toggleVoiceCommands() {
    if (window.voiceCommandsEnabled) {
        stopVoiceCommands();
    } else {
        startVoiceCommands();
    }
}

// Function to enable drawing mode
function startDrawing() {
    const drawing = document.querySelector('#drawing');
    drawing.setAttribute('draw', 'enabled: true');
    alert('Drawing mode enabled. Use your mouse or finger to draw.');
}

// Function to disable drawing mode
function stopDrawing() {
    const drawing = document.querySelector('#drawing');
    drawing.setAttribute('draw', 'enabled: false');
    alert('Drawing mode disabled.');
}


// Hide the volume calculator by default when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('volume-calculator').style.display = 'none';
});


// Add keyboard event listener for keyboard accessibility
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault(); // Prevent the default tab behavior
        currentIndex = (currentIndex + 1) % shapeObjects.length; // Cycle to the next object
        updateSelectedObject();
    }
    

    if (currentIndex === -1 || shapeObjects.length === 0) return; // No shape selected or no shapes available

    const selectedObject = shapeObjects[currentIndex];
    const currentPosition = selectedObject.getAttribute('position') || { x: 0, y: 0, z: 0 };
    const currentRotation = selectedObject.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    const currentScale = selectedObject.getAttribute('scale') || { x: 1, y: 1, z: 1 };

    console.log("Current Index:", currentIndex);
    console.log("Shape Objects:", shapeObjects);

    switch (event.key) {
        case 'ArrowUp':
            selectedObject.setAttribute('position', {
                x: currentPosition.x,
                y: currentPosition.y + 0.1,
                z: currentPosition.z
            });
            break;
        case 'ArrowDown':
            selectedObject.setAttribute('position', {
                x: currentPosition.x,
                y: currentPosition.y - 0.1,
                z: currentPosition.z
            });
            break;
        case 'ArrowLeft':
            selectedObject.setAttribute('position', {
                x: currentPosition.x - 0.1,
                y: currentPosition.y,
                z: currentPosition.z
            });
            break;
        case 'ArrowRight':
            selectedObject.setAttribute('position', {
                x: currentPosition.x + 0.1,
                y: currentPosition.y,
                z: currentPosition.z
            });
            break;
        case '+': // Increase size
            selectedObject.setAttribute('scale', {
                x: currentScale.x + 0.1,
                y: currentScale.y + 0.1,
                z: currentScale.z + 0.1
            });
            break;
        case '-': // Decrease size
            selectedObject.setAttribute('scale', {
                x: Math.max(0.1, currentScale.x - 0.1),
                y: Math.max(0.1, currentScale.y - 0.1),
                z: Math.max(0.1, currentScale.z - 0.1)
            });
            break;
        case 'r': // Rotate object
            selectedObject.setAttribute('rotation', {
                x: currentRotation.x,
                y: currentRotation.y + 15,
                z: currentRotation.z
            });
            break;
        case 'Enter': // Trigger object action (e.g., voice explanation)
            const shapeType = selectedObject.tagName.replace('A-', '').toLowerCase();
            speak(shapeType);
            break;
        default:
            break;
    }
});
// Load TensorFlow.js and OpenCV.js
let model; // Variable to store the TensorFlow model

// Load COCO-SSD model for generic object detection
cocoSsd.load().then((loadedModel) => {
    model = loadedModel;
    console.log('COCO-SSD model loaded successfully');
    startCamera(); // Start the camera feed
});

// Function to start the camera feed
function startCamera() {
    const video = document.createElement('video'); // Create the video element first
    video.setAttribute('id', 'webcam');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('width', '640');
    video.setAttribute('height', '480');
    video.style.display = 'block'; // Ensure the video is visible for debugging
    video.style.position = 'relative'; // Make sure the video is positioned correctly
    document.body.appendChild(video);

    // Overlay canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'overlay');
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    document.body.appendChild(canvas);

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => {
                console.log('Video feed is loaded and ready'); // Confirm the video feed is working
                detectObjectsWithTensorFlow(); // Start TensorFlow detection
                detectShapes(); // Start OpenCV detection
            });
        })
        .catch(error => {
            console.error('Error accessing the camera:', error);
        });
}

// Function to detect objects using TensorFlow's COCO-SSD model
function detectObjectsWithTensorFlow() {
    const video = document.getElementById('webcam');

    // Ensure the video feed is loaded and has valid dimensions
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn('Video feed not ready, retrying...');
        setTimeout(detectObjectsWithTensorFlow, 500); // Retry after a short delay
        return;
    }

    if (model) {
        model.detect(video).then((predictions) => {
            // Log detected objects
            if (predictions.length === 0) {
                console.log('No objects detected by TensorFlow');
            } else {
                predictions.forEach((prediction) => {
                    console.log(`Detected by TensorFlow: ${prediction.class}, Confidence: ${(prediction.score * 100).toFixed(2)}%`);
                    
                    // Check if the detected object is cube-like, sphere-like, or cylinder-like
                    if (prediction.class === 'cup' || prediction.class === 'bottle' || prediction.class === 'book') {
                        console.log('Detected a cube-like/cylinder-like object!');
                        loadShape('box'); // Display a cube or cylinder shape in AR
                    }
                    if (prediction.class === 'sports ball' || prediction.class === 'orange') {
                        console.log('Detected a spherical object!');
                        loadShape('sphere'); // Display a sphere shape in AR
                    }
                });
            }
        }).catch((error) => {
            console.error('Error during TensorFlow detection:', error);
        });
    }

    // Continue running TensorFlow detection at a regular interval
    setTimeout(detectObjectsWithTensorFlow, 500); // Adjust this interval for optimal performance
}

// Function to detect shapes using OpenCV
function detectShapes() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('overlay');
    const context = canvas.getContext('2d');

    // Create an OpenCV matrix from the video frame
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);

    cap.read(src); // Read the frame into the matrix
    if (src.empty()) {
        console.error('Failed to capture video frame');
        return;
    }

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    // Apply GaussianBlur to reduce noise from real-world objects
    cv.GaussianBlur(gray, gray, new cv.Size(7, 7), 2);

    // Perform edge detection using Canny
    let edges = new cv.Mat();
    cv.Canny(gray, edges, 30, 100); // Adjust these values as needed

    // Display the edge-detected image on the canvas for debugging
    cv.imshow('overlay', edges);

    // Find contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

    console.log(`Contours found: ${contours.size()}`); // Check if contours are being detected

    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the overlay

    // Shape detection logic remains the same...
    for (let i = 0; i < contours.size(); i++) {
        let contour = contours.get(i);

        // Ignore contours that are too small or too large
        if (cv.contourArea(contour) < 1000 || cv.contourArea(contour) > 30000) {
            continue;
        }

        // Approximate the contour to determine shape
        let approx = new cv.Mat();
        cv.approxPolyDP(contour, approx, 0.02 * cv.arcLength(contour, true), true);

        // Cube/Box detection: 4 to 6 sides
        if (approx.rows >= 4 && approx.rows <= 6) {
            drawShape(context, contour, 'Cube', '#FF0000'); // Red for cubes
            console.log('Detecting a cube-like shape');
            loadShape('box'); // Show cube in AR
        }
        // Sphere detection: Circular shape with high roundness
        else if (cv.contourArea(contour) > 500) {
            let area = cv.contourArea(contour);
            let perimeter = cv.arcLength(contour, true);
            let roundness = 4 * Math.PI * (area / Math.pow(perimeter, 2));

            console.log(`Roundness: ${roundness}`);

            if (roundness > 0.75) {
                drawShape(context, contour, 'Sphere', '#00FF00'); // Green for spheres
                loadShape('sphere'); // Show sphere in AR
            }
        }
        // Cylinder detection: Look for elongated circular shapes
        else {
            const rect = cv.boundingRect(contour);
            const aspectRatio = rect.width / rect.height;

            if (aspectRatio > 0.5 && aspectRatio < 2.0) {
                drawShape(context, contour, 'Cylinder', '#0000FF'); // Blue for cylinders
                loadShape('cylinder'); // Show cylinder in AR
            }
        }

        approx.delete();
    }

    // Clean up matrices
    src.delete();
    gray.delete();
    edges.delete();
    contours.delete();
    hierarchy.delete();

    requestAnimationFrame(detectShapes); // Continue detecting
}

// Function to draw the detected shape on the canvas
function drawShape(context, contour, shapeName, color) {
    context.beginPath();
    for (let j = 0; j < contour.data32S.length; j += 2) {
        const x = contour.data32S[j];
        const y = contour.data32S[j + 1];
        if (j === 0) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
    }
    context.closePath();
    context.lineWidth = 2;
    context.strokeStyle = color;
    context.stroke();

    context.fillStyle = color;
    context.fillText(shapeName, contour.data32S[0], contour.data32S[1] - 10); // Display the name of the shape
}



