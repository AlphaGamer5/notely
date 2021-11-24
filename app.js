const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors")


const app = express();
const PORT = process.env.PORT || 8000;
const dbPath = path.join(__dirname, "notes.db");
let db = null;

//MiddleWares
app.use(express.json());
app.use(cors());

//Starrting the server and connecting to database
const serverAndDb = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const query = `
            CREATE TABLE IF NOT EXISTS note(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                category TEXT
            )
        `;

        await db.run(query)

        app.listen(PORT, () => {
            console.log(`Server Started at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

serverAndDb();

//GET all notes
app.get("/notes/", async (req, res) => {
    const query = `
        SELECT *
        FROM note
    ;`;

    const notes = await db.all(query);
    res.send(notes);
})

//CREATE a note
app.post("/notes/", async (req, res) => {
    const { title, description, category } = req.body;
    const query = `
        INSERT INTO note(title, description, category)
        VALUES ("${title}", "${description}", "${category}")
    ;`;

    await db.run(query);
    res.send("Note Successfully Created");
})

//DELETE a note
app.delete("/notes/:noteId", async (req, res) => {
    const { noteId } = req.params;
    const query = `
        DELETE FROM note
        WHERE id = ${noteId}
    ;`;

    await db.run(query);
    res.send("Note Successfully Deleted");
})
