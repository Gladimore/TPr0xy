const pass = prompt("Enter Password:") || "";
let inputElement =  document.querySelector("input");

if (pass.toLowerCase() === "Im not sharing".toLowerCase()) {
  document.getElementById("password").remove();
} else {
  location.href = "/html/blank.html";
}

const links = document.querySelector(".links");

fetch("./app.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((app) => {
      let h3 = document.createElement("h3");
      h3.textContent = app[0];
      links.appendChild(h3);
      links.addEventListener("click", () => {
        inputElement.value = app[1]
        getSite();
      });
    });
  });

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

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
  document.querySelector(".overlay").style.visibility = "visible";
}

function getSite() {  
  let url = inputElement.value
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
      url = ".." + url
      location.href = url
    } else{
       alert('Choose a valid url 💀')
    }
  }
}
