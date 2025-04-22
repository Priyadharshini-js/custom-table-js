import {
    fetchData,
    renderTableHeader,
    displayBufferedUsers,
    handleSearch,
    handleScroll,
    setupSorting,
    resetTable
} from "./tableComponentRender.js"

let tableBodyRef;

function init() {
    renderTableHeader();
    fetchData().then(setupSorting);
    resetTable();

    document.getElementById("resetButton").addEventListener("click", resetTable);
}

document.addEventListener('DOMContentLoaded', init);
