const Tour = require("../model/tourModel");

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
        // Build query. Use map for quick delete
        const queryMap = new Map(Object.entries(req.query));
        console.log(queryMap);
        const excludedQueries = ["page", "limit", "fields"];
        excludedQueries.forEach((el) => queryMap.delete(el));
        console.log(queryMap);
        const queryObj = JSON.parse(
            JSON.stringify(Object.fromEntries(queryMap)).replace(
                /\b(gte|gt|lte|lt)\b/g,
                (matchedString) => `$${matchedString}`
            )
        );

        // Sort
        let query = Tour.find();
        if (queryObj.sort) {
            query = query.sort(queryObj.sort);
        }
        // Only sent wanted fields using the select method on the query
        if (req.query.fields) {
            console.log("Fields are");
            const { fields } = req.query;
            query = query.select(fields.split(",").join(" "));
        }
        // Always remove __v from the response
        query = query.select("-__v");

        // Pagination using the skip method on the query
        let { page, limit } = req.query;
        page = +page.slice(0, 5) || 1;
        console.log(page);
        limit = +limit.slice(0, 5) || 10;
        query = query.skip((page - 1) * limit).limit(limit);

        const tours = await query;

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
