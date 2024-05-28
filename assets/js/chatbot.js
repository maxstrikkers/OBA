
// Functie om er voor te zorgen dat er een aan het typen indicatie verschijnt.
function showTypingBubble() {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'bubble typing';
    const searchBar = document.getElementById('search-bar');
    searchBar.disabled = true;
    // Voeg de SVG rechtstreeks toe aan de typingBubble
    typingBubble.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <circle cx="4" cy="12" r="3" fill="currentColor">
                <animate id="svgSpinners3DotsBounce0" attributeName="cy" begin="0;svgSpinners3DotsBounce1.end+0.25s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
            </circle>
            <circle cx="12" cy="12" r="3" fill="currentColor">
                <animate attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
            </circle>
            <circle cx="20" cy="12" r="3" fill="currentColor">
                <animate id="svgSpinners3DotsBounce1" attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12" />
            </circle>
        </svg>
    `;

    document.getElementById('chatbot-main').appendChild(typingBubble);

    setTimeout(() => {
        typingBubble.remove();
        searchBar.disabled = false;
    }, 2000);

    return typingBubble;
}

// Functie om de standaard berichten te genereren (Welkom bij... en Tip: je...)
function createBubble(content, className) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${className}`;
    bubble.textContent = content;
    return bubble;
}

function showWelcomeMessage() {
    let delay = 0;
    const welcomeMessages = ['Welkom. Ik ben de B1EB-BOT en ik ben hier om je te begeleiden. Begin door hieronder je zoekopdracht in te typen.', 'Tip: Je kunt ook hieronder een knop aanklikken!' ]
    
    welcomeMessages.forEach(message => {
        setTimeout(() => {
            const typingBubble = showTypingBubble();
            setTimeout(() => {
                const bubble = createBubble(message, 'left');
                document.getElementById('chatbot-main').appendChild(bubble);
            }, 2000);
        }, delay);
        delay += 3000;
    });
}

// Event listener om te zorgen dat de functies worden aangeroepen wanneer de DOM is geladen
document.addEventListener("DOMContentLoaded", function() {
    showWelcomeMessage()
});


document.querySelectorAll('form.suggested-form, form.search-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const data = {};
        console.log(form)

        if (form.classList.contains('suggested-form')) {
            const formData = event.submitter.value;
            data['query'] = formData;
            form.classList.add('hidden');
        } else if (form.classList.contains('search-form')) {
            const formData = new FormData(this);
            formData.forEach((value, key) => {
                data[key] = value;
            });
            document.getElementById('search-bar').value = ''
        }
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
        const url = this.action;

        data.bubbles = bubbleData;

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
            scrollToBottom('chatbot-main')
        })
        .catch(error => console.error('Error:', error));
    });
});



function scrollToBottom(elementId) {
    var element = document.getElementById(elementId);
    if (!element) return;

    var scrollTo = element.scrollHeight - element.clientHeight;

    // Smooth scroll
    element.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
    });
}