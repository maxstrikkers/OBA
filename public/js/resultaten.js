const shiftButton = document.querySelector("#shift-button");
const sectionArticle = document.querySelector("#section-article");

function scrollFunc() {
    sectionArticle.scrollTo({ top: 200, behavior: 'smooth' });
}

shiftButton.addEventListener("click", scrollFunc);
