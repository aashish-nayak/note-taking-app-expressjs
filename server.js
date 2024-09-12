const express = require("express");

const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// Form Data Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use public path dir global middleware
app.use(express.static(path.join(__dirname, "public")));

// set ejs as middleware
app.set("view engine", "ejs");

// Index Page with Stored Data
app.get("/", (req, res) => {
  const directoryPath = path.join(__dirname, "files");

  // Read the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }

    // Read the content of each file
    let fileContents = [];

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      // Read the file content
      const content = fs.readFileSync(filePath, "utf8");

      let limitedContent = content;
      if (content.length > 100) {
        limitedContent = content.substring(0, 100) + "..."; // Add '...' if more than 100 characters
      }

      // Store file content with its name
      fileContents.push({
        fileName: file,
        content: limitedContent,
      });
    });

    // Render EJS with file names and contents
    res.render("index", {
      title: "Home",
      files: fileContents, // Pass file names and their content
    });
  });
});

// Store Notes
app.post("/store-note", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.note,
    () => {
      res.redirect("/");
    }
  );
});

// Show Single note
app.get("/note/:filename", (req, res) => {
  const directoryPath = path.join(__dirname, "files");
  let filename = req.params.filename;
  const filePath = path.join(directoryPath, filename);

  // Read the file content
  const content = fs.readFileSync(filePath, "utf8");

  res.render("note", {
    title: "Note",
    fileName: filename,
    content: content,
  });
});

// Dynamic Routing
app.get("/profile/:username", (req, res) => {
  let username = req.params.username;
  res.send(`Welcome ${username.toUpperCase()}`);
});

app.get("/profile/:username/:age", (req, res) => {
  let username = req.params.username;
  let age = req.params.age;
  res.send(`Welcome ${username.toUpperCase()} and your age is ${age}`);
});

app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
