//reset table function
export function resetTable(tableState, displayBufferedUsers) {
    const tableBody = document.getElementById('table-body');

    const searchInput = document.getElementById('search');
    searchInput.value = '';

    // Remove "No data found" message if it exists
    const noResultMessage = tableBody.querySelector('.grid-table-body');
    if (noResultMessage) {
        noResultMessage.remove();
    }

    // Reset state
    tableState.currentIndex = 0;
    tableState.isFiltering = false;

    tableState.filteredData = null;

    tableState.allDatas = [...tableState.originalUnSortedDatas];
    // console.log(allDatas)

    // Scroll to top
    tableBody.scrollTop = 0;

    displayBufferedUsers();
}