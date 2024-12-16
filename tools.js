const toolsButton = document.querySelector("#tool-button");
let isOpen = false;

toolsButton.addEventListener("click", () => {
    const toolsItems = document.querySelector(".toolsItems");
    // toolsItems.classList.add("show");
    if (!isOpen) {
        isOpen = true;
        toolsButton.firstChild.src = "./icons/close.png";
        toolsItems.style.visibility = 'visible';
    }
    else {
        isOpen = false;
        toolsItems.style.visibility = 'hidden';
        toolsButton.firstChild.src = "./icons/tools.png";
    }
})