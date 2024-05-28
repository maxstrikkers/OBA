// function addChatBubble(text, side) {
//     const chat = document.getElementById('chatbot-main');
//     const newBubble = document.createElement("div");
//     newBubble.className = `bubble ${side}`;
//     newBubble.innerHTML = text;
//     chat.appendChild(newBubble);
// }

// document.addEventListener("DOMContentLoaded", function() {
//     const buttonGrid = document.querySelector(".chat-button-grid");
//     const buttons = buttonGrid.querySelectorAll("button");
//     const chatbotMain = document.getElementById('chatbot-main');
//     console.log("js loaded")

//     buttons.forEach(button => {
//         button.addEventListener("click", function(event) {
//             const buttonGridHeight = buttonGrid.offsetHeight;
//             document.querySelector(".chat-button-grid").classList.add('hidden');
            
//             // Add the height of the buttonGrid to chatbotMain
//             chatbotMain.style.height = (chatbotMain.offsetHeight + buttonGridHeight) + 'px';

//             console.log(button.value);
//             addChatBubble(button.value, "right");
            
//         });
//     });

//     const searchForm = document.querySelector(".search-form");
//     const searchInput = searchForm.querySelector("input");

//     searchForm.addEventListener("submit", function(event) {
//         console.log(searchInput.value);
//         addChatBubble(searchInput.value, "right");
//         searchInput.value = "";
//     });

//     searchInput.addEventListener("keydown", function(event) {
//         if (event.key === "Enter") {
//             event.preventDefault();
//             if (searchInput.value) {
//                 console.log(searchInput.value);
//                 addChatBubble(searchInput.value, "right");
//                 searchInput.value = "";
//             }
//         }
//     });
// });


document.querySelectorAll('form.suggested-form, form.search-form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

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

        const formData = new FormData(this);
        const url = this.action;

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

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
        })
        .catch(error => console.error('Error:', error));
    });
});
