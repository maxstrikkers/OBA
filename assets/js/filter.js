const filterForm = document.querySelector(".filter");
const bodyWrapper = document.querySelector(".body-wrapper")
const filterButton = document.getElementById("filterToggleButton");
const resultatenSec = document.getElementById("resultaten");

function showFilter() {
    filterForm.classList.toggle("hide-filter");
    bodyWrapper.classList.toggle("body-grid");
    resultatenSec.classList.toggle("resultaten-grid");


}
filterButton.addEventListener("click", showFilter);
