// Indicator om te kijken wanneer de chat gecleared is, zodat asynchrone functies stoppen wanneer de chat gecleared wordt
let chatCleared = false;
let timeouts = []; // Array om timeouts bij te houden

// Event listener om te zorgen dat de functies worden aangeroepen wanneer de DOM is geladen
document.addEventListener("DOMContentLoaded", function() {
    showWelcomeMessage();
});

// Functie om een typende indicatie te tonen
function showTypingBubble() {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble typing';
    // Maakt de searchbar en de suggested knoppen disabled als de bot aan het typen is
    document.getElementById('search-bar').disabled = true;
    Array.from(document.getElementsByClassName('chat-button-grid')[0].children).forEach(button =>{
        button.disabled = true;
    })
    
    // Voeg de SVG rechtstreeks toe aan de typingBubble
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
    
    const chatbotMain = document.getElementById('chatbot-main');
    chatbotMain.appendChild(typingBubble);

    // Verwijder de typende indicatie na een bepaalde tijd en zet de buttons samen met search bar weer op enabled
    const timeout = setTimeout(() => {
        document.getElementById('search-bar').disabled = false;
        Array.from(document.getElementsByClassName('chat-button-grid')[0].children).forEach(button =>{
            button.disabled = false;
        })
        if (chatCleared) {
            chatCleared = false;
            return;
        }
        typingBubble.remove();
    }, 1500);
    
    timeouts.push(timeout); // Voeg de timeout toe aan de array

    return typingBubble;
}

// Functie om bubbles te genereren
function createBubble(content, className) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${className}`;
    bubble.textContent = content;
    return bubble;
}

// Functie om welkomsberichten weer te geven
function showWelcomeMessage() {
    let delay = 0;
    const welcomeMessages = [
        'Welkom. Ik ben de B1EB-BOT en ik ben hier om je te begeleiden. Begin door boven in je zoekopdracht in te typen.',
        'Tip: Je kunt ook boven in een knop aanklikken!'
    ];

    welcomeMessages.forEach(message => {
        const timeout = setTimeout(() => {
            if (chatCleared) {
                chatCleared = false;
                return;
            }
            const typingBubble = showTypingBubble();
            const innerTimeout = setTimeout(() => {
                if (chatCleared) {
                    chatCleared = false;
                    return;
                }
                const bubble = createBubble(message, 'left');
                document.getElementById('chatbot-main').appendChild(bubble);
            }, 1500);
            timeouts.push(innerTimeout); // Voeg de inner timeout toe aan de array
        }, delay);
        timeouts.push(timeout); // Voeg de timeout toe aan de array
        delay += 2000;
    });
}

// Event listener voor het versturen van de formulieren
document.querySelectorAll('form.suggested-form, form.search-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const data = {};

        if (form.classList.contains('suggested-form')) {
            const formData = event.submitter.value;
            data['query'] = formData;
        } else if (form.classList.contains('search-form')) {
            const formData = new FormData(this);
            formData.forEach((value, key) => {
                data[key] = value;
            });
            document.getElementById('search-bar').value = '';
        }

        // Verzamelen van bestaande chatbubbels
        const bubbles = document.querySelectorAll('.bubble');
        let bubbleData = [];
        bubbles.forEach(bubble => {
            const isRight = bubble.classList.contains('right');
            const isLeft = bubble.classList.contains('left');
            if (isRight || isLeft) {
                bubbleData.push({
                    content: bubble.innerText,
                    class: isRight ? 'right' : 'left'
                });
            }
        });

        data.bubbles = bubbleData;
        const url = this.action;

        // Versturen van de gegevens via een fetch-aanroep
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(html => {
            document.getElementById('chatbot-main').innerHTML = html;
            scrollToBottom('chatbot-main');
        })
        .catch(error => console.error('Error:', error));

        document.getElementById('suggested-form').classList.add('hidden');
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
        behavior: 'smooth'
    });
}

// Event listener voor de "new chat"-knop om de chat te wissen en opnieuw welkomsberichten te tonen
const newChatButton = document.getElementById('new-chat-button');
newChatButton.addEventListener('click', function() {
    document.getElementById('chatbot-main').innerHTML = '';
    chatCleared = true;
    
    // Annuleer alle timeouts
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = []; // Leeg de array

    // Reset chatCleared en start welkomsberichten opnieuw
    chatCleared = false;
    document.getElementById('suggested-form').classList.remove('hidden');
    showWelcomeMessage();
});
