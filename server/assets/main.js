document.getElementById('login-register').addEventListener('click', () => {
    // similar behavior as clicking on a link
    window.location.href = "register.html";
});

document.getElementById('login-show').addEventListener('click', () => {
    // similar behavior as clicking on a link
    document.getElementById('login-box').style = "display: block; position: fixed;";
});

document.getElementById('login-close').addEventListener('click', () => {
    // similar behavior as clicking on a link
    document.getElementById('login-box').style = "display: none;";
});

let pageNum = 0;

// quality of life plagiarism - https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
function get_cookie(name){
    return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
    });
}

function delete_cookie(name, path, domain ) {
    if( get_cookie( name ) ) {
        document.cookie = name + "=" +
            ((path) ? ";path="+path:"")+
            ((domain)?";domain="+domain:"") +
            ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

if (document.cookie.indexOf('error') != -1) {
    var cookieList = document.cookie.split(';');
    var c;
    for (var i = 0; i < cookieList.length; i++) {
        c = cookieList[i].trim();
        if ((c.indexOf(name)) == 0) {
            c = c.substr(name.length);
            break;
        }

    }
    console.log(c);
    var errorBlock = document.getElementById('login-error');
    errorBlock.style = 'display: block;';
    var cValue = c.split('=')[1];
    errorBlock.innerHTML = cValue.split('_')[0] + " " + cValue.split('_')[1];
    delete_cookie("error", '/', 'localhost');
}

var postsRequest = new XMLHttpRequest();
postsRequest.onreadystatechange = () => {
    if (this.readyState == 4 && this.status == 200) {

        var rawData = XMLHttpRequest.responseText;

        var wholePage;


        document.getElementById("postings").innerHTML = wholePage;
    }
};
postsRequest.open("GET", "getPost/" + pagenNum.toString(), true);
postsRequest.send();