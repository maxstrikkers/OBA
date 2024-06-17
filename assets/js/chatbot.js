// Wis de sessionStorage bij het laden van de pagina
window.onload = function () {
    sessionStorage.removeItem('conversationId');
};


//chatbot component variables
const chatbot = {
    main: document.getElementById("chatbot-main"),
    searchbar: document.getElementById("search-bar"),
    // suggestedForm: document.getElementById("suggested-form"),
    searchForm: document.querySelector(".search-form"),
    newchatButton: document.getElementById("new-chat-button"),
    detailterugbutton: document.getElementById("terugbutton"),
    resultaten: document.getElementById('resultaten'),
    details: document.getElementById('details'),
    filter: document.getElementById('filter')
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
    chatbot.main.appendChild(typingBubble);
    return typingBubble;
}


// Event listener voor het versturen van de formulieren
chatbot.searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = {};

    createTempBubbles(chatbot.searchForm, data);
    showTypingBubble();

    placeholderResults()

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
        <p class="placeholder-loading-p">Ik ben bezig met zoeken. Een momentje alsjeblieft...</p>
        <svg class="placeholder-loading-svg" xmlns="http://www.w3.org/2000/svg" width="10em" height="10em" viewBox="0 0 24 24"><path fill="var(--primary-dark-gray" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5"/><path fill="var(--primary-red)" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
    `;
}

function submitFormData(url, data) {
    const conversationId = sessionStorage.getItem('conversationId'); // Haal de conversationId op uit sessionStorage
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

            //
            //rating stars
            //


            // Example logic to capture user's rating
            const ratingFormStars = document.querySelectorAll('.rating-form input[type="radio"]');

            function captureRating() {
                let rating = 0;
                let anyChecked = false;

                ratingFormStars.forEach((star, index) => {
                    if (star.checked) {
                        anyChecked = true;
                        rating = index + 1; // Set rating to the position (index + 1) of the checked star
                    }
                });

                if (anyChecked) {
                    addToDataObject(rating);
                } else {
                    console.log("No star checked");
                }
            }
            captureRating()

            // Event listener for handling page unload (close, refresh, navigate away)
            window.addEventListener('beforeunload', function (event) {
                // Check if any star is checked before unloading
                let anyChecked = false;
                ratingFormStars.forEach(star => {
                    if (star.checked) {
                        anyChecked = true;
                    }
                });

                // If any star is checked, add a new prompt before unloading
                if (anyChecked) {
                    addToDataObject(0); // Assuming a default rating of 0 if no star is selected
                }
            });


            //
            // existing chat removal
            //

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
                article.classList.add('book-result');
                const img = document.createElement("img");
                img.src = result.document.coverUrl;
                img.alt = "book cover";


                const ppn = result.document.ppn; // Replace with your actual ppn value

                const bookId = `https://zoeken.oba.nl/resolve.ashx?index=ppn&identifiers=${ppn}&authorization=ffbc1ededa6f23371bc40df1864843be`;


                img.addEventListener('load', function () {

                    if (img.naturalWidth == 1 && img.naturalHeight == 1) {
                        img.src = "./img/no-cover.jpeg";
                        result.document.coverUrl = "./img/no-cover.jpeg";
                    }

                    img.onerror = function () {
                        img.src = "./img/no-cover.jpeg";
                    };

                });

                article.appendChild(img);

                const h5 = document.createElement("h5");
                h5.textContent = result.document.titel;
                article.appendChild(h5);

                resultsSection.appendChild(article);

                article.addEventListener('click', () => {
                    openDetail(result.document.coverUrl, result.document.titel, bookId, result.document.beschrijving, result.document.auteur);
                    console.log('added eventlistener')
                });

            });

            showTypingBubble();
            setTimeout(() => {
                addLogging();
            }, "3000");

            if (data.conversationId) {
                sessionStorage.setItem('conversationId', data.conversationId);
            }
        })
        .catch((error) => console.error("Error:", error));
}

//Add logging review stars in chat

