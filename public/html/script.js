const input = document.querySelector("input");
const passwordOverlay = document.getElementById("password");
const loadingOverlay = document.getElementById("websiteLoading");
const links = document.querySelector(".links");

loadingOverlay.style.visiblity = "visible";

window.addEventListener("load", function () {
  loadingOverlay.style.visiblity = "hidden";
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

window.onload = function () {
  let password = getCookie("password");

  if (
    password != "" ||
    password == undefined ||
    location.hostname.includes("replit") /* For testing */
  ) {
    passwordOverlay.remove();
  } else {
    fetch("./data/password.json")
      .then((res) => res.json())
      .then((data) => {
        const pass = prompt("Enter Password:") || "";

        if (pass.toLowerCase() === data[0].toLowerCase()) {
          setCookie("password", true, 1);
          passwordOverlay.remove();
        } else {
          location.href = "/html/blank.html";
        }
      });
  }

  const data = [
      [
        "Now.gg",
        "https://now.gg"
      ],
      [
        "Genshin Impact",
        "https://now.gg/play/cognosphere-pte-ltd-/1773/genshin-impact"
      ],
      [
        "Fortnite",
        "https://now.gg/play/epic-games/7308/fortnite"
      ],
      [
        "Roblox",
        "https://now.gg/play/roblox-corporation/5349/roblox"
      ],
      [
        "Madden Mobile",
        "https://now.gg/play/electronic-arts/1731/madden-nfl-24-mobile-football"
      ],
      [
        "Call of Duty",
        "https://now.gg/play/activision-publishing-inc/7935/call-of-duty"
      ],
      [
        "Stumble Guys: Multiplayer Royale",
        "https://now.gg/play/kitka-games/7999/stumble-guys"
      ],
      [
        "EA SPORTS FC MOBILE 24 SOCCER",
        "https://now.gg/play/electronic-arts/1353/ea-sports-fc-mobile-24-soccer"
      ],
      [
        "TikTok",
        "https://now.gg/play/tiktok/4478/tiktok",
      ],
    [
      "Youtube",
      "https://now.gg/play/google-llc/1395/youtube"
    ]
    ]
  data.forEach((app) => {
    let h3 = document.createElement("h3");
    h3.textContent = app[0];
    links.appendChild(h3);

    h3.addEventListener("click", () => {
      getSite(app[1]);
    });
  })
};

document.body.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    getSite();
  }
});

function isValidURL(string) {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}

function validSite() {
  links.remove();
  loadingOverlay.style.visibility = "visible";
}

function getSite(url) {
  url = url || input.value || "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  if (isValidURL(url)) {
    validSite();
    window.location.assign(`/prox/?url=${btoa(url)}`);
  } else {
    alert("Choose a valid url 🤓");
  }
}
