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
}