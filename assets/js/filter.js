const filterForm = document.querySelector(".filter");
// const bodyWrapper = document.querySelector(".body-wrapper")
const filterButton = document.querySelector(".filter-button");
// const resultatenSec = document.getElementById("resultaten");


function showFilter() {
    filterForm.classList.toggle("show");


}
filterButton.addEventListener("click", showFilter);
