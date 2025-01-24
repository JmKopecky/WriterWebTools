let chapterPanel;
let largeViewPanel;
let notePanel;
let smallNotePanel;

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
            syntax: true,
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });
    largeViewPanel = new Quill(document.getElementById("view-editor"), {
        modules: {
            syntax: true,
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });
    notePanel = new Quill(document.getElementById("view-note-editor"), {
        modules: {
            syntax: true,
            toolbar: toolbarOptions
        },
        theme: 'bubble',
        placeholder: 'In the beginning...'
    });
    smallNotePanel = new Quill(document.getElementById("chapter-notes"), {
        modules: {
            syntax: true,
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
                saveChapter(false);
            }, 1000);
        }
    });
    chapterPanel.on('text-change', (delta, olddelta, source) => {
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                pendingSave = false;
                saveChapter(false);
            }, 1000);
        }
    });
    notePanel.on('text-change', (delta, olddelta, source) => {
        lenis.resize();
        //wait a few seconds, then save.
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                pendingSave = false;
                saveChapter(false);
            }, 1000);
        }
    });
    smallNotePanel.on('text-change', (delta, olddelta, source) => {
        lenis.resize();
        //wait a few seconds, then save.
        if (!pendingSave) {
            pendingSave = true;
            setTimeout(() => {
                pendingSave = false;
                saveChapter(false);
            }, 1000);
        }
    });
    registerBindings();
}


function retrieveHtml(target) {
    let output = "" + target.getSemanticHTML();
    output = output.replaceAll("&nbsp;", " "); //kill nbsp spaces because they suck for ao3 formatting
    output = output.replaceAll(/<pre.*>/gi, "<pre><code>");
    output = output.replaceAll("</pre>", "</code></pre>");
    return output;
}


