import { columns } from '../config/columnConfig.js';
import {
    debounce, throttle
} from '../utils/utils.js';


let allDatas = [];
let originalUnSortedDatas = [];
let currentIndex = 0;
let isLoading = false;
let isFiltering = false;
let filteredData = null;
const BUFFER_SIZE = 10;
let ROW_HEIGHT;
let tableBodyRef;

//table component initialization
export function TableComponent(tableContainer, columns, fetchUsersFn) {

    fetchData(fetchUsersFn, () => {
        renderTableHeader(tableContainer, columns);
        displayBufferedUsers();

        // Set up debounced search input handler
        const searchInput = document.getElementById('search');
        const debouncedSearch = debounce(handleSearch, 500);
        searchInput.addEventListener('input', debouncedSearch);

        setupSorting();
        resetTable();
        document.getElementById("resetButton").addEventListener("click", resetTable);

    });
}


function calculateRowHeight() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody || allDatas.length === 0) return;

    // Create a temporary row
    const tempRow = renderUserRow(allDatas[0], 0);
    tempRow.style.visibility = 'hidden';
    tempRow.style.position = 'absolute';
    tableBody.appendChild(tempRow);

    ROW_HEIGHT = tempRow.offsetHeight;

    tableBody.removeChild(tempRow);
}

//fetch api call 
export async function fetchData(fetchUsersFn, callback) {
    const loading = document.getElementById('loading');

    if (!tableBodyRef) {
        tableBodyRef = document.getElementById('table-body');
    }

    isLoading = true;
    loading.style.display = 'block';

    try {
        const data = await fetchUsersFn();

        if (data.length === 0) {
            tableBodyRef.className = 'grid-table-body-empty';
            tableBodyRef.innerHTML = `<div class="no-user-found">No data found</div>`;
            tableBodyRef.style.height = 'auto';
            return;
        }
        allDatas = [...data];
        originalUnSortedDatas = [...data];
        calculateRowHeight();
        currentIndex = 0;
        displayBufferedUsers();

        if (typeof callback === 'function') {
            callback();
        }


    } catch (error) {
        console.log('Error fetching user data', error);
        tableBodyRef.innerHTML = `<div class="no-user-found">Error fetching data</div>`;
    } finally {
        isLoading = false;
        loading.style.display = 'none';
    }
}


//table header rendering
export function renderTableHeader(tableContainer) {
    const gridTable = tableContainer.querySelector('.grid-table');

    const headerRow = document.createElement('div');
    headerRow.className = 'grid-table-header';

    const columnWidths = columns.map(col => `minmax(150px, ${col.width})`).join(' ');

    headerRow.style.display = 'grid';
    headerRow.style.gridTemplateColumns = columnWidths;

    columns.forEach(col => {
        const headerCell = document.createElement('div');
        headerCell.style.display = 'flex';
        headerCell.style.alignItems = 'center';
        headerCell.textContent = col.label;

        if (col.sortable) {
            const up = document.createElement('img');
            up.src = 'assets/images/up-arrow.svg';
            up.className = 'sort-arrow';
            up.setAttribute('data-order', 'desc');
            up.setAttribute('data-key', col.key);
            up.style.width = '15px'

            const down = document.createElement('img');
            down.src = 'assets/images/down-arrow.svg';
            down.className = 'sort-arrow';
            down.setAttribute('data-order', 'asc');
            down.setAttribute('data-key', col.key);
            down.style.width = '15px'

            headerCell.appendChild(up);
            headerCell.appendChild(down);
        }

        headerRow.appendChild(headerCell);
    });

    gridTable.appendChild(headerRow);
}

//display rows of data in table
export function displayBufferedUsers() {
    if (!tableBodyRef) {
        tableBodyRef = document.getElementById('table-body');
    }

    if (!ROW_HEIGHT || !tableBodyRef) return;

    const visibleHeight = tableBodyRef.offsetHeight; //offset clientHeight
    let VISIBLE_ROW_COUNT = Math.ceil(visibleHeight / ROW_HEIGHT) + BUFFER_SIZE; //dom count

    const activeData = filteredData || allDatas;


    const scrollTop = tableBodyRef.scrollTop;
    const firstVisibleIndex = Math.floor(scrollTop / ROW_HEIGHT);
    const startIndex = Math.max(0, firstVisibleIndex - BUFFER_SIZE);
    const endIndex = Math.min(activeData.length, firstVisibleIndex + VISIBLE_ROW_COUNT);

    const visibleData = activeData.slice(startIndex, endIndex);  //rows currently in the viewport, which is rendered in the DOM.

    // Get all current rows
    const existingRows = Array.from(tableBodyRef.children);

    let rowIndex = 0;

    // Reuse existing rows
    existingRows.forEach((row, index) => {
        if (index < visibleData.length) {
            row.style.top = `${(startIndex + index) * ROW_HEIGHT}px`;
            row.style.display = 'grid';
            const user = visibleData[index];
            const cells = row.children;

            columns.forEach((col, colIndex) => {
                const cell = cells[colIndex];
                if (typeof col.render === 'function') {
                    const rendered = col.render(user[col.key], user, startIndex + index);
                    //console.log(cell.textContent)
                    cell.textContent = '';
                    cell.appendChild(rendered);
                } else {
                    cell.textContent = user[col.key] ?? '';
                }
            });

            rowIndex++;
        }
    });

    // Add new rows if needed
    for (let i = rowIndex; i < visibleData.length; i++) {
        const row = renderUserRow(visibleData[i], startIndex + i);
        row.style.top = `${(startIndex + i) * ROW_HEIGHT}px`;
        tableBodyRef.appendChild(row);
    }

    // Hide extra rows if filtered data is active
    if (filteredData) {
        for (let i = visibleData.length; i < existingRows.length; i++) {   //visible is in the viewport & existing is in the DOM
            const absoluteIndex = startIndex + i;
            const row = existingRows[i];
            if (absoluteIndex >= filteredData.length) {
                row.style.display = 'none';
            }
        }
    }

    // Measure the actual row height after rendering the first row
    // const firstRow = tableBodyRef.querySelector('.grid-table-bodyRows');
    // if (firstRow && !ROW_HEIGHT) {
    //     const newRowHeight = firstRow.offsetHeight;
    //     if (newRowHeight) {
    //         ROW_HEIGHT = newRowHeight;
    //         const visibleHeight = tableBodyRef.offsetHeight; //offset clientheight
    //         VISIBLE_ROW_COUNT = Math.ceil(visibleHeight / ROW_HEIGHT) + BUFFER_SIZE;
    //     }
    // }

    tableBodyRef.style.position = 'relative';
}

