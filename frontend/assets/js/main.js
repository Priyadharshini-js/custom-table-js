import {
    TableComponent,
} from "./tableComponentRender.js"
import { columns } from "../config/columnConfig.js";

// base url for fetching data
const BASE_URL = "http://localhost:3000/users";

export async function fetchUsers() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return await response.json();
}

//initializing table
function init() {
    const tableContainer = document.querySelector('.table-container');
    TableComponent(tableContainer, columns, fetchUsers);

}

document.addEventListener('DOMContentLoaded', init);
