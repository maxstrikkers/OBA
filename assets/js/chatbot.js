// Wis de sessionStorage bij het laden van de pagina
window.onload = function () {
  sessionStorage.removeItem("conversationId");
};

//chatbot component variables
const chatbot = {
  main: document.getElementById("chatbot-main"),
  searchbar: document.getElementById("search-bar"),
  // suggestedForm: document.getElementById("suggested-form"),
  searchForm: document.querySelector(".search-form"),
  newchatButton: document.getElementById("new-chat-button"),
  detailterugbutton: document.getElementById("terugbutton"),
  resultaten: document.getElementById("resultaten"),
  details: document.getElementById("details"),
  filter: document.getElementById("filter"),
};

// Functie om een typende indicatie te tonen

function showTypingBubble() {
  const typingBubble = document.createElement("div");
  typingBubble.className = "bubble typing";

  // Disable elements while typing bubble is shown
  chatbot.searchbar.disabled = true;
  chatbot.searchForm.classList.add("disabled");

  // Add SVG to the typingBubble
  typingBubble.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <circle cx="4" cy="12" r="3" fill="var(--primary-purple)">
            <animate id="svgSpinners3DotsBounce0" attributeName="cy" begin="0;svgSpinners3DotsBounce1.end+0.25s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
        <circle cx="12" cy="12" r="3" fill="var(--primary-purple)">
            <animate attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
        <circle cx="20" cy="12" r="3" fill="var(--primary-purple)">
            <animate id="svgSpinners3DotsBounce1" attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
    </svg>
    `;
  chatbot.main.appendChild(typingBubble);
  return typingBubble;
}

// Functie om bubbles te genereren
function createBubble(content, className) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${className}`;
  bubble.textContent = content;
  return bubble;
}

// Event listener voor het versturen van de formulieren
chatbot.searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const data = {};

  createTempBubbles(chatbot.searchForm, data);
  showTypingBubble();

  placeholderResults();

  // Verzamelen van bestaande chatbubbels
  const bubbles = document.querySelectorAll(".bubble");
  let bubbleData = [];
  bubbles.forEach((bubble) => {
    const isRight = bubble.classList.contains("right");
    const isLeft = bubble.classList.contains("left");
    if (isRight || isLeft) {
      bubbleData.push({
        content: bubble.innerText,
        class: isRight ? "right" : "left",
      });
    }
  });

  data.bubbles = bubbleData;
  const url = this.action;
  // setTimeout(() => {
  //   submitFormData(url, data);
  // }, 6000000);
  // uncomment this part to style the loading state (comment the line under here)
  submitFormData(url, data);
});

function createTempBubbles(form, data) {
  if (form.classList.contains("suggested-form")) {
    const formData = form.querySelector("[type=submit]").value;
    data["query"] = formData;
    const bubble = document.createElement("div");
    bubble.className = `right temporaryBubble`;
    bubble.innerHTML = `<p>${formData}</p>`;
    chatbot.main.appendChild(bubble);
  } else if (form.classList.contains("search-form")) {
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const bubble = document.createElement("div");
    bubble.className = `right temporaryBubble`;
    bubble.innerHTML = `<p>${chatbot.searchbar.value}</p>`;
    chatbot.main.appendChild(bubble);
    chatbot.searchbar.value = "";
  }
}

function placeholderResults() {
  //Weghalen van geen resultaten text
  document.querySelector(".empty-state").classList.add("hidden");

  document.getElementById("results-section").innerHTML = `
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <p class="placeholder-loading-p">Ik ben bezig met zoeken. een momentje alsjeblieft...</p>
        <svg class="placeholder-loading-svg" xmlns="http://www.w3.org/2000/svg" width="10em" height="10em" viewBox="0 0 24 24"><path fill="var(--primary-dark-gray" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="var(--primary-purple)" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
      `;
}

