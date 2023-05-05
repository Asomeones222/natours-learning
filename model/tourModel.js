const mongoose = require("mongoose");
const slugify = require("slugify");
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tour must have a name"],
            unique: true, // No two documents can have the same name
        },
        slug: {
            type: String,
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
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        // Schema options
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual("durationWeeks").get(function () {
    // Not anfn since we need the this keyword which points here to the current document
    return this.duration / 7;
});

// Document middleware which runs before (pre) the saving of a document. Only on .save() & .create() methods
tourSchema.pre("save", function (next) {
    // the this keyword points to the current document being processed
    console.log(this);
    this.slug = slugify(this.name, { lower: true });
    // Always call next
    next();
});
tourSchema.post("save", function (doc, next) {
    console.log(doc);
    next();
});

// find is for query
tourSchema.pre("find", function (next) {
    // this points to a query object not a document
    this.find({ secretTour: { $ne: true } });
    next();
});

// Aggregation middleware
tourSchema.pre("aggregate", function (next) {
    // this points to the aggregate object
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});

// Created a model from the schema from which we can create documents
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
