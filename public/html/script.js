const input = document.querySelector("input");
const loadingOverlay = document.querySelector(".overlay")
const links = document.querySelector(".links");

loadingOverlay.style.visiblity = "visible";

window.addEventListener('load', function() {
  loadingOverlay.style.visiblity = "hidden";
});

const pass = prompt("Enter Password:") || "";

if (pass.toLowerCase() === "Im not sharing".toLowerCase()) {
  document.getElementById("password").remove();
} else {
  location.href = "/html/blank.html";
}

fetch("./app.json")
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
  url = url || input.value
  
  if (isValidURL(url)){
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
