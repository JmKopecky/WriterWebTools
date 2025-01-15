function signonLogic() {
    let signinButton = $("#signin-submit");
    signinButton.on("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signinButton.click();
        }
    });
    let signupButton = $("#signup-submit");
    signupButton.on("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            signupButton.click();
        }
    });


    signinButton.on("click", () => {
        console.log("clicked");
        let username = $("#signin_usernameInput");
        let password = $("#signin_passwordInput");
        if (username.val() === "") {
            username.focus();
            return;
        }
        if (password.val() === "") {
            password.focus();
            return;
        }

        fetch("/signon", {
            method: "POST",
            body: JSON.stringify({
                mode: "signin",
                username: username.val(),
                password: password.val()
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(r => {
            r.text().then((data) => {
                console.log(data);
                barba.go("/dashboard");
            })
        });
    });


    signupButton.on("click", () => {
        let username = $("#signup_usernameInput");
        let password = $("#signup_passwordInput");
        let confirm = $("#signup_confirmInput");
        if (username.val() === "") {
            username.focus();
            return;
        }
        if (password.val() === "") {
            password.focus();
            return;
        }
        if (confirm.val() === "" || confirm.val() !== password.val()) {
            confirm.focus();
            return;
        }


        fetch("/signon", {
            method: "POST",
            body: JSON.stringify({
                mode: "signup",
                username: username.val(),
                password: password.val()
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(r => {
            r.text().then((data) => {
                console.log(data);
                barba.go("/dashboard");
            })
        });
    });
}