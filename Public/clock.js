//TODO Store letter day on server

const socket = io();
const letterDays = ["A", "B", "C", "D", "E", "F"]; //Used to make day progression easier
let letterDayIndex = 0 //Keeps track of letter days array
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
]
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



document.addEventListener("DOMContentLoaded", function() { //execute code after all of page content is loaded
    function startTime() { //Starts loop, functions as all-encompassing init function
        const today = new Date(); //creates a new time object
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();

        let ampm = " " + (h >= 12 ? 'PM' : 'AM'); //Get AM/PM Value, this notation is called a ternary operator saying that if h>=12, return PM else return AM, there is a more advanced usage of this notation in a few lines

        h %= 12; //Converts from 24hr time to 12hr, in other terms, h  is equal to the remainder of h divided by 12 (remember that the %= is a shorthand for

        h = h ? h : 12; // changes '0' o'clock to 12 o'clock (this works because javascript can interpret the number 0 as a false boolean since it is dynamically typed), writing an expression in this format is called a ternary operator
        // A ternary operator can be read as {condition ? resultIfTrue : resultIfFalse}

        console.log(h)
        console.log(ampm)
        m = checkTime(m); //format minutes value
        s = checkTime(s); //format seconds value

        document.getElementById("live-time").textContent = h + ":" + m + ":" + s + " " + ampm; //set timer text value
        document.getElementById("mod-text").textContent = "Mod " + getTimeSlot(); //set mod number text value
        setProgress(getElapsedTimePercentage()); //update progress bar position
        setTimeout(startTime, 1000); //create a one-second delay before re-calling the function, I guess this is technically recursion
    }

    function checkTime(i) {  // add zero in front of numbers < 10
        if (i < 10) {i = "0" + i}
        return i;
    }

    function setProgress(percentage) {
        const mask = document.getElementById('mask'); //get progress bar mask element
        mask.style.width = percentage + '%'; //set the mask's width property
    }

    function isWednesday() { //check if today is wednesday
        const today = new Date();
        return today.getDay() === 3; // 3 corresponds to Wednesday
    }

    function getTimeInSeconds(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        /* There's a lot going in this line so here's a breakdown
        *  const [hours, minutes, seconds] - this syntax allows us to quickly break down an array into numerous variables
        * .split(':') - this function splits the time string which will be formatted as hh:mm:ss into an array of substrings separated by :'s, resulting in [hh,mm,ss]
        * .map(Number) - the map function applies something to each element of an array, in this case, applying the "Number" function, converting the strings from the split function into numbers so ["12", "34", "56"] becomes [12, 34, 56].
        *
        * after performing the map function, we have an array of three numbers which we can assign to our variable array [hours, minutes, seconds], giving us three variables
        * */

        return (hours * 3600) + (minutes * 60) + (seconds || 0); //converts hour and minute values into seconds
        //the || is used to prevent errors in the case that "seconds" is undefined, idk how that would happen it's just good practice
    }

    function nextLetterDay() {
        if(letterDayIndex === 5) { //if index is five, wrap back to zero, else increase by one
            letterDayIndex = 0;
        } else {
            letterDayIndex++;
        }
        document.getElementById("letter-text").textContent = letterDays[letterDayIndex] + "-Day" ; //update letter day DOM element
    }

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

    function getElapsedTimePercentage() { //get percent of time elapsed in current mod
        let timeSlots;
        if(isWednesday()) { //determine which schedule to use
            timeSlots = wedModTimes
        } else {
            timeSlots = modTimes
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
})