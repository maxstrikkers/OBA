// Wis de sessionStorage bij het laden van de pagina
window.onload = function () {
    sessionStorage.removeItem("conversationId");
    history.replaceState(null, null, window.location.pathname + window.location.search);
};


//chatbot component variables
const chatbot = {
    main: document.getElementById("chatbot-main"),
    searchbar: document.getElementById("search-bar"),
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

    chatbot.searchbar.disabled = true;
    chatbot.newchatButton.disabled = true
    chatbot.searchForm.classList.add("disabled");

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

// removes all typing bubbles whenever it is called and enables searching
function removeTypingBubbles() {
    chatbot.searchbar.disabled = false;
    chatbot.searchForm.classList.remove("disabled");

    const typingBubbles = document.querySelectorAll(".bubble.typing");

    typingBubbles.forEach(typingBubble => {
        typingBubble.remove();
    });
    chatbot.searchbar.disabled = false;
    chatbot.newchatButton.disabled = false
    chatbot.searchForm.classList.remove("disabled");
}


// Event listener for sending the searchform
chatbot.searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = {};

    document.querySelector(".body-wrapper").style.height = "calc(100vh - var(--header-height) - var(--header-margin) * 2)";

    createTempBubbles(chatbot.searchForm, data);
    showTypingBubble();

    placeholderResults();

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

// create a temporary bubble of your prompt. (it is removed when the data is loaded in and replaced with the actual data)
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

// placeholder results animation
function placeholderResults() {
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

// Define data globally
let data = {};

// Function to submit form data
function submitFormData(url, formData) {
    const conversationId = sessionStorage.getItem('conversationId');
    if (conversationId) {
        formData.conversationId = conversationId;
    }
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then((response) => response.json())
    .then((responseData) => {
        const existingChats = document.querySelectorAll(".bubble");
        existingChats.forEach((chat) => chat.remove());


        data = responseData;

        const messageData = responseData.messages;
        messageData.forEach((message) => {
            const bubble = document.createElement("div");
            bubble.className = `bubble ${message.class}`;
            bubble.innerHTML = `<p>${formatText(message.content)}</p>`;
            chatbot.main.appendChild(bubble);
        });

        const temporaryElements = document.querySelectorAll(".temporaryBubble");
        temporaryElements.forEach((element) => element.remove());

        chatbot.searchbar.disabled = false;
        chatbot.searchForm.classList.remove("disabled");
        scrollToBottom("chatbot-main");

        const resultData = responseData.results;
        const resultsSection = document.getElementById("results-section");

        resultsSection.innerHTML = "";
        resultData.forEach((result) => {
            const article = document.createElement("article");
            article.classList.add("book-result");
            const img = document.createElement("img");
            img.src = result.document.coverUrl;
            img.alt = "book cover";

            const ppn = result.document.ppn;
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
            h5.textContent = result.document.titel.length > 40 ? result.document.titel.substring(0, 40) + "..." : result.document.titel;
            article.appendChild(h5);

            resultsSection.appendChild(article);

            article.addEventListener('click', () => {
                openDetail(result.document.coverUrl, result.document.titel, bookId, result.document.beschrijving, result.document.auteur);
                // console.log('added eventlistener');
            });
        });

        showTypingBubble();
        setTimeout(() => {
            addLogging();
        }, 1500);

        if (responseData.conversationId) {
            sessionStorage.setItem('conversationId', responseData.conversationId);
        }
    })
    .catch((error) => console.error("Error:", error));
}

let formData = {
    ratings: []
};

// add rating stars after a prompt
function addLogging() {
    var form = document.createElement('form');
    form.classList.add('rating-form', 'temporaryBubble', 'left');
    var fieldset = document.createElement('fieldset');
    var legend = document.createElement('legend');
    legend.textContent = 'Geef dit antwoord een cijfer.';

    fieldset.appendChild(legend);

    for (var i = 1; i <= 5; i++) {
        var input = document.createElement('input');
        input.classList.add("rating-input");
        input.type = 'radio';
        input.id = 'star' + i;
        input.name = 'rating';
        input.value = i;

        var label = document.createElement('label');
        label.classList.add("rating-label");
        label.htmlFor = 'star' + i;

        fieldset.appendChild(input);
        fieldset.appendChild(label);
    }

    form.appendChild(fieldset);
    chatbot.main.appendChild(form);

    const ratingInputs = document.querySelectorAll(".rating-input");
    ratingInputs.forEach((input) => {
        input.addEventListener('click', handleRatingClick);
    });
    removeTypingBubbles();
}


let dataObject = {};
let currentTimestamp = ''; 
let nextPromptIndex = 1; 



function handleRatingClick(event) {
    const rating = event.target.value; 
    // console.log(data)
    const resultsData = data.results;
    const messageData = data.messages;
    addToDataObject(rating, messageData, resultsData);
}

// add data to dataobject for logging to server
function addToDataObject(rating, messageData, resultsData) {
    if (!currentTimestamp) {
        createNewTimestamp(); // Ensure a timestamp is created if it doesn't exist
    }

    // console.log(messageData)

    const promptName = `prompt ${nextPromptIndex}`;
    if (!dataObject[currentTimestamp]) {
        dataObject[currentTimestamp] = {}; // Initialize if not already
    }
    dataObject[currentTimestamp][promptName] = {
        date: new Date().toLocaleDateString('nl-NL'),
        time: new Date().toLocaleTimeString('nl-NL'),
        conversationId: sessionStorage.getItem('conversationId'),
        conversationhistory: messageData,
        results: resultsData,
        rating: rating.toString()
    };

    console.log(dataObject); // Debugging

    sendLogToServer(dataObject); // Send data to server
    nextPromptIndex++; // Increment prompt index for next entry

    // Hide rating form after rating is selected
    const ratingForm = document.querySelector('.rating-form');
    if (ratingForm) {
        ratingForm.style.display = 'none';
    }
}

function sendLogToServer(logData) {
    fetch('/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Log sent successfully');
    })
    .catch(error => {
        console.error('Error sending log:', error);
    });
}

