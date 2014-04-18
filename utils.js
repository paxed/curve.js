
function $(e) { return document.getElementById(e); }

function setcookie(name,value,expiredays) {
    var d = new Date();
    d.setTime(d.getTime()+(expiredays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = name + "=" + value + "; " + expires;
}

function getcookie(name) {
    var n = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
	var c = ca[i].trim();
	if (c.indexOf(name)==0) return c.substring(n.length,c.length);
    }
    return "";
}

function erasecookie(name) {
    setcookie(name,"",-1);
}
