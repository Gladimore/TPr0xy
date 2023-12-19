const pass = prompt("Enter Password:") || "";

if (pass.toLowerCase() === "Im not Sharing".toLowerCase()) {
  document.getElementById("password").remove();
} else {
  location.href = "/html/blank.html";
}

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

const links = document.querySelector(".links");

fetch("./app.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((app) => {
      let h3 = document.createElement("h3");
      h3.textContent = app[0];
      links.appendChild(h3);
      links.addEventListener("click", () => {
        getSite(app[1]);
      });
    });
  });

document.body.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    getSite();
  }
});

function getSite(url) {
  links.remove();
  if (url === null) {
    url = document.querySelector("input").value;
  }
  document.querySelector(".overlay").style.visibility = "visible";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  const encodedValue = btoa(url);
  window.location.href = "/web/_" + encodedValue + "_/";
}
