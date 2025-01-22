// Connect to the server via WebSocket
const socket = io('http://192.168.1.86:5001');  // TODO Replace <local_ip> with the actual local IP address


// Get references to the joystick elements
const joystickContainer = document.getElementById('joystick-container');
const joystick = document.getElementById('joystick');

// Store the initial position of the joystick
let isMoving = false;
let joystickCenter = {
    x: joystickContainer.offsetWidth / 2,
    y: joystickContainer.offsetHeight / 2
};
let maxDistance = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;

// Function to move the joystick and calculate the axis
function moveJoystick(event) {
    let rect = joystickContainer.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    let dx = mouseX - joystickCenter.x;
    let dy = mouseY - joystickCenter.y;
    let distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
    let angle = Math.atan2(dy, dx);

    let newX = joystickCenter.x + distance * Math.cos(angle) - joystick.offsetWidth / 2;
    let newY = joystickCenter.y + distance * Math.sin(angle) - joystick.offsetHeight / 2;

    joystick.style.transform = `translate(${newX - joystickCenter.x}px, ${newY - joystickCenter.y}px}`;

    // Simulate joystick axis data (e.g., range from -1 to 1)
    let axisX = (newX - joystickCenter.x) / maxDistance;
    let axisY = (newY - joystickCenter.y) / maxDistance;

    // Send the joystick data to the server via WebSocket
    socket.emit('joystick-move', { axisX, axisY });
}

// Event listeners for mouse/touch input
joystickContainer.addEventListener('mousedown', (event) => {
    isMoving = true;
    moveJoystick(event);
    document.addEventListener('mousemove', moveJoystick);
});

document.addEventListener('mouseup', () => {
    isMoving = false;
    joystick.style.transform = 'translate(0, 0)';
    document.removeEventListener('mousemove', moveJoystick);
});

joystickContainer.addEventListener('touchstart', (event) => {
    isMoving = true;
    moveJoystick(event.touches[0]);
    document.addEventListener('touchmove', (e) => moveJoystick(e.touches[0]));
});

document.addEventListener('touchend', () => {
    isMoving = false;
    joystick.style.transform = 'translate(0, 0)';
    document.removeEventListener('touchmove', (e) => moveJoystick(e.touches[0]));
});
