const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Error reading directory");
        }
        console.log(files);
        res.render("index", { files: files }); 
    });
});

app.get("/file/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Error reading file");
        }
        res.render('show', { filedata: filedata, filename: req.params.filename });
    });
});

app.get("/edit/:filename", function(req, res){
    res.render('edit', {filename: req.params.filename});
});

app.post("/edit", function(req, res){
    const oldName = `./files/${req.body.prev}`;
    const newName = `./files/${req.body.new.split(' ').join('')}`;

    fs.rename(oldName, newName, function(err) {
        if (err) {
            console.error("Error renaming the file:", err);
            return res.status(500).send("Error renaming the file");
        }
        res.redirect("/"); 
    });
});

app.get("/delete/:filename", function (req, res) {
    const filename = req.params.filename;
    res.render("delete", { filename: filename });
});


app.post("/delete", function (req, res) {
    const filePath = `./files/${req.body.filename}`;

    fs.unlink(filePath, function (err) {
        if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).send("Error deleting file");
        }
        console.log("File deleted successfully");
        res.redirect("/"); 
    });
});



app.post("/create", function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/");
    });
});

app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
