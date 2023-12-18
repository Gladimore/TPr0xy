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

const links = document.querySelector('.links')
  
const files = [
  [
    "Roblox", 
   "now.gg/play/roblox-corporation/5349/roblox"
  ], 
  [
    "Now.gg", 
   "now.gg"
  ], 
  [
    "Madden NFL 24 Mobile Football", 
    "now.gg/apps/electronic-arts/1731/madden-nfl-24-mobile-football.html"
  ], 
  [
    "Five Nights At Freddys", 
   "now.gg/apps/scott-cawthon/51750/five-nights-at-freddy-s.html"
  ], 
  [
    "Among Us", 
   "now.gg/apps/innersloth-llc/4047/among-us.html"
  ], 
  [
    "Retro Bowl College", 
    "now.gg/apps/new-star-games-ltd/5635/retro-bowl-college.html"
  ]
]

files.forEach(app => {
  let h3 = document.createElement('h3')
  h3.classList.add('txt')
  h3.textContent = app[0]
  links.appendChild(h3)
  links.addEventListener('click', () => {
    getSite(app[1])
  })
})

document.body.addEventListener("keydown", (event) => {
  if (event.key == 'Enter') {
    getSite();
  }
});

function getSite(url) {
  if (url === null){
    url = document.querySelector("input").value
  }
  document.querySelector(".overlay").style.visibility = "visible";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
  }

  const encodedValue = btoa(url);
  window.location.href = "/web/_" + encodedValue + "_/";
}
