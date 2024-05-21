
    const shiftButton = document.querySelector("#shiftButton");
    const sectionArticle = document.querySelector("#sectionArticle");
  
    function scrollFunc() {
        sectionArticle.scrollTo = 200;
    }
  
    shiftButton.addEventListener("click", scrollFunc);
