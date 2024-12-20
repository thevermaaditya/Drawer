const pgNum = document.querySelector(".pgNum");
const prevPageButton = document.querySelector(".prevPage");
const nextPageButton = document.querySelector(".nextPage");
let allPage = new Array();

let currentPage = 0;

nextPageButton.addEventListener('click', () => {
    if (currentPage < allPage.length - 1) {
        currentPage++;
        loadPage(currentPage);
    } else {
        let dataToSave = canvas.toDataURL();
        if (allPage[currentPage] != dataToSave) {
            allPage.push(dataToSave);
            console.log(`${currentPage}, saved and created new page`);
            currentPage++;
            pgNum.innerText = "Page: " + currentPage;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            currentPage++;
            pgNum.innerText = "Page: " + currentPage;
        }


    }
    console.log("AllPage Length: ", allPage.length);
});

prevPageButton.addEventListener('click', () => {
    if (currentPage == allPage.length) {
        let dataToSave = canvas.toDataURL();
        allPage.push(dataToSave);
        currentPage--;
        loadPage(currentPage);
    }
    else {
        currentPage--;
        loadPage(currentPage);
    }
    console.log("AllPage Length: ", allPage.length);
});
//----------------------------------------
function loadPage(pageIndex) {
    let dataToLoad = allPage[pageIndex];
    if (dataToLoad) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dt = new Image();
        dt.src = dataToLoad;
        dt.onload = () => {
            ctx.drawImage(dt, 0, 0);
        }
    }
    pgNum.innerText = "Page: " + pageIndex;
    console.log(pageIndex);
}