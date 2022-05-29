function showError() {
    // just some red text displaying all of the criteria
}

function sendLogin() {
    let loginField = document.getElementById("login-username").value;
    let passwordField = document.getElementById("login-password").value;

    // communicate using xmlhttp, everyone else seems to be using that

    let xmlhttp = new XMLHttpRequest();
    let xmlurl; // the server's url/ip

    let user = {
        formType: "login",
        login: loginField,
        password: passwordField,
    }

    xmlhttp.open("GET", xmlurl, true);
    xmlhttp.send();
}
document.getElementById("login-login").addEventListener("click", sendLogin);

/*
function sendRegister() {

    let loginField = document.getElementById("login-username");
    let passwordField = document.getElementById("login-password");

    let user = {
        formType: "register",
        login: loginField,
        password:

    }
}
*/
//document.getElementById("login-register").addEventListener("click", sendRegister);
const doc = document;
const menuOpen = doc.querySelector(".menu");
const menuClose = doc.querySelector(".close");
const overlay = doc.querySelector(".overlay");

menuOpen.addEventListener("click", () => {
    overlay.classList.add("overlay--active");
});

menuClose.addEventListener("click", () => {
    overlay.classList.remove("overlay--active");
});