// This file contains the server
// Fetch the environment variable declared in config.env and add them to the env object inside the process variable.
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
console.log(process.env.NODE_ENV);

const app = require("./app");
// $env:NODE_ENV="development"
const port = process.env.port || 3000;
app.listen(port, () => {
    // Called once the server starts listening.
    console.log(`App running on port: ${port}`);
});
