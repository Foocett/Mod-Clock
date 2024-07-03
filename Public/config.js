const socket = io();

function updateLetterDay() {
    socket.emit("get-letter-day", (callback) => {
        letterDayIndex = callback;
        document.getElementById("letter-text").textContent = letterDays[letterDayIndex] + "-Day";
    })
}
function writeLetterDay(day) {
    socket.emit("write-letter-day", (day))
}

document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        writeLetterDay(document.getElementById('letterDay').value);
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});
