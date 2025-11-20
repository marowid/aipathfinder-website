// Add the grid overlay if the URL contains the query parameter "?grid"
export default function initGrid() {
    const main = document.querySelector("main");
    const urlParams = new URLSearchParams(window.location.search);
    const isGridActive = urlParams.has("grid");

    if (isGridActive) {
        // Create the container div with the "row" and "active" classes
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row", "row--grid");

        // Define an array of class configurations for each column div
        const colClasses: string[][] = [];

        for (let i = 1; i <= 24; i++) {
            colClasses.push(["col", "col-1"]);
        }

        colClasses.forEach((classes: string[]) => {
            const colDiv = document.createElement("div");
            colDiv.classList.add(...classes);
            rowDiv.appendChild(colDiv);
        });

        main?.appendChild(rowDiv);
    }
}
