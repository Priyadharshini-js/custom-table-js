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