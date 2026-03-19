import express from "express";

const app = express();

app.get("/test", (req , res ) => {
    res.status(200).send("Hi !");
});

app.listen(3001);