//creates a new timestamp for logging when clicking into a new chat
function createNewTimestamp() {
    currentTimestamp = new Date().toLocaleString('en-GB'); 
    dataObject[currentTimestamp] = {}; 
    nextPromptIndex = 1;
}


// change problematic images to placeholders
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

// scroll to bottom of element with id
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

//open details page and load it dynamically
function openDetail(cover, titel, booklink, beschrijving, auteur) {
    // Zoek de bestaande elementen in de details sectie
    const imgElement = chatbot.details.querySelector("img.book-detail-cover");
    const titleElement = chatbot.details.querySelector("h2");
    const descriptionElement = chatbot.details.querySelector("p");
    // const authorElement = chatbot.details.querySelector("h3");
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
        bekijkDetail.href = booklink;
    }

    // console.log(chatbot.details);
    // Display the details section and hide others
    chatbot.details.style.display = "grid";
    chatbot.filter.style.display = "none";
    chatbot.resultaten.style.display = "none";
    chatbot.detailterugbutton.addEventListener("click", closeDetail);

    window.location.hash = '#details'

    window.addEventListener('popstate', handleBackPress)
}

function closeDetail() {
    chatbot.details.style.display = "";
    chatbot.filter.style.display = "";
    chatbot.resultaten.style.display = "";

    history.replaceState(null, null, window.location.pathname + window.location.search);
    window.removeEventListener('popstate', handleBackPress)
}

function handleBackPress(event) {
    closeDetail()
}

// Event listener voor de "new chat"-knop om de chat te wissen en opnieuw welkomsberichten te tonen
chatbot.newchatButton.addEventListener("click", function () {
    chatbot.newchatButton.style.display = "none";
    createNewTimestamp()

    if ((chatbot.details.display = "grid")) {
        closeDetail();
    }
    sessionStorage.removeItem("conversationId");
    toggleSearchHeight("close");
    chatbot.main.innerHTML = "";
    document.querySelector(".body-wrapper").style.height = "auto"
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

function formatText(text) {
    // Vervang ** met <b> en </b>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    // Voeg een <br> toe na de eerste dubbele punt
    formattedText = formattedText.replace(/(:\s*)/, '$1<br>');

    // Voeg een <br> toe voor elk genummerd item
    formattedText = formattedText.replace(/(\d+\..*?)(?=(\s*\d+\.)|$)/g, '<br>$1<br>');
    
    // Vervang " met <b></b>
    formattedText = formattedText.replace(/"(.*?)"/g, '<b>$1</b>');
    return formattedText;
}
