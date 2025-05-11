const express = require('express');
const dbSingleton = require('../dbSingleton');
const router = express.Router();

const db = dbSingleton.getConnection();

//adding a new user
router.post("/", async (req, res) => {
    const { title, content, author } = req.body;
    const query =
        "INSERT INTO articles (title, content, author) VALUES (?, ?, ?)";
    db.query(query, [title, content, author], (err, results) => {
    if (err) {
        res.status(500).send(err);
            return;
        }
        res.json({ message: "User added!", id: results.insertId });
    });
});

// קבלת כל המאמרים
router.get("/", async (req, res) => {
  const query = "SELECT * FROM articles";
    query(query, (err, results) => {
    if (err) {
        res.status(500).send(err);
            return;
        }
    res.json(results);
    });
});
// קבלת מאמר לפי מזהה
router.get("/:id", async (req, res) => {
    const articleId = req.params.id;
    const query = "SELECT * FROM articles WHERE id = ?";
    db.query(query, [articleId], (err, results) => {
    if (err) {
    res.status(500).send(err);
    return;
}

if (results.length === 0) {
    res.status(404).json({ message: "Article not found" });
    return;
}

    res.json(results[0]);
    });
});
// מחיקת מאמר לפי מזהה
router.delete("/:id", async (req, res) => {
const articleId = req.params.id;
const query = "DELETE FROM articles WHERE id = ?";
db.query(query, [articleId], (err, results) => {
if (err) {
    res.status(500).send(err);
    return;
}

if (results.affectedRows === 0) {
    res.status(404).json({ message: "Article not found" });
    return;
}
        res.json({ message: "Article deleted successfully" });
    });
});
// קבלת רשימת מאמרים לפי שם המחבר
router.get("/by-author/:author", async (req, res) => {
const authorName = req.params.author;
const query = "SELECT * FROM articles WHERE author = ?";
db.query(query, [authorName], (err, results) => {
    if (err) {
    res.status(500).send(err);
    return;
}
    res.json(results);
});
});
// קבלת רשימה של מאמרים שנוצרו לאחר תאריך מסוים
router.get("/after-date/:date", async (req, res) => {
const { date } = req.params;
const query = "SELECT * FROM articles WHERE created_at > ?";
db.query(query, [date], (err, results) => {
if (err) {
    res.status(500).send(err);
    return;
}
    res.json(results);
    });
});
//קבלת רשימת מאמרים ממוינים לפי תאריך יצירה
router.get("/sorted/by-date", async (req, res) => {
const query = "SELECT * FROM articles ORDER BY created_at DESC";
db.query(query, (err, results) => {
if (err) {
    res.status(500).send(err);
    return;
}
res.json(results);
});
});
//קבלת מספר המאמרים במסד הנתונים
router.get("/count", async (req, res) => {
const query = "SELECT COUNT(*) AS total FROM articles";
db.query(query, (err, results) => {
if (err) {
    res.status(500).send(err);
    return; 
}
res.json(results[0]);
});
});
//חיפוש מאמרים לפי מילת מפתח בכותרת
router.get("/search/:keyword", async (req, res) => {
const keyword = req.params.keyword;
const query = "SELECT * FROM articles WHERE title LIKE ?";
db.query(query, [`%${keyword}%`], (err, results) => {
if (err) {
    res.status(500).send(err);
    return;
}
 res.json(results);
});
});
//קבלת רשימת מחברים ללא כפילויות
router.get("/authors/distinct", async (req, res) => {
const query = "SELECT DISTINCT author FROM articles";
db.query(query, (err, results) => {
if (err) {
    res.status(500).send(err);
    return;
}
res.json(results.map((row) => row.author));
});
});

module.exports = router;

