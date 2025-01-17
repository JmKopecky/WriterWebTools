let chapterPanel;
let summaryPanel;
let largeViewPanel;

let pendingSave = false;

function workLogic() {
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block','link', 'image'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    chapterPanel = new Quill(document.getElementById("chapter-content"), {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });
    summaryPanel = new Quill(document.getElementById("summary-input"), {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });
    largeViewPanel = new Quill(document.getElementById("view-editor"), {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });

    largeViewPanel.on('text-change', (delta, olddelta, source) => {
        lenis.resize();
        //wait a few seconds, then save.
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                pendingSave = false;
                saveChapter();
            }, 1000);
        }
    });
    chapterPanel.on('text-change', (delta, olddelta, source) => {
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                pendingSave = false;
                saveChapter();
            }, 1000);
        }
    });
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


function viewPanel(mode) {
    if (mode) {
        $("#view-overlay").css("display","flex");
        $("#view-overlay").children(".ql-editor").focus();
        largeViewPanel.setContents(chapterPanel.getContents());
        lenis.resize();
    } else {
        $("#view-overlay").css("display", "none");
        chapterPanel.setContents(largeViewPanel.getContents());
        lenis.resize();
    }
}



function saveChapter() {
    let chtitle = $("#chapter-title").text();
    let content;
    if ($("#view-overlay").css("display") === "none") {
        content = chapterPanel.getSemanticHTML();
    } else {
        content = largeViewPanel.getSemanticHTML();
    }
    //todo bug where content has wrapping quotes
    console.log(content);
    navigator.clipboard.writeText(content);
    fetch(window.location.href, {
        method: "POST",
        body: JSON.stringify({
            mode: "save_chapter",
            target: chtitle,
            content: content
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(r => {
        r.json().then((data) => {
            console.log(data);
            if (data["error"] === "none") {

            }
        })
    });
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
                chapterPanel.clipboard.dangerouslyPasteHTML(data["content"]);
                largeViewPanel.clipboard.dangerouslyPasteHTML(data["content"]);
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