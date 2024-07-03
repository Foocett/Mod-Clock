document.addEventListener("DOMContentLoaded", function() {
    const socket = io();
    const timeForm = document.getElementById('timeForm');
    const letterDayForm = document.getElementById('letterDayForm');
    const addTimeSlotButton = document.getElementById('addTimeSlot');
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');

    addTimeSlotButton.addEventListener('click', () => {
        const timeSlotCount = timeSlotsContainer.children.length;
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.classList.add('time-slot');
        timeSlotDiv.innerHTML = `
            <label for="start-${timeSlotCount}">Start Time:</label>
            <input type="time" id="start-${timeSlotCount}" name="start-${timeSlotCount}" required>
            <label for="end-${timeSlotCount}">End Time:</label>
            <input type="time" id="end-${timeSlotCount}" name="end-${timeSlotCount}" required>
        `;
        timeSlotsContainer.appendChild(timeSlotDiv);
    });

    timeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(timeForm);
        const dayType = formData.get('day');
        const timeSlots = [];
        for (let i = 0; i < timeSlotsContainer.children.length; i++) {
            const start = formData.get(`start-${i}`);
            const end = formData.get(`end-${i}`);
            if (start && end) {
                timeSlots.push({ start, end });
            }
        }
        socket.emit('saveTimeSlots', { dayType, timeSlots });
    });

    letterDayForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const letterDay = document.getElementById('letterDay').value;
        socket.emit('setLetterDay', { letterDay });
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
});