function returnToWork(toWork) {
    if (toWork) {
        gsap.to($("#chapter-panel"), {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => {
                $("#chapter-panel").css("display", "none");
                $("#work-info-panel").css("display", "flex");
                $("#work-info-panel").css("opacity", "0");
                $("#chapter-panel").css("opacity", "1");
                gsap.to($("#work-info-panel"),{
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2.in"
                });
            }
        });

        gsap.to($("#sidebar-icon"), {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => {
                $("#sidebar-title").css("display", "block");
                $("#sidebar-icon").css("display", "none");
                $("#sidebar-icon").css("opacity", "1");
                $("#sidebar-title").css("opacity", "0");
                gsap.to($("#sidebar-title"), {
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2.out"
                })
            }
        })
    } else {
        gsap.to($("#sidebar-title"), {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => {
                $("#sidebar-title").css("display", "none");
                $("#sidebar-title").css("opacity", "1");
                $("#sidebar-icon").css("opacity", "0");
                $("#sidebar-icon").css("display", "block");
                gsap.to($("#sidebar-icon"), {
                    opacity: 1,
                    duration: 0.25,
                    ease: "power2.in"
                })
            }
        })

    }
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

        gsap.to($("#chapter-panel"), {
            maxWidth: "90vw",
            duration: 0.5,
            ease: "power2.inout"
        });
        gsap.to($("#work-info-panel"), {
            maxWidth: "90vw",
            duration: 0.5,
            ease: "power2.inout"
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
        gsap.to($("#chapter-panel"), {
            maxWidth: "65vw",
            duration: 0.5,
            ease: "power2.inout"
        });
        gsap.to($("#work-info-panel"), {
            maxWidth: "65vw",
            duration: 0.5,
            ease: "power2.inout"
        });
    }
}


function viewPanel(mode) {
    if (mode) {
        $("#view-overlay").css("display","flex");
        $("#view-overlay").children(".ql-editor").focus();
        largeViewPanel.setContents(chapterPanel.getContents());
        notePanel.setContents(smallNotePanel.getContents());
        lenis.resize();
    } else {
        $("#view-overlay").css("display", "none");
        chapterPanel.setContents(largeViewPanel.getContents());
        smallNotePanel.setContents(notePanel.getContents());
        lenis.resize();
    }
}


function registerBindings() {
    let targets = [largeViewPanel, chapterPanel, notePanel, smallNotePanel];
    for (const elem of targets) {
        elem.keyboard.addBinding({ key: '-' }, {
            collapsed: true,
        }, function(range, context) {
            let index = elem.getSelection(true)["index"] - 1;
            if (elem.getText(index, 1) === '-') {
                elem.deleteText(index, 1);
                elem.insertText(index, "—");
                return false;
            }
            return true;
        });
        elem.keyboard.addBinding({
            key: ['8', '*'],
            shortKey: true,
            shiftKey: true,
        }, function(range, context) {
            if (elem.getFormat(range, 1)["list"] !== undefined && elem.getFormat(range, 1)["list"] === 'bullet') {
                elem.formatLine(0,1,'list', false);
            } else {
                elem.formatLine(range, 1, 'list', 'bullet');
            }
        });
    }
}



function saveChapter(clipboard) {
    let chtitle = $("#chapter-title").text();
    let notes;
    let content;
    if ($("#view-overlay").css("display") === "none") {
        content = retrieveHtml(chapterPanel)
        notes = retrieveHtml(smallNotePanel)
    } else {
        content = retrieveHtml(largeViewPanel)
        notes = retrieveHtml(notePanel)
    }
    if (clipboard) {
        navigator.clipboard.writeText(content);
    }
    fetch(window.location.href, {
        method: "POST",
        body: JSON.stringify({
            mode: "save_chapter",
            target: chtitle,
            content: content,
            notes: notes
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}


function selectChapter(target) {
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
            if (data["error"] === "none") {
                returnToWork(false);

                gsap.to($("#work-info-panel"), {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power2.out",
                    onComplete: () => {
                        $("#work-info-panel").css("display", "none");
                        $("#chapter-panel").css("display", "flex");
                        $("#chapter-panel").css("opacity", "0");
                        $("#work-info-panel").css("opacity", "1");
                        gsap.to($("#chapter-panel"),{
                            opacity: 1,
                            duration: 0.25,
                            ease: "power2.in"
                        });
                    }
                });

                $("#chapter-title").text(data["title"]);
                chapterPanel.clipboard.dangerouslyPasteHTML(data["content"]);
                largeViewPanel.clipboard.dangerouslyPasteHTML(data["content"]);
                notePanel.clipboard.dangerouslyPasteHTML(data["notes"]);
                smallNotePanel.clipboard.dangerouslyPasteHTML(data["notes"]);
                $("#chapter-content").val(data["content"]);

            }
        })
    });
}


function toggleNotes(fullscreen) {

    if (fullscreen) {
        if ($("#view-note-editor").css("display") !== "none") {
            gsap.to($("#view-panels"), {
                width: "70%",
                duration: 0.5,
                ease: "power2.inout"
            });
            gsap.to($("#view-note-editor"), {
                maxWidth: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2-inout",
                onComplete: () => {
                    $("#view-note-editor").css("display", "none");
                }
            });
            gsap.to($("#view-editor"), {
                maxWidth: "100%",
                duration: 0.5,
                ease: "power2.inout"
            })
        } else {
            $("#view-note-editor").css("display", "block");
            $("#view-note-editor").css("max-width", "0%");
            $("#view-note-editor").css("opacity", "0");
            gsap.to($("#view-note-editor"), {
                maxWidth: "30%",
                opacity: 1,
                duration: 0.5,
                ease: "power2.inout"
            });
            gsap.to($("#view-panels"), {
                width: "90%",
                duration: 0.5,
                ease: "power2.inout"
            });
            gsap.to($("#view-editor"), {
                maxWidth: "70%",
                duration: 0.5,
                ease: "power2.inout"
            })
        }
    } else {
        if ($("#chapter-notes").css("display") === "block") {
            $("#chapter-content").css("display", "block");
            $("#chapter-notes").css("display", "none");
            gsap.to($("#small-note-icon"), {
                fontSize: "2em",
                duration: 0.5,
                ease: "power2.inout"
            });
        } else {
            $("#chapter-content").css("display", "none");
            $("#chapter-notes").css("display", "block");
            gsap.set($("#small-note-icon"), {fontSize: "2em"});
            gsap.to($("#small-note-icon"), {
                fontSize: "2.5em",
                duration: 0.5,
                ease: "power2.inout"
            });
        }

    }



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
            location.reload();
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