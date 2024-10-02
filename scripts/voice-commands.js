// Global variable to track whether voice commands are enabled
window.voiceCommandsEnabled = false;
let recognition;

// Function to start voice commands
function startVoiceCommands() {
    // Check if the browser supports the Web Speech API
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice commands are not supported in this browser. Please try using Google Chrome.');
        return;
    }

    // Initialize the speech recognition
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep recognizing even after pauses
    recognition.interimResults = false; // Only finalize recognized words
    recognition.lang = 'en-US'; // Set the language to English

    // Event listener for recognized speech
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log(`Recognized command: ${transcript}`);

        // Handle recognized commands
        switch (transcript) {
            case 'load box':
                loadShape('box');
                break;
            case 'load sphere':
                loadShape('sphere');
                break;
            case 'load cylinder':
                loadShape('cylinder');
                break;
            case 'clear shapes':
                clearShapes();
                break;
            default:
                console.log(`Command "${transcript}" not recognized.`);
        }
    };

    // Start the speech recognition
    recognition.start();
    window.voiceCommandsEnabled = true;
    alert('Voice commands are now enabled. Say "load box", "load sphere", "load cylinder", or "clear shapes".');
}

// Function to stop voice commands
function stopVoiceCommands() {
    if (recognition) {
        recognition.stop();
        window.voiceCommandsEnabled = false;
        alert('Voice commands have been disabled.');
    }
}

// Function to provide voice feedback
function speak(text) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
    } else {
        alert('Speech Synthesis not supported in this browser.');
    }
}

// Start voice commands when page loads (optional)
document.addEventListener('DOMContentLoaded', () => {
    // Uncomment to automatically start voice commands:
    // startVoiceCommands();
});


