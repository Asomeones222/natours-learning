const Tour = require("../model/tourModel");
const APIFeatures = require("../utils/apiFeatures.js");

module.exports.validateBody = (req, res, next) => {
    if (!req.body.name || !req.body.price)
        return res.status(400).json({
            status: "fail",
            message: "Either name or price is missing",
        });
    next();
};
module.exports.getAllTours = async function (req, res) {
    // Whenever an http get method is requested for this route, this callback function will be invoked
    // This callback functions is called a Route handler
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;
        res.status(200).json({
            status: "success",
            requestedAt: req.requestTime,
            data: {
                length: tours.length,
                tours: tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });

        console.log(err);
    }
};
module.exports.getTour = async function (req, res) {
    // params stores the place holder variables

    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour: tour,
            },
        });
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: err,
        });
    }
};
module.exports.createTour = async function (req, res) {
    // The create method on the Tour model will create and save the document to the database
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
};
module.exports.updateTour = async function (req, res) {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                // Returns the new updated document rather than the original
                new: true,
                // Validates data upon update
                runValidators: true,
            }
        );
        res.status(200).json({
            status: "success",
            data: {
                tour: updatedTour,
            },
        });
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: err,
        });
    }
};
module.exports.deleteTour = async function (req, res) {
    // params stores the place holder variables
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({});
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};
module.exports.aliasTopFiveCheapest = function (req, res) {
    req.query.limit = "5";
    req.query.sort = "price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty";
};

module.exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: { $toUpper: "$difficulty" },
                    avgRating: { $avg: "$ratingsAverage" },
                    numOfTours: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            { $sort: { avgPrice: 1 } },
            // { $match: { _id: { $ne: "EASY" } } },
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats: stats,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

module.exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = +req.params.year;
        const plan = await Tour.aggregate([
            {
                $unwind: "$startDates",
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numOfTourStarts: { $sum: 1 },
                    tours: { $push: "$name" },
                },
            },
            {
                $sort: {
                    numOfTourStarts: -1,
                },
            },
            {
                $addFields: {
                    month: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $limit: 12,
            },
        ]);

        res.status(200).json({
            status: "success",
            data: {
                plan: plan,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};
