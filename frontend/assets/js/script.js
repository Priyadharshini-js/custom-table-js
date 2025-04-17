import { columns } from '../config/columnConfig.js';
import { fetchUsers } from './fetchTable.js';

//fetch api call 
let allUsers = [];
let originalUnSortedUsers = [];
let currentIndex = 0;
let isLoading = false;
let isFiltering = false;
const BUFFER_SIZE = 5;
const ROW_HEIGHT = 50;
const VISIBLE_ROW_COUNT = Math.ceil(window.innerHeight / ROW_HEIGHT) + BUFFER_SIZE;
// console.log("aaaaaaa",VISIBLE_ROW_COUNT)
let tableBodyRef;


export async function fetchData() {
    const loading = document.getElementById('loading');
    isLoading = true;
    loading.style.display = 'block';
    // console.log("aaa", isLoading)

    try {
        const data = await fetchUsers();
        allUsers = [...data];
        originalUnSortedUsers = [...data];
        currentIndex = 0;
        displayBufferedUsers();

    } catch (error) {
        console.log('Error fetching user data', error);
    } finally {
        isLoading = false;
        loading.style.display = 'none';
    }
}

//table header rendering
export function renderTableHeader() {
    const gridTable = document.querySelector('.grid-table');
    gridTable.innerHTML = '';

    const headerRow = document.createElement('div');
    headerRow.className = 'grid-table-header';

    const columnWidths = columns.map(col => `minmax(150px, ${col.width || '1fr'})`).join(' ');

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

//display rows of users in table
export function displayBufferedUsers() {
    if (!tableBodyRef) {
        tableBodyRef = document.getElementById('table-body');
    }

    const scrollTop = window.scrollY;
    // console.log('yyy',scrollTop)  //number of pixels the user has scrolled down from the top
    const firstVisibleIndex = Math.floor(scrollTop / ROW_HEIGHT);
    // console.log('index',firstVisibleIndex) //index of first visible row in table
    const startIndex = Math.max(0, firstVisibleIndex - BUFFER_SIZE);
    // console.log('startindex',startIndex) //index of first row to be rendered in dom
    const endIndex = Math.min(allUsers.length, firstVisibleIndex + VISIBLE_ROW_COUNT);
    // console.log('endindex',endIndex) //index of last row to be rendered in dom

    // Clear current visible rows
    tableBodyRef.innerHTML = '';

    for (let i = startIndex; i < endIndex; i++) {
        const user = allUsers[i];
        const row = renderUserRow(user, i);
        tableBodyRef.appendChild(row);
    }

    // Adjust total height and position container absolutely
    tableBodyRef.style.position = 'relative';
    tableBodyRef.style.height = `${endIndex * ROW_HEIGHT}px`;
}

//render userRow function
function renderUserRow(item, index) {
    const row = document.createElement('div');
    row.className = 'grid-table-body';
    row.style.position = 'absolute';
    row.style.top = `${index * ROW_HEIGHT}px`;
    row.style.left = '0';
    row.style.right = '0';

    const columnWidths = columns.map(col => `minmax(150px, ${col.width || '1fr'})`).join(' ');

    row.style.display = 'grid';
    row.style.gridTemplateColumns = columnWidths;

    columns.forEach(col => {
        const cell = typeof col.render === 'function'
            ? col.render(item[col.key], item, index)
            : (() => {
                const div = document.createElement('div');
                div.textContent = item[col.key] ?? '';
                return div;
            })();
        row.appendChild(cell);
    });

    return row;
}

//debounce search call 
function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay)
    }
}

//handle search function
export function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    const loading = document.getElementById('loading');

    tableBody.innerHTML = "";
    isLoading = true;
    loading.style.display = 'block';

    isFiltering = !!searchTerm; //boolean checks

    if (!searchTerm) {
        currentIndex = 0;
        window.scrollTo(0, 0);
        displayBufferedUsers();
        return;
    }

    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        String(user.age).includes(searchTerm) ||
        String(user.rollNo).toLowerCase().includes(searchTerm)
    );

    if (filteredUsers.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'grid-table-body';
        noResult.textContent = 'No users found.';
        tableBody.appendChild(noResult);
        tableBody.style.height = 'auto';
    } else {
        // Show search results
        filteredUsers.forEach((item, index) => {
            const row = renderUserRow(item, index);
            tableBody.appendChild(row);
            tableBody.style.height = `${filteredUsers.length * ROW_HEIGHT}px`;
        });
    }

    isLoading = false;
    loading.style.display = 'none';
}

const searchInput = document.getElementById('search');
const debouncedSearch = debounce(handleSearch, 500);
searchInput.addEventListener('input', debouncedSearch);

//throttling function for scroll
function throttle(func, limit) {
    let lastCall = 0;
    return function () {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func();
        }
    };
}

// Handle Scroll Function
export const handleScroll = throttle(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= bodyHeight - 100) {
        if (!isFiltering && currentIndex < allUsers.length) {
            displayBufferedUsers();
        }
    }
}, 300);

window.addEventListener('scroll', throttle(() => {
    if (!isFiltering) {
        displayBufferedUsers();
    }
}, 100));


//sorting functionality
function sortData(key, order) {
    allUsers.sort((a, b) => {
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
            document.getElementById('table-body').innerHTML = '';
            displayBufferedUsers();
        });
    });
}

//reset table function
export function resetTable() {
    const searchInput = document.getElementById('search');
    searchInput.value = '';

    // Reset state
    currentIndex = 0;
    isFiltering = false;

    // Restore original data
    allUsers = [...originalUnSortedUsers];

    // Scroll to top
    window.scrollTo(0, 0);

    // Clear and re-display
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    displayBufferedUsers();
}