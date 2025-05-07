import { columns } from '../config/columnConfig.js';
import { tableState } from './tableComponentRender.js';

const BUFFER_SIZE = 10;
let ROW_HEIGHT;
let tableBodyRef;



// calculate row height
export function calculateRowHeight() {
    const tableBody = document.getElementById('table-body');
    if (!tableBody || tableState.allDatas.length === 0) return;

    // Create a temporary row
    const tempRow = renderUserRow(tableState.allDatas[0], 0);
    tempRow.style.visibility = 'hidden';
    tempRow.style.position = 'absolute';
    tableBody.appendChild(tempRow);

    ROW_HEIGHT = tempRow.offsetHeight;

    tableBody.removeChild(tempRow);
}

//display rows of data in table
export function displayBufferedUsers() {
    if (!tableBodyRef) {
        tableBodyRef = document.getElementById('table-body');
    }

    if (!ROW_HEIGHT || !tableBodyRef) return;


    // Create wrapper if it doesn't exist
    let wrapper = tableBodyRef.querySelector('.table-body-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'table-body-wrapper';
        tableBodyRef.appendChild(wrapper);
    }

    const visibleHeight = tableBodyRef.offsetHeight; //offset clientHeight, visible part of the table is.
    let VISIBLE_ROW_COUNT = Math.ceil(visibleHeight / ROW_HEIGHT) + BUFFER_SIZE; //dom count


    const activeData = tableState.filteredData || tableState.allDatas;
    if (activeData.length === 0) return;


    const scrollTop = tableBodyRef.scrollTop;  //how far the table is scrolled down
    const firstVisibleIndex = Math.floor(scrollTop / ROW_HEIGHT); //view port in the table
    const startIndex = Math.max(0, firstVisibleIndex - BUFFER_SIZE);
    const endIndex = Math.min(activeData.length, firstVisibleIndex + VISIBLE_ROW_COUNT);


    const visibleData = activeData.slice(startIndex, endIndex);  //rows currently in the viewport, which is rendered in the DOM.
    // only the rows we need to show

    // Get all current rows
    const existingRows = Array.from(wrapper.children);

    let rowIndex = 0;

    // Translate wrapper instead of positioning individual rows, visually moves the rows
    wrapper.style.transform = `translateY(${startIndex * ROW_HEIGHT}px)`;

    // Reuse existing rows
    existingRows.forEach((row, index) => {
        if (index < visibleData.length) {
            // row.style.top = `${(startIndex + index) * ROW_HEIGHT}px`;
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
        // row.style.top = `${(startIndex + i) * ROW_HEIGHT}px`;
        wrapper.appendChild(row);
    }

    for (let i = visibleData.length; i < existingRows.length; i++) {
        existingRows[i].style.display = 'none';
    }


}

//render dataRow function, creates a new row from scratch.
function renderUserRow(item, index) {
    // const tableBody = document.getElementById('table-body');


    const row = document.createElement('div');
    row.className = 'grid-table-bodyRows';
    // row.style.top = `${index * ROW_HEIGHT}px`;

    const columnWidths = columns.map(col => col.width).join(' ');


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

    return row;
}