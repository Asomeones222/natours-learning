const fs = require("fs");

/** @type {Array} */
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

module.exports.validateID = (req, res, next, id) => {
    if (+id > tours.length)
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    next();
};
module.exports.validateBody = (req, res, next) => {
    if (!req.body.name || !req.body.price)
        return res.status(400).json({
            status: "fail",
            message: "Either name or price is missing",
        });
    next();
};
module.exports.getAllTours = function (req, res) {
    // Whenever an http get method is requested for this route, this callback function will be invoked
    // This callback functions is called a Route handler
    res.status(200).json({
        status: "success",
        results: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours: tours,
        },
    });
    // res.type('json');
    // fs.createReadStream(`${__dirname}/dev-data/data/tours-simple.json`).pipe(res);
};
module.exports.getTour = function (req, res) {
    // params stores the place holder variables

    const tourId = +req.params.id;
    const tour = tours.find((_tour) => _tour.id === tourId);
    res.status(200).json({
        status: "success",
        data: {
            tour: tour,
        },
    });
};
module.exports.createTour = function (req, res) {
    // console.log(req.body);
    const id = tours.at(-1).id + 1;
    const newTour = { id: id, ...req.body };
    tours.push(newTour);

    //prettier-ignore
    fs.writeFile(
        `${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), "utf-8", () => {
            console.log("New tour saved to file");
        }
    );

    res.status(201).json({
        status: "success",
        data: {
            tour: newTour,
        },
    });
};
module.exports.updateTour = function (req, res) {
    res.status(200).json({
        status: "success",
        data: {
            tour: tours.find((tour) => tour.id === +req.params.id),
            message: "tour to be modified",
        },
    });
};
module.exports.deleteTour = function (req, res) {
    // params stores the place holder variables

    res.status(204).json({
        status: "success",
        data: null,
    });
};
