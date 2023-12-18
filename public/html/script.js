const pass = prompt("Enter Password:") || "";

if (pass.toLowerCase() === "Im Not Sharing".toLowerCase()) {
      document.getElementById("password").remove()
} else {
  location.href = '/html/blank.html'
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

document.body.addEventListener("keydown", (event) => {
  if (event.key == 'Enter') {
    getSite();
  }
});

function getSite() {
  document.querySelector(".overlay").style.visibility = "visible";
  let inputValue = document.querySelector("input").value;

  if (!inputValue.startsWith("http://") && !inputValue.startsWith("https://")) {
    inputValue = "http://" + inputValue;
  }

  const encodedValue = btoa(inputValue);
  window.location.href = "/web/_" + encodedValue + "_/";
}