//render userRow function
function renderUserRow(item, index) {
    // const gridTable = document.querySelector('.grid-table');
    const tableBody = document.getElementById('table-body');


    const row = document.createElement('div');
    row.className = 'grid-table-bodyRows';
    row.style.top = `${index * ROW_HEIGHT}px`;

    const columnWidths = columns.map(col => `minmax(150px, ${col.width})`).join(' ');

    row.style.display = 'grid';
    row.style.gridTemplateColumns = columnWidths;

    columns.forEach(col => {
        const cell = typeof col.render === 'function'
            ? col.render(item[col.key])
            : (() => {
                const div = document.createElement('div');
                div.textContent = item[col.key] ?? '';
                return div;
            })();

        row.appendChild(cell);
    });
    tableBody.appendChild(row);
    // gridTable.appendChild(tableBody);

    return row;
}





// handle search function
export function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    const loading = document.getElementById('loading');

    isLoading = true;
    loading.style.display = 'block';
    isFiltering = !!searchTerm;

    // Remove "No data found" message if it exists
    const noResultMessage = tableBody.querySelector('.grid-table-body');
    if (noResultMessage) {
        noResultMessage.remove();
    }

    if (!searchTerm) {
        filteredData = null;
        currentIndex = 0;
        tableBody.scrollTop = 0;
        displayBufferedUsers();
        isLoading = false;
        loading.style.display = 'none';
        return;
    }

    const searchableKeys = columns.map(col => col.key);

    const filteredUsers = allDatas.filter(user => {
        return searchableKeys.some(key => {
            const value = user[key];
            return value !== undefined && String(value).toLowerCase().includes(searchTerm);
        });
    });

    tableBody.scrollTop = 0;


    if (filteredUsers.length === 0) {
        const existingRows = Array.from(tableBody.children);
        existingRows.forEach(row => row.style.display = 'none');

        const noResult = document.createElement('div');
        noResult.className = 'grid-table-body';
        noResult.textContent = 'No datas found.';
        tableBody.appendChild(noResult);
        tableBody.style.height = 'auto';
    } else {
        tableBody.scrollTop = 0;
        filteredData = filteredUsers;
        displayBufferedUsers();

        console.log("row", filteredUsers)

    }

    isLoading = false;
    loading.style.display = 'none';
}


// handle scroll function
export const handleScroll = throttle(() => {
    const tableBody = document.getElementById('table-body');
    const scrollTop = tableBody.scrollTop;
    const tableBodyHeight = tableBody.offsetHeight; ///offset clientHeight, The visible height of the table (viewport)
    const tableBodyContentHeight = tableBody.scrollHeight; //total height of the content inside the table

    if (scrollTop + tableBodyHeight >= tableBodyContentHeight - 100) { //hw far user has scrolled
        if (!isFiltering && currentIndex < allDatas.length) {
            displayBufferedUsers();
        }
    }
}, 300);

document.getElementById('table-body')?.addEventListener('scroll', throttle(() => {
    requestAnimationFrame(displayBufferedUsers);
}, 100));



//sorting functionality
function sortData(key, order) {
    allDatas.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        const isNumeric = !isNaN(valA) && !isNaN(valB);

        if (isNumeric) {
            return order === 'asc' ? valA - valB : valB - valA;
        } else {
            return order === 'asc'
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        }
    });
}

export function setupSorting() {
    const sortArrows = document.querySelectorAll('.sort-arrow');

    sortArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const key = arrow.getAttribute('data-key');
            const order = arrow.getAttribute('data-order');
            sortData(key, order);

            currentIndex = 0;
            displayBufferedUsers();
        });
    });
}



//reset table function
export function resetTable() {
    const tableBody = document.getElementById('table-body');

    const searchInput = document.getElementById('search');
    searchInput.value = '';

    // Remove "No data found" message if it exists
    const noResultMessage = tableBody.querySelector('.grid-table-body');
    if (noResultMessage) {
        noResultMessage.remove();
    }

    // Reset state
    currentIndex = 0;
    isFiltering = false;

    filteredData = null;

    allDatas = [...originalUnSortedDatas];
    // console.log(allDatas)

    // Scroll to top
    tableBody.scrollTop = 0;

    displayBufferedUsers();
}