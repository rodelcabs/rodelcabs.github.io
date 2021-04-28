const setTheme = (mode) => {
  document.getElementById("theme-style").href = `${mode}.css`;
  localStorage.setItem("mode", mode);
};

let themeDots = document.getElementsByClassName("theme-dot");
let currentMode =
  localStorage.getItem("mode") == null
    ? "default"
    : localStorage.getItem("mode");

setTheme(currentMode);

for (let i = 0; i < themeDots.length; i++) {
  themeDots[i].addEventListener("click", function () {
    let theme = themeDots[i].dataset.mode;
    setTheme(theme);
  });
}
