const express = require("express");
const http = require("http");
const path = require("path")

const app = express();

var distDir = __dirname + "/dist/";
app.get("/", (req, res) => {
    res.sendFile(path.join(distDir, "index.html"))
});

const port = process.env.PORT || "3001";
app.set("port", port);

const server = http.createServer(app);
server.listen(port, () => console.log("Running..."));
