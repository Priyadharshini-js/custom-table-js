import { displayBufferedUsers } from "./rowRender.js";
import { columns } from "../config/columnConfig.js";
import { tableState } from './tableComponentRender.js'

// handle search function
export function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    const loading = document.getElementById('loading');

    tableState.isLoading = true;
    loading.style.display = 'block';
    tableState.isFiltering = !!searchTerm;

    // Remove "No data found" message if it exists
    const noResultMessage = tableBody.querySelector('.grid-table-body');
    if (noResultMessage) {
        noResultMessage.remove();
    }

    //search box is empty
    if (!searchTerm) {
        tableState.filteredData = null;
        tableState.currentIndex = 0;
        tableBody.scrollTop = 0;
        displayBufferedUsers();
        tableState.isLoading = false;
        loading.style.display = 'none';
        return;
    }

    const searchableKeys = columns.map(col => col.key);

    const filteredUsers = tableState.allDatas.filter(user => {
        return searchableKeys.some(key => {
            const value = user[key];
            return value !== undefined && String(value).toLowerCase().includes(searchTerm);
        });
    });

    tableBody.scrollTop = 0;


    if (filteredUsers.length === 0) {
        // const existingRows = Array.from(tableBody.children);
        // existingRows.forEach(row => row.style.display = 'none');

        const wrapper = tableBody.querySelector('.table-body-wrapper');
        if (wrapper) {
            const existingRows = Array.from(wrapper.children);
            existingRows.forEach(row => row.style.display = 'none');
        }


        const noResult = document.createElement('div');
        noResult.className = 'grid-table-body';
        noResult.textContent = 'No datas found.';
        tableBody.appendChild(noResult);
        tableBody.style.height = 'auto';
    } else {
        tableBody.scrollTop = 0;
        tableState.filteredData = filteredUsers;
        displayBufferedUsers();

        console.log("row", filteredUsers)

    }

    tableState.isLoading = false;
    loading.style.display = 'none';
}