const filterForm = document.querySelector(".filter");
// const bodyWrapper = document.querySelector(".body-wrapper")
const showFilterButton = document.querySelector(".filter-button");
// const resultatenSec = document.getElementById("resultaten");
const submitFilterButton = document.querySelector(".submitFilterButton");

function showFilter() {
  filterForm.classList.toggle("show");
}
showFilterButton.addEventListener("click", showFilter);

// Front-end JavaScript

// Get the form element
const form = document.querySelector("#your-form-id");

// Function to handle form submission
async function handleFormSubmit(event) {
  // Prevent form from submitting normally
  event.preventDefault();

  // Get the checkboxes
  const checkbox9 = document.querySelector("#infoVolwassenen");

  // Make an HTTP request to the server
  const response = await fetch("/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkbox9: checkbox9.checked,
    }),
  });

  // Get the filtered results from the server's response
  const filteredResults = await response.json();

  // Call the renderResults function with the filtered results
  renderResults(filteredResults);
  console.log("filterbutton pressed");
}

// Add event listener to form submit
submitFilterButton.addEventListener("click", handleFormSubmit);

// Function to render results
function renderResults(resultData) {
  const resultsSection = document.getElementById("results-section");

  resultsSection.innerHTML = "";
  resultData.forEach((result) => {
    const article = document.createElement("article");
    article.classList.add("book-result");
    const img = document.createElement("img");
    img.src = result.document.coverUrl;
    img.alt = "book cover";

    img.addEventListener("load", function () {
      if (img.naturalWidth == 1 && img.naturalHeight == 1) {
        img.src = "./img/no-cover.jpeg";
        result.document.coverUrl = "./img/no-cover.jpeg";
      }
    });

    article.appendChild(img);

    const h5 = document.createElement("h5");
    h5.textContent = result.document.titel;
    article.appendChild(h5);

    resultsSection.appendChild(article);
    article.addEventListener("click", () => {
      openDetail(
        result.document.coverUrl,
        result.document.titel,
        result.document.ppn,
        result.document.beschrijving,
        result.document.auteur
      );
    });
  });
}
