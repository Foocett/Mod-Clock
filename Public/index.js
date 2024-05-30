document.addEventListener("DOMContentLoaded", function() {
    function startTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        let ampm = " " +  (h >= 12 ? 'PM' : 'AM');
        m = checkTime(m);
        s = checkTime(s);
        document.getElementById("live-time").textContent = (h%12 + ":" + m + ":" + s + ampm).toString();
        setTimeout(startTime, 1000);
    }

    function checkTime(i) {
        if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
        return i;
    }


    startTime();
})