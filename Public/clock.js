//TODO Store letter day on server

const socket = io();
const letterDays = ["A", "B", "C", "D", "E", "F"]; // Used to make day progression easier
let letterDayIndex = 0; // Keeps track of letter days array
let previousDay = new Date().getDate(); // Used to track day changes to progress letter day
const modTimes = [ //start and end times for normal day
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
];
const wedModTimes = [ //start and end times for wednesday
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

/**
 * [Sends a request to the server ]
 *
 */
function updateLetterDay() {
    socket.emit("get-letter-day", (callback) => {
        letterDayIndex = callback;
        document.getElementById("letter-text").textContent = letterDays[letterDayIndex] + "-Day";
    });
}

/**
 * Sends a request to the server to write the current letter day.
 * @param {number} day - The index of the current letter day.
 */
function writeLetterDay(day) {
    socket.emit("write-letter-day", day);
}

document.addEventListener("DOMContentLoaded", function() { //execute code after all the page content is loaded
    document.addEventListener('keydown', function(e) {
        if (e.repeat) return; // Prevent multiple triggers on long press
        const bodyStyle = document.body.style;
        bodyStyle.cursor = bodyStyle.cursor === 'none' ? 'unset' : 'none';
    });

    socket.on('update-letter-day', (val) => {
        document.getElementById("letter-text").textContent = letterDays[val] + "-Day";
    });

    socket.on('update-theme', (theme) => {
        document.documentElement.style.setProperty("--background", theme);
    });

    /**
     * Starts the primary loop that drives the whole clock, functions as all-encompassing init function.
     */
    function startTime() {
        const today = new Date(); //creates a new time object
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();

        let ampm = " " + (h >= 12 ? 'PM' : 'AM'); //Get AM/PM Value, this notation is called a ternary operator, saying that if h>=12, return PM else return AM, there is a more advanced usage of this notation in a few lines

        h %= 12; //Converts from 24hr time to 12hr, in other terms, h  is equal to the remainder of h divided by 12

        h = h ? h : 12; // changes '0' o'clock to 12 o'clock (this works because javascript can interpret the number 0 as a false boolean since it is dynamically typed), writing an expression in this format is called a ternary operator
        // A ternary operator can be read as {condition ? resultIfTrue : resultIfFalse}

        m = formatTime(m); //format minutes value
        s = formatTime(s); //format seconds value
        updateLetterDay();
        document.getElementById("live-time").textContent = h + ":" + m + ":" + s + " " + ampm; //set timer text value
        document.getElementById("mod-text").textContent = "Mod " + getTimeSlot(); //set mod number text value
        setProgress(getElapsedTimePercentage()); //update progress bar position
        setTimeout(startTime, 1000); //create a one-second delay before re-calling the function, I guess this is technically recursion
    }

    /**
     * Adds a zero in front of numbers less than 10.
     * @param {number} i - The number to check.
     * @returns {string} The formatted number.
     */
    function formatTime(i) {
        if (i < 10) {i = "0" + i}
        return i.toString();
    }

    /**
     * Sets the progress bar width based on the given percentage.
     * @param {number} percentage - The percentage of time elapsed.
     */
    function setProgress(percentage) {
        const mask = document.getElementById('mask'); //get progress bar mask element
        mask.style.width = percentage + '%'; //set the mask's width property
    }

    /**
     * Checks if today is Wednesday.
     * @returns {boolean} True if today is Wednesday, false otherwise.
     */
    function isWednesday() {
        const today = new Date();
        return today.getDay() === 3; // 3 corresponds to Wednesday
    }

    /**
     * Checks if today is a weekend.
     * @returns {boolean} True if today is Saturday or Sunday, false otherwise.
     */
    function isWeekend() {
        const today = new Date();
        return today.getDay() === 6 || today.getDay() === 7; //6 and 7 correspond to Saturday and Sunday
    }

    /**
     * Converts a time string to seconds.
     * @param {string} timeString - The time string in hh:mm:ss format.
     * @returns {number} The time in seconds.
     */
    function getTimeInSeconds(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        /* There's a lot of stuff going in this line so here's a breakdown
        *  const [hours, minutes, seconds] - this syntax allows us to quickly break down an array into numerous variables
        * .split(':') - this function splits the time string which will be formatted as hh:mm:ss into an array of substrings separated by :'s, resulting in [hh,mm,ss]
        * .map(Number) - the map function applies something to each element of an array, in this case, applying the "Number" function, converting the strings from the split function into numbers so ["12", "34", "56"] becomes [12, 34, 56].
        *
        * after performing the map function, we have an array of three numbers which we can assign to our variable array [hours, minutes, seconds], giving us three variables
        * */

        return (hours * 3600) + (minutes * 60) + (seconds || 0); //converts hour and minute values into seconds
        //the || is used to prevent errors in the case that "seconds" is undefined, idk how that would happen it's just good practice
    }

    /**
     * Progresses to the next letter day if it's not a weekend.
     */
    function nextLetterDay() {
        if(!isWeekend()) {
            if (letterDayIndex === 5) { //if index is five, wrap back to zero, else increase by one
                letterDayIndex = 0;
                writeLetterDay(letterDayIndex);
            } else {
                letterDayIndex++;
                writeLetterDay(letterDayIndex);
            }
            updateLetterDay();
        }
    }

    /**
     * Determines the current time slot based on the current time.
     * @returns {number} The current time slot index.
     */
    function getTimeSlot() {
        //these two variables are initialized at the top of the code to ensure they are in the correct scope
        //after they are created, we can define their values inside a conditional (if it is wednesday or not)
        let timeSlots;
        let startTime;
        if(isWednesday()) {
            timeSlots = wedModTimes;
            startTime = "9:10";
        } else {
            timeSlots = modTimes;
            startTime = "8:25";
        }

        const now = new Date(); //create new timestamp
        const nowInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); //convert timestamp into comparable second format

        // Check if the day has changed
        if (now.getDate() !== previousDay) {
            nextLetterDay();
            previousDay = now.getDate(); // Update the previous day to the current day
        }
        if (nowInSeconds < getTimeInSeconds(startTime)) { //if the time is before the first mod, return a zero
            return 0;
        }

        for (let i = 0; i < timeSlots.length; i++) { //for each time slot
            const start = getTimeInSeconds(timeSlots[i].start); //get start time
            const end = getTimeInSeconds(timeSlots[i].end); //get end time
            if (start <= nowInSeconds && nowInSeconds <= end) { //if current time falls between start time and end time, return current index (plus one since mods start from one, not zero)
                return i + 1;
            }
        }

        return 18; // Default return if after the last time slot
    }

    /**
     * Gets the percentage of time elapsed in the current mod.
     * @returns {number} The percentage of time elapsed.
     */
    function getElapsedTimePercentage() { //get percent of time elapsed in current mod
        let timeSlots;
        if(isWednesday()) { //determine which schedule to use
            timeSlots = wedModTimes;
        } else {
            timeSlots = modTimes;
        }
        const now = new Date(); //create new timestamp
        const nowInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds(); //convert to seconds

        for (let i = 0; i < timeSlots.length; i++) { //for each time slot
            const start = getTimeInSeconds(timeSlots[i].start);
            const end = getTimeInSeconds(timeSlots[i].end);
            if (start <= nowInSeconds && nowInSeconds <= end) { //find the current time slot
                const elapsed = nowInSeconds - start;
                const duration = end - start;
                return (elapsed / duration) * 100; //return amount of time passed as a percentage
            }
        }

        return 100; // Default return if before the first time slot or after the last time slot
    }

    startTime(); //begin the main loop
});
