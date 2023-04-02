const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tour must have a name"],
        unique: true, // No two documents can have the same name
    },
    duration: {
        type: Number,
        required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"],
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
    },
    ratingsQunatity: {
        type: Number,
    },
    price: {
        type: Number,
        required: [true, "Tour must have a price"],
    },
    priceDiscount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "A true must have a cover image"],
    },
    images: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        select: false,
    },
    startDates: {
        type: [Date],
    },
});

// Created a model from the schema from which we can create documents
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
