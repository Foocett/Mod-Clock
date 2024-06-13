//const socket = io();
const letterDays = ["A", "B", "C", "D", "E", "F"];
let previousDay = new Date().getDate(); // Initialize with the current day
let letterDayIndex = 0
const modTimes = [
    { start: '08:25:00', end: '08:44:59' },
    { start: '08:45:00', end: '09:09:59' },
    { start: '09:10:00', end: '09:29:59' },
    { start: '09:30:00', end: '09:54:59' },
    { start: '09:55:00', end: '10:14:59' },
    { start: '10:15:00', end: '10:39:59' },
    { start: '10:40:00', end: '10:59:59' },
    { start: '11:00:00', end: '11:24:59' },
    { start: '11:25:00', end: '11:44:59' },
    { start: '11:45:00', end: '12:09:59' },
    { start: '12:10:00', end: '12:29:59' },
    { start: '12:30:00', end: '12:54:59' },
    { start: '12:55:00', end: '13:14:59' },
    { start: '13:15:00', end: '13:39:59' },
    { start: '13:40:00', end: '13:59:59' },
    { start: '14:00:00', end: '14:24:59' },
    { start: '14:25:00', end: '14:44:59' },
    { start: '14:45:00', end: '15:09:59' }
]

const wedModTimes = [
    { start: '09:10', end: '09:29:59' },
    { start: '09:30', end: '09:49:59' },
    { start: '09:50', end: '10:09:59' },
    { start: '10:10', end: '10:29:59' },
    { start: '10:30', end: '10:49:59' },
    { start: '10:50', end: '11:09:59' },
    { start: '11:10', end: '11:29:59' },
    { start: '11:30', end: '11:49:59' },
    { start: '11:50', end: '12:09:59' },
    { start: '12:10', end: '12:29:59' },
    { start: '12:30', end: '12:49:59' },
    { start: '12:50', end: '13:09:59' },
    { start: '13:10', end: '13:29:59' },
    { start: '13:30', end: '13:49:59' },
    { start: '13:50', end: '14:09:59' },
    { start: '14:10', end: '14:29:59' },
    { start: '14:30', end: '14:49:59' },
    { start: '14:50', end: '15:09:59' }
];



document.addEventListener("DOMContentLoaded", function() {
    function startTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        let ampm = " " + (h >= 12 ? 'PM' : 'AM');
        h = h % 12;
        h = h ? h : 12; // the hour '0' should be '12'
        m = checkTime(m);
        s = checkTime(s);

        document.getElementById("live-time").textContent = h + ":" + m + ":" + s + " " + ampm;
        document.getElementById("mod-text").textContent = "Mod " + getTimeSlot();
        setProgress(getElapsedTimePercentage());
        setTimeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
        return i;
    }

    function setProgress(percentage) {
        const mask = document.getElementById('mask');
        mask.style.width = percentage + '%';
    }

    function isWednesday() {
        const today = new Date();
        return today.getDay() === 3; // 3 corresponds to Wednesday
    }

    function getTimeInSeconds(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + (seconds || 0);
    }

    function nextLetterDay() {
        if(letterDayIndex === 5) {
            letterDayIndex = 0;
        } else {
            letterDayIndex++;
        }
        document.getElementById("letter-text").textContent = letterDays[letterDayIndex] + "-Day" ;
    }

    function getTimeSlot() {
        let timeSlots;
        let startTime;
        if(isWednesday()) {
            timeSlots = wedModTimes;
            startTime = "9:10";
        } else {
            timeSlots = modTimes;
            startTime = "8:25";
        }

        const now = new Date();
        const nowInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        // Check if the day has changed
        if (now.getDate() !== previousDay) {
            nextLetterDay();
            previousDay = now.getDate(); // Update the previous day to the current day
        }
        if (nowInSeconds < getTimeInSeconds(startTime)) {
            return 0;
        }

        for (let i = 0; i < timeSlots.length; i++) {
            const start = getTimeInSeconds(timeSlots[i].start);
            const end = getTimeInSeconds(timeSlots[i].end);
            if (start <= nowInSeconds && nowInSeconds <= end) {
                return i + 1;
            }
        }

        return 18; // Default return if after the last time slot
    }

    function getElapsedTimePercentage() {
        let timeSlots;
        if(isWednesday()) {
            timeSlots = wedModTimes
        } else {
            timeSlots = modTimes
        }
        const now = new Date();
        const nowInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

        for (let i = 0; i < timeSlots.length; i++) {
            const start = getTimeInSeconds(timeSlots[i].start);
            const end = getTimeInSeconds(timeSlots[i].end);
            if (start <= nowInSeconds && nowInSeconds <= end) {
                const elapsed = nowInSeconds - start;
                const duration = end - start;
                return (elapsed / duration) * 100;
            }
        }

        return 100; // Default return if before the first time slot or after the last time slot
    }

    startTime();
})