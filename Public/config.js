const socket = io();

function updateLetterDay() {
  socket.emit("get-letter-day", (callback) => {
    letterDayIndex = callback;
    document.getElementById("letter-text").textContent =
      letterDays[letterDayIndex] + "-Day";
  });
}
function writeLetterDay(day) {
  socket.emit("write-letter-day", day);
}
function writeTheme(theme) {
  socket.emit("write-theme", theme);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("letterDay").addEventListener("change", (e) => {
    e.preventDefault();
    writeLetterDay(document.getElementById("letterDay").value);
  });

  document.getElementById("theme-dropdown").addEventListener("change", (e) => {
    e.preventDefault();
    writeTheme(document.getElementById("theme-dropdown").value);
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  let themeDropdown = document.getElementById("theme-dropdown");
  function populateThemeDropdown() {
    fetch("themes.json")
      .then((response) => response.json())
      .then((themes) => {
        for (let key in themes) {
          const newOption = document.createElement("option");
          newOption.innerHTML = key;
          newOption.value = themes[key];
          themeDropdown.appendChild(newOption);
        }
      });
  }
  populateThemeDropdown();
});
