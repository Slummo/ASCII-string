const figlet = require("figlet");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 8888;

app.use(express.static(path.join(__dirname, "public")));

app.get("/ascii", async (req, res) => {
  try {
    const string = req.query.string;
    const font = req.query.font || "Standard";

    if (!string) {
      return res.status(400).send("ERROR 400: Missing 'string' parameter!");
    }

    figlet.text(string, { font }, function (err, data) {
      if (err) {
        console.error("Error generating ASCII art:", err);
        return res.status(500).send("ERROR 500: Internal Server Error");
      }
      res.send(`<pre>${data}</pre>`);
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("ERROR 500: Internal Server Error");
  }
});

app.get("/fonts", (req, res) => {
  try {
    const fonts = fs
      .readFileSync("fonts.txt", "utf-8")
      .split("\n")
      .map((font) => font.trim())
      .filter((font) => font !== "");

    const list = req.query.list;

    if (!list) {
      return res.status(400).send("ERROR 400: Missing 'list' parameter!");
    } else if (list == "True") {
      res
        .status(200)
        .send(`<ul>${fonts.map((font) => `<li>${font}</li>`).join("")}</ul>`);
    } else if (list == "False") {
      res.status(200).json({ fonts: fonts });
    } else {
      return res
        .status(400)
        .send("ERROR 400: 'list' parametere must be either 'True' or 'False'");
    }
  } catch (err) {
    console.error("Error reading fonts file:", err);
    res.status(500).send("ERROR 500: Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
