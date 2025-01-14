document.addEventListener("DOMContentLoaded", () => {
    dashboardLogic();
});



function dashboardLogic() {

    let targets = $(".sidebar-link");
    targets.each(function(index, elem) {
        $(this).on("click", function() {
            let target = $(this).find(".sidebar-label").text().toLowerCase();
            targets.each(function(index, elem2) {
                $(this).removeClass("activepanel");
            });
            $(this).addClass("activepanel");
            barba.go("/dashboard?section=" + target);
        });
    });


    if ($("#newwork-form") !== undefined) {
        let createButton = $("#newwork-submit");
        createButton.on("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                createButton.click();
            }
        });


        createButton.on("click", () => {
            let title = $("#newwork_title");
            if (title.val() === "") {
                title.focus();
                return;
            }


            fetch("/dashboard", {
                method: "POST",
                body: JSON.stringify({
                    mode: "create",
                    title: title.val()
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(r => {
                r.text().then((data) => {
                    barba.go("/work?target=" + data);
                });
            });
        });
    }
}