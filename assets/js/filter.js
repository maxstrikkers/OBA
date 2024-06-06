(function() {
    const chatbot = {
        main: document.getElementById("chatbot-main"),
        searchbar: document.getElementById("search-bar"),
        searchForm: document.querySelector(".search-form"),
        newchatButton: document.getElementById("new-chat-button"),
        filterForm: document.querySelector(".filter")
    };

    chatbot.filterForm.classList.add("hidden");

    function toggleSearchHeight(state) {
        if (state == "open") {
            chatbot.main.style.height = "100%";
        } else if (state == "close") {
            chatbot.main.style.height = "0";
        } else {
            console.log("state is not defined properly: " + state);
        }
    }

    chatbot.searchForm.addEventListener("submit", function() {
        toggleSearchHeight("open");
        chatbot.filterForm.classList.remove("hidden");
    });
})();