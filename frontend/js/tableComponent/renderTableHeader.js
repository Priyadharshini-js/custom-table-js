import { setupSorting } from "./setupSorting.js";
import { sortData } from "../utils/helper.js";
import { displayBufferedUsers } from "./rowRender.js";

//table header rendering
export function renderTableHeader(tableContainer, columns, tableState) {
    const gridTable = tableContainer.querySelector('.grid-table');

    const headerRow = document.createElement('div');
    headerRow.className = 'grid-table-header';

    const columnWidths = columns.map(col => col.width).join(' ');


    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = columnWidths;

    columns.forEach(col => {
        const headerCell = document.createElement('div');
        headerCell.textContent = col.label;


        if (col.searchable) {
            const searchWrapper = document.createElement('div');
            searchWrapper.className = 'column-search-wrapper';

            const searchIcon = document.createElement('img');
            searchIcon.src = 'assets/images/search-icon.svg';
            searchIcon.className = 'search-icon';

            const closeIcon = document.createElement('span');
            closeIcon.textContent = '×';
            closeIcon.className = 'close-icon';
            closeIcon.style.display = 'none';

            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = `Search ${col.label}`;
            searchInput.className = 'column-search-input';
            searchInput.style.display = 'none';

            // Show input and hide icon
            searchIcon.addEventListener('click', () => {
                searchInput.value = '';
                searchIcon.style.display = 'none';
                searchInput.style.display = 'inline-block';
                closeIcon.style.display = 'inline-block';
            });

            // Hide input and show icon
            closeIcon.addEventListener('click', () => {
                searchInput.style.display = 'none';
                searchIcon.value = '';
                closeIcon.style.display = 'none';
                searchIcon.style.display = 'inline-block';

                // Clear column filter
                tableState.filteredData = null;
                tableState.currentIndex = 0;

                // Remove "No data found" message if it exists
                const tableBody = document.getElementById('table-body');
                const noResultMessage = tableBody.querySelector('.grid-table-body');
                if (noResultMessage) {
                    noResultMessage.remove();
                }

                displayBufferedUsers(tableState);

            });

            // Column search input
            searchInput.addEventListener('input', (e) => {
                const columnSearchTerm = e.target.value.toLowerCase();
                const filteredUsers = tableState.allDatas.filter(user => {
                    const value = user[col.key];
                    return value !== undefined && String(value).toLowerCase().includes(columnSearchTerm);
                });

                tableState.filteredData = filteredUsers;
                // displayBufferedUsers(tableState);

                // If no results, show "No data found"
                const tableBody = document.getElementById('table-body');
                const noResultMessage = tableBody.querySelector('.grid-table-body');
                if (filteredUsers.length === 0) {
                    // const existingRows = Array.from(tableBody.children);
                    // existingRows.forEach(row => row.style.display = 'none');

                    // hiding existing rows and show "No data found"
                    const wrapper = tableBody.querySelector('.table-body-wrapper');
                    if (wrapper) {
                        const existingRows = Array.from(wrapper.children);
                        existingRows.forEach(row => row.style.display = 'none');
                    }


                    if (!noResultMessage) {
                        const noResult = document.createElement('div');
                        noResult.className = 'grid-table-body';
                        noResult.textContent = 'No data found.';
                        tableBody.appendChild(noResult);
                        tableBody.style.height = 'auto';
                    }
                } else {
                    // Remove "No data found" message and display filtered users
                    if (noResultMessage) {
                        noResultMessage.remove();
                    }
                    displayBufferedUsers(tableState);
                }
            });

            searchWrapper.appendChild(searchIcon);
            searchWrapper.appendChild(searchInput);
            searchWrapper.appendChild(closeIcon);
            headerCell.appendChild(searchWrapper);
        }

        if (col.sortable) {
            const up = document.createElement('img');
            up.src = 'assets/images/up-arrow.svg';
            up.className = 'sort-arrow';
            up.setAttribute('data-order', 'desc');
            up.setAttribute('data-key', col.key);

            const down = document.createElement('img');
            down.src = 'assets/images/down-arrow.svg';
            down.className = 'sort-arrow';
            down.setAttribute('data-order', 'asc');
            down.setAttribute('data-key', col.key);

            headerCell.appendChild(up);
            headerCell.appendChild(down);
        }

        headerRow.appendChild(headerCell);
    });

    gridTable.appendChild(headerRow);


    // Setup sorting after headers are rendered
    setupSorting({
        onSort: (key, order) => {
            tableState.allDatas = sortData(tableState.allDatas, key, order);
            tableState.filteredData = null;
        },
        displayCallback: displayBufferedUsers
    });

}