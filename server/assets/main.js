
function showError() {
    // just some red text displaying all of the criteria
}

function setServer() {

}

function sendLogin() {
    let loginField = document.getElementById("login-username").value;
    let passwordField = document.getElementById("login-password").value;

    // communicate using xmlhttp, everyone else seems to be using that

    var xmlurl = "login&login=" + loginField + "&passwd=" + passwordField; // the resource our server is asked to serve, /board is the main page
    let xmlhttp = new XMLHttpRequest();

    // add &user=xyz&password=enc_xyz, redirect to a php script, that will get a record from node.js server, that will get a record from a mongoDB
    xmlhttp.open("POST", xmlurl, true);
    xmlhttp.send();

    document.getElementById("demo").innerHTML = xmlhttp.responseText;
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