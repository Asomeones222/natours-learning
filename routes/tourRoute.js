const express = require("express");

// Handler functions or middleware
const {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
} = require("../controllers/tourController");

// Create a router for each api resource. We can connect this router as a middleware. This way we can create a route for each resource.
const router = express.Router();

// param method calls a handler function (controller) only if a certain url parameter is present. In this case it's id.
router.param("id", (req, res, next, id) => {
    console.log(`Parameter value is ${id}`);
    // validateID(req, res, next, id);
    next();
});

router
    // Since tourRoute runs at api/v1/tours then we don't have to specify it. Anything specified here will be added to the route
    // Here it will be api/v1/tours/
    .route("/")
    .get((req, res) => {
        getAllTours(req, res);
    })
    .post((req, res) => {
        createTour(req, res);
    });

router
    // This here is api/v1/tours/:id
    .route("/:id")
    .get((req, res) => {
        getTour(req, res);
    })
    .patch((req, res) => {
        updateTour(req, res);
    })
    .delete((req, res) => {
        deleteTour(req, res);
    });

module.exports = router;
