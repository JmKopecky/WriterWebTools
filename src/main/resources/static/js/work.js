document.addEventListener("DOMContentLoaded", () => {
    workLogic();
});



function workLogic() {

}


function toggleSidebar() {
    let button = document.getElementById("chapter-sidebar-button");
    let container = document.getElementById("chapter-sidebar-container");
    let sidebar = document.getElementById("chapter-sidebar");
    let current = button.classList.contains("open");
    if (current) {
        button.classList.remove("open");
        gsap.to(button, {
            x: "100%",
            rotate: "90deg",
            duration: 0.5,
            ease: "power2.inout"
        });

        gsap.to(container, {
            width: "0",
            duration: 0.5,
            ease: "power2.inout",
            onComplete: () => {
                sidebar.style.display = "none";
            }
        });


        gsap.to(sidebar, {
            opacity: 0,
            x: "-20vw",
            ease: "power2.inout",
            duration: 0.5
        });
    } else {
        button.classList.add("open");
        gsap.to(button, {
            x: "0",
            rotate: "0deg",
            duration: 0.5,
            ease: "power2.inout"
        });


        gsap.to(container, {
            width: "23vw",
            duration: 0.5,
            ease: "power2.inout"
        });

        sidebar.style.display = "block";
        gsap.to(sidebar, {
            opacity: 1,
            x: "0",
            ease: "power2.inout",
            duration: 0.5
        });
    }
}


function selectChapter(target) {
    console.log("test");
    fetch(window.location.href, {
        method: "POST",
        body: JSON.stringify({
            mode: "select",
            target: target
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(r => {
        r.json().then((data) => {
            console.log(data);
            if (data["error"] === "none") {
                $("#work-info-panel").css("display", "none");
                $("#chapter-panel").css("display", "flex");
                $("#chapter-title").text(data["title"]);
                $("#chapter-content").val(data["content"]);
            }
        })
    });
}


function createChapterDialog() {
    $("#new-chapter-bg").css("display", "flex");
    $("#new-chapter-name-input").val("");
    $("#new-chapter-number-input").val((parseInt($("#work-chapter-count").text()) + 1) + "");
}


function createChapterFinal() {
    let chaptername = $("#new-chapter-name-input");
    let chapternumber = $("#new-chapter-number-input");
    if (chapternumber.val() === "" || !chapternumber.val().match("[0-9]")) {
        chapternumber.focus();
        return;
    }
    if (chaptername.val() === "") {
        chaptername.focus();
        return;
    }

    fetch(window.location.href, {
        method: "POST",
        body: JSON.stringify({
            mode: "create",
            chaptername: chaptername.val(),
            chapternumber: chapternumber.val()
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(r => {
        r.json().then((data) => {
            console.log(data);
        })
    });

    chapternumber.val = (parseInt($("#work-chapter-count").text()) + 1) + "";
    chaptername.val = "";

    $("#new-chapter-bg").css("display", "none");
}


function hideOverlay(event, element) {

    if (event !== null && event.target !== element) {
        event.stopPropagation();
        return;
    }

    $("#new-chapter-bg").css("display", "none");
}