
// ========================================
// COMMON.JS
// Digital clock and toast notifications
// ========================================

// Digital clock
function updateClock() {
    const clock = document.getElementById("clock");

    if (!clock) {
        return;
    }

    const now = new Date();

    clock.textContent = now.toLocaleTimeString();
}

// Update clock every second
updateClock();
setInterval(updateClock, 1000);


// Toast notification
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}
