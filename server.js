// This file contains the server; we do all the setup here.
// Fetch the environment variable declared in config.env and add them to the env object inside the process variable.
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

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
    .then(() => {
        // console.log(connection);
        console.log("Connected to database");
    });

// $env:NODE_ENV="development"
const port = process.env.port || 3000;
app.listen(port, () => {
    // Called once the server starts listening.
    console.log(`App running on port: ${port}`);
});
