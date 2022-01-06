// required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const displayNotes = require('./db/db.json');

// Create server application at port 3001
const app = express();
const PORT = process.env.PORT || 3001;


// This is required for API calls!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use public folder
app.use(express.static('public'));

// GET Method to display all notes
app.get('/api/notes', (req, res) => {
    res.json(displayNotes);
});

// when page load, it will start with index.html
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Notes html page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

  // POST Method to create new notes
app.post('/api/notes', (req, res) => {
function createNewNotes(body, notesArray) {
    const newNote = body;


     // This assigns an ID to the newNote. 
    if (displayNotes.length == 0){
        req.body.id = "0";
    } else{
        req.body.id = JSON.stringify(JSON.parse(displayNotes[displayNotes.length -1].id) + 1);
    }
    
     // Write the db.json file
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray,null,1),
        function (err) {

            if (err) {
                return console.log(err);
            }
         });
    console.log("Your note was saved!");
    return newNote;
        };

     // returns new note in JSON format.
const newNote = createNewNotes(req.body, displayNotes);
res.json(newNote);
});

// Delete a note based on an ID
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray,null,1),
            );

            console.log("Your note was deleted!");
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, displayNotes);
    res.json(true);
});


// Listening is the last thing in Express. This sets up the server.
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});