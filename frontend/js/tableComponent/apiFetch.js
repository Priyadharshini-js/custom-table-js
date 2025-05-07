import { calculateRowHeight, displayBufferedUsers } from "./rowRender.js";

let tableBodyRef;

//fetch api call 
export async function fetchData(fetchUsersFn, callback, tableState) {
    const loading = document.getElementById('loading');

    if (!tableBodyRef) {
        tableBodyRef = document.getElementById('table-body');
    }

    tableState.isLoading = true;
    loading.style.display = 'block';

    try {
        const data = await fetchUsersFn();

        if (data.length === 0) {
            tableBodyRef.className = 'grid-table-body-empty';
            tableBodyRef.innerHTML = `<div class="no-user-found">No data found</div>`;
            tableBodyRef.style.height = 'auto';
            return;
        }
        tableState.allDatas = [...data];
        tableState.originalUnSortedDatas = [...data];
        tableState.currentIndex = 0;

        calculateRowHeight(tableState);
        displayBufferedUsers(tableState);

        if (typeof callback === 'function') {
            callback();
        }


    } catch (error) {
        console.log('Error fetching user data', error);
        tableBodyRef.innerHTML = `<div class="no-user-found">Error fetching data</div>`;
    } finally {
        tableState.isLoading = false;
        loading.style.display = 'none';
    }
}