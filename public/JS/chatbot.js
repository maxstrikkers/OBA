function addChatBubble(text, side){
    const chat = document.getElementById('chatbotMain');
    const newBubble = document.createElement("div");
    newBubble.className = `bubble ${side}`;
    newBubble.innerHTML = text;
    chat.appendChild(newBubble);
}

document.addEventListener("DOMContentLoaded", function() {
    const buttonGrid = document.querySelector(".chatButtonGrid");
    const buttons = buttonGrid.querySelectorAll("button");
    const chatbotMain = document.getElementById('chatbotMain');

    buttons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();

            const buttonGridHeight = buttonGrid.offsetHeight;
            document.querySelector(".chatButtonGrid").classList.add('hidden');
            
            // Add the height of the buttonGrid to chatbotMain
            chatbotMain.style.height = (chatbotMain.offsetHeight + buttonGridHeight) + 'px';

            console.log(button.value);
            addChatBubble(button.value, "right");
            
        });
    });

    const searchForm = document.querySelector(".searchForm");
    const searchInput = searchForm.querySelector("input");

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log(searchInput.value);
        addChatBubble(searchInput.value, "right")
        searchInput.value = ""
    });

    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (searchInput.value) {
            console.log(searchInput.value);
            addChatBubble(searchInput.value, "right")
            searchInput.value = ""
            }
        }
    });
});