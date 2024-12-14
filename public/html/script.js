const input = document.querySelector("input");
const passwordOverlay = document.getElementById("password");
const loadingOverlay = document.getElementById("websiteLoading");
const links = document.querySelector(".links");

loadingOverlay.style.visibility = "visible";

// Utility: Set a cookie
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie = `${cname}=${cvalue}; expires=${d.toUTCString()}; path=/`;
}

// Utility: Get a cookie
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  return "";
}

// Utility: Check if a string is a valid URL
function isValidURL(string) {
  return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(
    string
  );
}

// Main: Navigate to a proxied site or search using Google
function getSite(inputValue) {
  let url = inputValue || input.value || "";
  if (!url) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Input",
      text: "Please enter a valid URL or search query.",
    });
    return;
  }

  if (isValidURL(url)) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    loadingOverlay.style.visibility = "visible";
    links.style.display = "none";
    window.location.assign(`/prox/?url=${btoa(url)}`);
  } else {
    // If not a URL, perform a Google search
    const searchQuery = encodeURIComponent(url);
    const googleSearch = `https://www.google.com/search?q=${searchQuery}`;
    window.location.assign(`/prox/?url=${btoa(googleSearch)}`);
  }
}

// Handle loading of site links
async function loadSiteLinks() {
  try {
    const response = await fetch("./data/sites.json");
    const sites = await response.json();

    sites.forEach(({ name, url }) => {
      const h3 = document.createElement("h3");
      h3.textContent = name;
      links.appendChild(h3);

      h3.addEventListener("click", () => getSite(url));
    });
  } catch (error) {
    console.error("Error loading site links:", error);
  }
}

// Handle password authentication
async function checkPassword() {
  let password = getCookie("password");

  // Skip password prompt if already set or hostname matches specific criteria
  if (password || location.hostname.includes("replace")) {
    passwordOverlay.remove();
    return;
  }

  // Use SweetAlert for password prompt
  const { value: inputPassword } = await Swal.fire({
    title: "Enter Password",
    input: "password",
    inputPlaceholder: "Enter your password",
    inputAttributes: {
      maxlength: 20,
      autocapitalize: "off",
      autocorrect: "off",
    },
    showCancelButton: true,
  });

  if (!inputPassword) {
    Swal.fire({
      icon: "error",
      title: "No Password Entered",
      text: "You need to enter a password to proceed.",
    });
    location.href = "/html/blank.html";
    return;
  }

  try {
    // Send the password to the server for validation
    const response = await fetch("/password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: inputPassword }),
    });

    // Parse the server's response
    const body = await response.json();

    if (response.ok && body.success) {
      // Set a cookie if the password is valid
      setCookie("password", true, 1);
      passwordOverlay.remove();
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Redirecting to error page...",
      });
      location.href = "/html/blank.html";
    }
  } catch (error) {
    console.error("Error checking password:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred during authentication.",
    });
    location.href = "/html/blank.html";
  }
}

// Initialize the page
window.onload = async () => {
  loadingOverlay.style.visibility = "hidden";

  await checkPassword();
  await loadSiteLinks();
};

// Handle "Enter" key for input
document.body.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getSite();
  }
});