function submitFormData(url, data) {
  const conversationId = sessionStorage.getItem("conversationId"); // Haal de conversationId op uit sessionStorage
  if (conversationId) {
    data.conversationId = conversationId; // Voeg conversationId toe aan het data object
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const existingChats = document.querySelectorAll(".bubble");
      existingChats.forEach((chat) => chat.remove());

      const messageData = data.messages;
      messageData.forEach((message) => {
        const bubble = document.createElement("div");
        bubble.className = `bubble ${message.class}`;
        bubble.innerHTML = `<p>${message.content}</p>`;
        chatbot.main.appendChild(bubble);
      });

      const temporaryElements = document.querySelectorAll(".temporaryBubble");
      temporaryElements.forEach((element) => element.remove());

      chatbot.searchbar.disabled = false;
      chatbot.searchForm.classList.remove("disabled");

      scrollToBottom("chatbot-main");

      const resultData = data.results;
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
      if (data.conversationId) {
        sessionStorage.setItem("conversationId", data.conversationId);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// async function fetchId(ppn) {
//     try {
//         const response = await fetch(`${corsProxyUrl}https://zoeken.oba.nl/resolve.ashx?index=ppn&identifiers=${ppn}&authorization=ffbc1ededa6f23371bc40df1864843be`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         const bookId = data.id; // Assuming the response contains an 'id' field
//         console.log(bookId);
//         return bookId;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }

function placeholderImages() {
  const images = document.querySelectorAll("img");
  const placeholderImageUrl = "path/to/placeholder.jpg";

  images.forEach((image) => {
    const img = new Image();
    img.src = image.src;

    img.onload = () => {
      if (img.naturalWidth === 1 && img.naturalHeight === 1) {
        image.src = placeholderImageUrl;
      }
    };
  });
}

// Functie om naar de onderkant van het chatvenster te scrollen
function scrollToBottom(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const scrollTo = element.scrollHeight - element.clientHeight;

  // Smooth scroll
  element.scrollTo({
    top: scrollTo,
    behavior: "smooth",
  });
}

function openDetail(cover, titel, ppn, beschrijving, auteur) {
  // Zoek de bestaande elementen in de details sectie
  const imgElement = chatbot.details.querySelector("img.book-detail-cover");
  const titleElement = chatbot.details.querySelector("h2");
  const descriptionElement = chatbot.details.querySelector("p");
  const authorElement = chatbot.details.querySelector("h3");
  const bekijkDetail = document.querySelector(".bekijk-detail");

  // Pas de inhoud van de bestaande elementen aan
  if (imgElement) {
    imgElement.src = cover;
    imgElement.alt = titel;
  }

  if (titel) {
    titleElement.textContent = titel;
  }

  if (beschrijving) {
    descriptionElement.textContent = beschrijving;
  } else {
    descriptionElement.textContent = "geen beschrijving gevonden";
  }

  // if (auteur) {
  //     authorElement.textContent = "Auteur(s): " + auteur;
  // }

  if (bekijkDetail) {
    bekijkDetail.href = `https://zoeken.oba.nl/?itemid=%7Coba-catalogus%7C${ppn}`;
  }

  console.log(chatbot.details);
  // Display the details section and hide others
  chatbot.details.style.display = "grid";
  chatbot.filter.style.display = "none";
  chatbot.resultaten.style.display = "none";
  chatbot.detailterugbutton.addEventListener("click", closeDetail);
}

function closeDetail() {
  chatbot.details.style.display = "";
  chatbot.filter.style.display = "";
  chatbot.resultaten.style.display = "";
}

// Event listener voor de "new chat"-knop om de chat te wissen en opnieuw welkomsberichten te tonen
chatbot.newchatButton.addEventListener("click", function () {
  chatbot.newchatButton.style.display = "none";

  if ((chatbot.details.display = "grid")) {
    closeDetail();
  }
  sessionStorage.removeItem("conversationId");
  toggleSearchHeight("close");
  chatbot.main.innerHTML = "";
  document.getElementById("results-section").innerHTML = "";
  document.querySelector(".empty-state").classList.remove("hidden");
});

function toggleSearchHeight(state) {
  if (state == "open") {
    chatbot.main.style.height = "100%";
  } else if (state == "close") {
    chatbot.main.style.height = "0";
  } else {
    console.log("state is not defined properly: " + state);
  }
}

chatbot.searchForm.addEventListener("submit", function () {
  toggleSearchHeight("open");
  if ((chatbot.newchatButton.style.display = "none")) {
    chatbot.newchatButton.style.display = "flex";
  }
});

/*
const filterToggleButton = document.querySelector(".fold-filter");

filterToggleButton.addEventListener("click", function (event) {
    event.preventDefault();
    toggleFilterFold()
})


let filterfold = 0;

function toggleFilterFold() {
    const filterToggleButton = document.getElementById('filterToggleButton');
    const svgElement = filterToggleButton.querySelector('svg');

    if (filterfold === 0) {
        svgElement.style.transform = 'rotate(90deg)';
        filterfold = 1;
    } else if (filterfold === 1) {
        svgElement.style.transform = 'rotate(-90deg)';
        filterfold = 0;
    } else {
        console.log("failed toggleFilterFold");
    }
}
*/
