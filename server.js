const http = require("http");
const https = require("https");
const fs = require("fs");
const config = require("./config.json");
const Proxy = require("./lib/index");

// Create proxy instance
const proxy = new Proxy(config.prefix, {
  localAddress: config.localAddresses || false,
  blacklist: config.blockedHostnames || false,
});

// Constants
const indexFile = "/index.html";
const atob = (str) => Buffer.from(str, "base64").toString("utf-8");
const API_PASSWORD = process.env.API_PASSWORD;

// Route handlers
const routes = {
  "/prox": handleProxifiedRequest,
  "/prox/": handleProxifiedRequest,
  "/session": handleProxifiedRequest,
  "/session/": handleProxifiedRequest,
  "/password/": passwordRequest,
};

// General route handler
const app = (req, res) => {
  // HTTP(S) proxy
  if (req.url.startsWith(config.prefix)) {
    return proxy.http(req, res);
  }

  // Parse URL and query parameters
  req.pathname = req.url.split("#")[0].split("?")[0];
  req.query = Object.fromEntries(
    new URLSearchParams(req.url.split("?")[1] || "").entries(),
  );

  // Check for specific routes
  if (routes[req.pathname]) {
    return routes[req.pathname](req, res);
  }

  // Default to serving static files
  serveStaticFiles(req, res);
};

function passwordRequest(req, res) {
  if (req.method !== "POST") {
    return errorResponse(res, 405, "Method Not Allowed");
  }

  let body = "";

  // Listen for data chunks
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  // Handle end of data
  req.on("end", () => {
    try {
      // Parse the JSON body
      const parsedBody = JSON.parse(body);

      if (parsedBody.password === API_PASSWORD) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid password" }));
      }
    } catch (err) {
      // Handle JSON parsing errors
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Invalid JSON body" }));
    }
  });
}
// Handler for proxified requests
function handleProxifiedRequest(req, res) {
  if (!req.query.url) {
    return errorResponse(res, 400, "Missing `url` parameter");
  }

  let url = atob(req.query.url);

  if (!url.startsWith("http")) {
    url = url.startsWith("//") ? "http:" + url : "http://" + url;
  }

  res.writeHead(301, {
    location: config.prefix + proxy.proxifyRequestURL(url),
  });
  res.end("");
}

// Serve static files
function serveStaticFiles(req, res) {
  const publicPath =
    __dirname + "/public" + (req.pathname === "/" ? indexFile : req.pathname);

  fs.lstat(publicPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return errorResponse(res, 404, `Cannot ${req.method} ${req.pathname}`);
    }

    // Set the correct Content-Type header for CSS and JS
    const ext = publicPath.split(".").pop();
    const mimeTypes = {
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      png: "image/png",
      jpg: "image/jpeg",
      svg: "image/svg+xml",
    };

    res.setHeader("Content-Type", mimeTypes[ext] || "text/plain");

    // Pipe the file to the response
    fs.createReadStream(publicPath).pipe(res);
  });
}

// General error response
function errorResponse(res, statusCode, message) {
  res.statusCode = statusCode;
  res.end(
    fs
      .readFileSync(__dirname + "/lib/error.html", "utf-8")
      .replace("%ERR%", message),
  );
}

// Create server
const server = config.ssl
  ? https.createServer(
      {
        key: fs.readFileSync("./ssl/default.key"),
        cert: fs.readFileSync("./ssl/default.crt"),
      },
      app,
    )
  : http.createServer(app);

// WebSocket proxy
proxy.ws(server);

// Start server
const port = process.env.PORT || config.port;
server.listen(port, () => {
  console.log(`${config.ssl ? "https://" : "http://"}0.0.0.0:${port}`);
});
