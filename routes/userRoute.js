const express = require('express');
// Middleware
const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

const route = express.Router();

route
    .route("/")
    .get((req, res) => {
        getAllUsers(req, res);
    })
    .post((req, res) => {
        createUser(req, res);
    });

route
    .route("/:id")
    .get((req, res) => {
        getUser(req, res);
    })
    .patch((req, res) => {
        updateUser(req, res);
    })
    .delete((req, res) => {
        deleteUser(req, res);
    });

module.exports = route;