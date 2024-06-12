const filterForm = document.querySelector(".filter");
const filterButton = document.querySelector(".filter-button");
const filterCloseButton = document.querySelector(".closefilterbutton");
const filterSearchButton = document.querySelector(".filtersearchbutton");

function openFilter(event) {
    event.stopPropagation();
    filterForm.classList.add("show");
    document.addEventListener("click", closeFilter);
}

function closeFilter(event) {
    if (!filterForm.contains(event.target) && !filterButton.contains(event.target)) {
        filterForm.classList.remove("show");
        document.removeEventListener("click", closeFilter);
    }
}

function preventClose(event) {
    event.stopPropagation();
}

filterButton.addEventListener("click", openFilter);
filterCloseButton.addEventListener("click", function(event) {
    event.stopPropagation();
    filterForm.classList.remove("show");
    document.removeEventListener("click", closeFilter);
});
filterSearchButton.addEventListener("click", function(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Search filter")
    filterForm.classList.remove("show");
    document.removeEventListener("click", closeFilter);
});

filterForm.addEventListener("click", preventClose);
