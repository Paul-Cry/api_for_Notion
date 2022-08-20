const express = require("express");
const moduleToFetch = require("./index");
const getDatabase = moduleToFetch.getDatabase;
// importing our function
const newEntryToDatabase = moduleToFetch.newEntryToDatabase;
const controller = require('./index')
const port = 8000;

const app = express();

app.use(express.static("public"));
app.use(
    express.urlencoded({
        extended: true,
    })
);


controller.HHru('niekita20020802@gmail.com','0313833310Nik')



app.listen(port, console.log(`Server started on ${port}`));