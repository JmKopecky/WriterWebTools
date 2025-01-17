let lenis;

let isMobile = true;
if (window.matchMedia("(pointer:fine)").matches) {
    isMobile = false;
    lenis = new Lenis({
        syncTouch: true,
        duration: 1.5
    })
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Ghost714: I See You, Reclaimer.");
})