function addLogging() {
    var form = document.createElement('form');
    form.classList.add('rating-form', 'temporaryBubble', 'left');
    var fieldset = document.createElement('fieldset');
    var legend = document.createElement('legend');
    legend.textContent = 'Geef dit antwoord een cijfer.';

    // Append legend to fieldset
    fieldset.appendChild(legend);

    // Create and append radio inputs and labels
    for (var i = 1; i <= 5; i++) {
        var input = document.createElement('input');
        input.classList.add("rating-input");
        input.type = 'radio';
        input.name = 'rating';
        input.id = 'rating' + i;
        input.value = i + ' ster' + (i > 1 ? 'ren' : '');

        var label = document.createElement('label');
        label.htmlFor = 'rating' + i;
        label.setAttribute('aria-label', i + ' ster' + (i > 1 ? 'ren' : ''));

        fieldset.appendChild(input);
        fieldset.appendChild(label);
    }
    form.appendChild(fieldset);

    chatbot.main.appendChild(form);

//
// Remove typing bubble
//
    const typingBubble = document.querySelector(".bubble.typing");
    if (typingBubble) {
        typingBubble.remove();
        chatbot.searchbar.disabled = false;
        chatbot.searchForm.classList.remove("disabled");
    }
}

//
// Add to data object function
//

let dataObject = {}; 
let currentTimestamp = ''; 
let nextPromptIndex = 1;


function addToDataObject(rating) {

    if (!currentTimestamp) {
        createNewTimestamp(); 
    }

    const promptName = `prompt ${nextPromptIndex}`;
    dataObject[currentTimestamp][promptName] = {
        date: new Date().toLocaleDateString('en-GB'), 
        time: new Date().toLocaleTimeString('en-GB'), 
        conversationhistory: [], 
        results: [], 
        rating: rating.toString() 
    };

    console.log(`New prompt ${promptName} added at ${currentTimestamp} with rating ${rating}`);
    console.log(dataObject);

    nextPromptIndex++; 
}

// Function to create a new timestamped object in dataObject
function createNewTimestamp() {
    currentTimestamp = new Date().toLocaleString('en-GB'); 
    dataObject[currentTimestamp] = {}; 
    nextPromptIndex = 1; 
    console.log(`New timestamp created: ${currentTimestamp}`);
}



function placeholderImages() {
    const images = document.querySelectorAll('img');
    const placeholderImageUrl = 'path/to/placeholder.jpg';

    images.forEach(image => {
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

function openDetail(cover, titel, bookId, beschrijving, auteur) {

    // Zoek de bestaande elementen in de details sectie
    const imgElement = chatbot.details.querySelector('img.book-detail-cover');
    const titleElement = chatbot.details.querySelector('h2');
    const descriptionElement = chatbot.details.querySelector('p');
    const authorElement = chatbot.details.querySelector('h3');
    const bekijkDetail = document.querySelector('.bekijk-detail');

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
        descriptionElement.textContent = "geen beschrijving gevonden"
    }

    // if (auteur) {
    //     authorElement.textContent = "Auteur(s): " + auteur;
    // }

    if (bekijkDetail) {
        bekijkDetail.href = bookId;
    }

    console.log(chatbot.details);
    // Display the details section and hide others
    chatbot.details.style.display = 'grid';
    chatbot.filter.style.display = 'none';
    chatbot.resultaten.style.display = 'none';
    chatbot.detailterugbutton.addEventListener("click", closeDetail)
}

function closeDetail() {
    chatbot.details.style.display = "";
    chatbot.filter.style.display = "";
    chatbot.resultaten.style.display = "";
}

// Event listener voor de "new chat"-knop om de chat te wissen en opnieuw welkomsberichten te tonen
chatbot.newchatButton.addEventListener("click", function () {
    chatbot.newchatButton.style.display = "none";
    createNewTimestamp()

    if (chatbot.details.display = "grid") {
        closeDetail()
    }
    sessionStorage.removeItem('conversationId');
    toggleSearchHeight("close");
    chatbot.main.innerHTML = "";
    document.getElementById("results-section").innerHTML = "";
    document.querySelector(".empty-state").classList.remove("hidden");
});

function toggleSearchHeight(state) {
    if (state == "open") {
        chatbot.main.style.height = "100%"
    } else if (state == "close") {
        chatbot.main.style.height = "0"
    } else {
        console.log("state is not defined properly: " + state)
    }
}

chatbot.searchForm.addEventListener("submit", function () {
    toggleSearchHeight("open");
    if (chatbot.newchatButton.style.display = "none") {
        chatbot.newchatButton.style.display = "flex";
    }
})

