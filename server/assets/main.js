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

// quality of life plagiarism - https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
function get_cookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
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


let pageNum = 0;

if (get_cookie('secureUserHash') != "") {
    document.getElementById('handle').value = get_cookie('secureUserHash');
    document.getElementById('username').style = "display: inline-block; color: white;";
    document.getElementById('username').innerHTML = "Private user handle: " + document.getElementById('handle').value;
}
var postsRequest = new XMLHttpRequest();
postsRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {

        var rawData = JSON.parse(postsRequest.responseText);
        var wholePage;

        console.log('starting parsing posts');

        for (var i = 0; i < rawData.length; i += 1) {
            wholePage += '<div className="post">'
                + '<div class="post-name"><h2>' + rawData[i]["topic"] + '</h2></div>'
                + '<div class="post-creator">' + rawData[i]["handle"] + '</div>'
                + '<div class="post-discription"><p>';
            if (rawData[i]["imgUrl"].length > 0) {
                wholePage += '<img src="' + rawData[i]["imgUrl"] + '" alt="image">';
            }
            wholePage += rawData[i]["content"] + '</p></div></div>';
        }

        console.log('finished parsing posts');

        document.getElementById("postings").innerHTML = wholePage;
    }
};

postsRequest.open("GET", "/getPost/" + pageNum.toString(), true);
postsRequest.send();