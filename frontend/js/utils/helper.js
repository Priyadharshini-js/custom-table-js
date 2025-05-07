//debounce search call 
export function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay)
    }
}


//throttle scroll bar
export function throttle(func, limit) {
    let lastCall = 0;
    return function () {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            func();
        }
    };
}



//sorting functionality
export function sortData(data, key, order) {
    return [...data].sort((a, b) => {
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


