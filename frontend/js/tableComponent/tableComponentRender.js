import { debounce, throttle } from '../utils/helper.js';
import { fetchData } from './apiFetch.js';
import { handleSearch } from './handleSearch.js';
import { renderTableHeader } from './renderTableHeader.js';
import { resetTable } from './resetTable.js';
import { displayBufferedUsers } from './rowRender.js';


export const tableState = {
    isLoading: false,
    isFiltering: false,
    currentIndex: 0,
    filteredData: null,
    allDatas: [],
    originalUnSortedDatas: [],
};



//table component initialization
export function TableComponent(tableContainer, columns, fetchUsersFn) {

    fetchData(fetchUsersFn, () => {
        renderTableHeader(tableContainer, columns, tableState, displayBufferedUsers(tableState));

        // Set up debounced search input handler
        const searchInput = document.getElementById('search');
        const debouncedSearch = debounce((e) =>
            handleSearch(e, tableState.allDatas, tableState, columns, displayBufferedUsers(tableState)), 500);

        searchInput.addEventListener('input', debouncedSearch);

        //reset funtion call
        document.getElementById("resetButton").addEventListener("click", () => {
            resetTable(tableState, () => displayBufferedUsers(tableState));
        });


    }, tableState, () => displayBufferedUsers(tableState));
}












// handle scroll function
export const handleScroll = throttle(() => {
    const tableBody = document.getElementById('table-body');
    const scrollTop = tableBody.scrollTop;
    const tableBodyHeight = tableBody.offsetHeight; ///offset clientHeight, The visible height of the table (viewport)
    const tableBodyContentHeight = tableBody.scrollHeight; //total height of the content inside the table

    if (scrollTop + tableBodyHeight >= tableBodyContentHeight - 100) { //hw far user has scrolled
        if (!tableState.isFiltering && tableState.currentIndex < tableState.allDatas.length) {
            displayBufferedUsers(tableState);
        }
    }
}, 300);




document.getElementById('table-body')?.addEventListener('scroll', throttle(() => {
    requestAnimationFrame(() => displayBufferedUsers(tableState));
}, 100));