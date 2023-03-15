// This file contains the server; we do all the setup here.
// Fetch the environment variable declared in config.env and add them to the env object inside the process variable.
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const databaseURI = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(databaseURI, {
        // No longer necessary as of mongoose 6
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then((connection) => {
        console.log(connection);
        console.log("Connected to database");
    });

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tour must have a name"],
        unqiue: true, // No two documents can have the same name
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, "Tour must have a price"],
    },
});

// Created a model from the schema from which we can create documents
const Tour = mongoose.model("Tour", tourSchema);

const app = require("./app");
// $env:NODE_ENV="development"
const port = process.env.port || 3000;
app.listen(port, () => {
    // Called once the server starts listening.
    console.log(`App running on port: ${port}`);
});
