barba.init({
    preventRunning: true,
    cacheIgnore: true,
    prefetchIgnore: true,
    transitions: [{
        name: 'dash',
        sync: false,
        from: {namespace:['dashboard']},
        to: {namespace:['dashboard']},
        leave(data) {
            return gsap.to(data.current.container.getElementsByClassName("dashboard-content"), {
                opacity: 0, duration: 0.25, ease: "power1.inout"
            });
        },
        enter(data) {
            gsap.set(data.next.container.getElementsByClassName("dashboard-content"), {
                opacity: 0
            })
            gsap.to(data.next.container.getElementsByClassName("dashboard-content"), {
                opacity: 1, duration: 0.25, ease: "power1.inout"
            });
            return false;
        }
    },{
        name: 'main',
        sync: true,
        leave(data) {
            return gsap.to(data.current.container, {
                opacity: 0, duration: 0.25, ease: "power1.inout"
            });
        },
        enter(data) {
            gsap.set(data.next.container, {
                opacity: 0
            })
            gsap.to(data.next.container, {
                opacity: 1, duration: 0.25, ease: "power1.inout", delay: 0.25
            });
            return false;
        }
    }]
});

function doInitialSetup() {
    if ($("#dashboard-page") !== undefined) {
        dashboardLogic();
    }
    if ($("#signon-page") !== undefined) {
        signonLogic();
    }
    if ($("#work-page") !== undefined) {
        workLogic();
    }
}

barba.hooks.after((data) => {
    doInitialSetup();
});

document.addEventListener("DOMContentLoaded", () => {
    doInitialSetup();
})