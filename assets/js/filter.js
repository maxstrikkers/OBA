const filterForm = document.querySelector(".filter");
const filterButton = document.querySelector(".filter-button");

filterForm.classList.add("hidden");

function showFilter() {
    filterForm.classList.toggle("hidden");
}
filterButton.addEventListener("click", showFilter);