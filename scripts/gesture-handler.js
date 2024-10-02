document.addEventListener('DOMContentLoaded', () => {
    const shapeContainer = document.getElementById('shape-container');
    const hammer = new Hammer(document.body); // Initialize Hammer.js on the entire body to detect gestures

    // Enable pinch and pan gestures
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ enable: true });

    let initialScale = 1;
    let currentScale = 1;
    let selectedObject = null;
    let startPosition = { x: 0, y: 0 };

    // Event listener for the start of a pinch gesture
    hammer.on('pinchstart', () => {
        if (selectedObject) {
            initialScale = selectedObject.object3D.scale.x; // Use the current scale of the selected object
        }
    });

    // Event listener for pinch movement (scaling)
    hammer.on('pinchmove', (e) => {
        if (selectedObject) {
            currentScale = initialScale * e.scale;
            // Set the new scale to the selected object
            selectedObject.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
        }
    });

    // Event listener for selecting objects
    shapeContainer.addEventListener('click', (e) => {
        if (e.target.tagName.startsWith('A-')) {
            selectedObject = e.target; // Set the selected object
        }
    });

    // Event listener for panstart to get the starting position
    hammer.on('panstart', (e) => {
        if (selectedObject) {
            startPosition.x = e.center.x;
            startPosition.y = e.center.y;
        }
    });

    // Event listener for pan movement (dragging)
    hammer.on('panmove', (e) => {
        if (selectedObject) {
            // Calculate new position based on pan movement
            const deltaX = (e.center.x - startPosition.x) * 0.01; // Scale factor for sensitivity
            const deltaY = (e.center.y - startPosition.y) * 0.01;

            // Update position attributes (modify x and y based on movement)
            const currentPosition = selectedObject.getAttribute('position');
            selectedObject.setAttribute('position', {
                x: currentPosition.x + deltaX,
                y: currentPosition.y - deltaY, // Invert y-axis for natural drag behavior
                z: currentPosition.z,
            });

            // Update startPosition to the current position for continuous dragging
            startPosition.x = e.center.x;
            startPosition.y = e.center.y;
        }
    });

    // Initialize Hammer.js
    document.addEventListener('DOMContentLoaded', () => {
        const shapeContainer = document.getElementById('shape-container');
        const hammer = new Hammer(document.body);

        // Enable pan gestures
        hammer.get('pan').set({ enable: true, direction: Hammer.DIRECTION_ALL });

        let selectedObject = null;
        let startPosition = { x: 0, y: 0 };

        // Event listener for selecting objects
        shapeContainer.addEventListener('click', (e) => {
            if (e.target.tagName.startsWith('A-')) {
                selectedObject = e.target; // Set the selected object
            }
        });

        // Detect rotation gestures
        hammer.on('panstart', (e) => {
            if (selectedObject) {
                startPosition.x = e.center.x;
                startPosition.y = e.center.y;
            }
        });

        hammer.on('panmove', (e) => {
            if (selectedObject) {
                const deltaX = (e.center.x - startPosition.x) * 0.1; // Scale factor for sensitivity
                const deltaY = (e.center.y - startPosition.y) * 0.1;

                const currentRotation = selectedObject.getAttribute('rotation');
                selectedObject.setAttribute('rotation', {
                    x: currentRotation.x - deltaY,
                    y: currentRotation.y + deltaX,
                    z: currentRotation.z,
                });

                // Update startPosition to current position for continuous rotation
                startPosition.x = e.center.x;
                startPosition.y = e.center.y;
            }
        });
    });

});
