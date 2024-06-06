// Indicator om te kijken wanneer de chat gecleared is, zodat asynchrone functies stoppen wanneer de chat gecleared wordt
let chatCleared = false;
let timeouts = []; // Array om timeouts bij te houden

// Event listener om te zorgen dat de functies worden aangeroepen wanneer de DOM is geladen
document.addEventListener("DOMContentLoaded", function () {
  showWelcomeMessage();
});

// Functie om een typende indicatie te tonen

function showTypingBubble(isWelcomeMessage) {
  const typingBubble = document.createElement("div");
  typingBubble.className = "bubble typing";

  // Disable elements while typing bubble is shown
  document.getElementById("search-bar").disabled = true;
  document.querySelector(".search-form").classList.add("disabled");
  Array.from(
    document.getElementsByClassName("chat-button-grid")[0].children
  ).forEach((button) => {
    button.disabled = true;
  });

  // Add SVG to the typingBubble
  typingBubble.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
        <circle cx="4" cy="12" r="3" fill="#E61C24">
            <animate id="svgSpinners3DotsBounce0" attributeName="cy" begin="0;svgSpinners3DotsBounce1.end+0.25s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
        <circle cx="12" cy="12" r="3" fill="#E61C24">
            <animate attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
        <circle cx="20" cy="12" r="3" fill="#E61C24">
            <animate id="svgSpinners3DotsBounce1" attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
        </circle>
    </svg>
    `;

  const chatbotMain = document.getElementById("chatbot-main");
  chatbotMain.appendChild(typingBubble);

  if (isWelcomeMessage == "true") {
    // Remove typing indication after a certain time and enable the buttons along with search bar
    const timeout = setTimeout(() => {
      typingBubble.remove();

      // Enable elements back after removing typing bubble
      document.getElementById("search-bar").disabled = false;
      document.querySelector(".search-form").classList.remove("disabled");
      Array.from(
        document.getElementsByClassName("chat-button-grid")[0].children
      ).forEach((button) => {
        button.disabled = false;
      });
    }, 1500);
    timeouts.push(timeout); // Add timeout to the array
  }

  if (chatCleared) {
    chatCleared = false;
    return;
  }

  return typingBubble;
}

// Functie om bubbles te genereren
function createBubble(content, className) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${className}`;
  bubble.textContent = content;
  return bubble;
}

// Functie om welkomsberichten weer te geven
function showWelcomeMessage() {
  let delay = 0;
  const welcomeMessages = [
    "Welkom bij de zoekassistent van de OBA. Begin door uw zoekopdracht onderaan het scherm te typen.",
    // 'Tip: Je kunt ook boven in een knop aanklikken!'
  ];

  welcomeMessages.forEach((message) => {
    const timeout = setTimeout(() => {
      if (chatCleared) {
        chatCleared = false;
        return;
      }
      const typingBubble = showTypingBubble("true");
      const innerTimeout = setTimeout(() => {
        if (chatCleared) {
          chatCleared = false;
          return;
        }
        const bubble = createBubble(message, "left");
        document.getElementById("chatbot-main").appendChild(bubble);
      }, 1500);
      timeouts.push(innerTimeout); // Voeg de inner timeout toe aan de array
    }, delay);
    timeouts.push(timeout); // Voeg de timeout toe aan de array
    delay += 2000;
  });
}

// Event listener voor het versturen van de formulieren
document.querySelectorAll("form.suggested-form, form.search-form")
    .forEach((form) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const data = {};

      if (form.classList.contains("suggested-form")) {
        const formData = event.submitter.value;
        data["query"] = formData;
      } else if (form.classList.contains("search-form")) {
        const formData = new FormData(this);
        formData.forEach((value, key) => {
          data[key] = value;
        });

        const chatbotMain = document.getElementById("chatbot-main");
        const bubble = document.createElement("div");
        bubble.className = `right temporaryBubble`;
        bubble.innerHTML = `<p>${
          document.getElementById("search-bar").value
        }</p>`;
        chatbotMain.appendChild(bubble);
        document.getElementById("search-bar").value = "";
      }

      const typingBubble = showTypingBubble();
      document.querySelector(".empty-state").classList.add("hidden");

      document.getElementById("results-section").innerHTML = `
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>
        <article class="placeholder-loading-img"></article>`;

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

      // Versturen van de gegevens via een fetch-aanroep
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Verwijder bestaande chatbubbels
          const existingChats = document.querySelectorAll(".bubble");
          existingChats.forEach((chat) => chat.remove());

          // Voeg nieuwe berichten toe
          const messageData = data.messages;
          messageData.forEach((message) => {
            const chatbotMain = document.getElementById("chatbot-main");
            const bubble = document.createElement("div");
            bubble.className = `bubble ${message.class}`;
            bubble.innerHTML = `<p>${message.content}</p>`;
            chatbotMain.appendChild(bubble);
          });

          // Verwijder tijdelijke elementen
          const temporaryElements =
            document.querySelectorAll(".temporaryBubble");
          temporaryElements.forEach((element) => element.remove());

          // Enable elements back after removing typing bubble
          document.getElementById("search-bar").disabled = false;
          document.querySelector(".search-form").classList.remove("disabled");
          Array.from(
            document.getElementsByClassName("chat-button-grid")[0].children
          ).forEach((button) => {
            button.disabled = false;
          });

          // Scroll naar onderaan de chatbot
          scrollToBottom("chatbot-main");

          // Voeg resultaten toe aan de results section
          const resultData = data.results;
          const resultsSection = document.getElementById("results-section");
          resultsSection.innerHTML = ""; // Maak de results section leeg voordat je nieuwe resultaten toevoegt
          resultData.forEach((result) => {
            console.log(result.document);

            // Maak een nieuw article element
            const article = document.createElement("article");

            // Maak en voeg de img toe
            const img = document.createElement("img");
            img.src = result.document.coverUrl;
            img.alt = "book cover";
            article.appendChild(img);

            // Maak en voeg de h5 toe
            const h5 = document.createElement("h5");
            h5.textContent = result.document.titel;
            article.appendChild(h5);

            // Voeg het article toe aan de results section
            resultsSection.appendChild(article);
          });
        })
        .catch((error) => console.error("Error:", error));
      document.getElementById("suggested-form").classList.add("hidden");
    });
  });

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

// Event listener voor de "new chat"-knop om de chat te wissen en opnieuw welkomsberichten te tonen
const newChatButton = document.getElementById("new-chat-button");
newChatButton.addEventListener("click", function () {
  document.getElementById("chatbot-main").innerHTML = "";
  document.getElementById("results-section").innerHTML = "";
  document.querySelector(".empty-state").classList.remove("hidden");

  chatCleared = true;

  // Annuleer alle timeouts
  timeouts.forEach((timeout) => clearTimeout(timeout));
  timeouts = []; // Leeg de array

  // Reset chatCleared en start welkomsberichten opnieuw
  chatCleared = false;
  document.getElementById("suggested-form").classList.remove("hidden");
  showWelcomeMessage();
});
