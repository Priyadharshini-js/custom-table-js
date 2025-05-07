
//setup sorting
export function setupSorting({ onSort, displayCallback }) {
    const sortArrows = document.querySelectorAll('.sort-arrow');

    sortArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const key = arrow.getAttribute('data-key');
            const order = arrow.getAttribute('data-order');

            onSort(key, order);
            // currentIndex = 0;
            // displayBufferedUsers();
            displayCallback();
        });
    });
}