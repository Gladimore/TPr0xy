const input = document.querySelector("input");
const passwordOverlay = document.getElementById('password')
const loadingOverlay = document.getElementById("websiteLoading")
const links = document.querySelector(".links");

loadingOverlay.style.visiblity = "visible";

window.addEventListener('load', function() {
  loadingOverlay.style.visiblity = "hidden";
});

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
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

function checkCookie() {
  let password = getCookie("password");
  
  if (password != "") {
    passwordOverlay.remove();
  } else {
    fetch('./data/password.json')
    .then((res) => res.json())
    .then((data) => {
      const pass = prompt("Enter Password:") || "";

      if (pass.toLowerCase() === data[0].toLowerCase()) {
        setCookie("password", true, 1);
        passwordOverlay.remove();
      } else {
        location.href = "/html/blank.html";
      }
    })
  }
}
checkCookie();

fetch("./data/app.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((app) => {
      let h3 = document.createElement("h3");
      h3.textContent = app[0];
      links.appendChild(h3);
      h3.addEventListener("click", () => {
        getSite(app[1]);
      });
    });
  });

document.body.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    getSite();
  }
});

function isValidURL(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

function validSite(){
  links.remove()
  loadingOverlay.style.visibility = "visible";
}

function getSite(url) {  
  url = url || input.value || ""
  
  if (isValidURL(url) && !url.includes('web')){
    validSite()
    
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    const encodedValue = btoa(url);
    location.href = "/web/_" + encodedValue + "_/";
  } else{
    if (url.includes('web')){
      validSite();
      url = "//" + location.hostname + url

      location.href = url
    } else{
       alert('Choose a valid url 🤓')
    }
  }
}
