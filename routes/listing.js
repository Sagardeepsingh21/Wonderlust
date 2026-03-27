const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { authorize } = require("passport");
const listingController= require("../controllers/listings.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewform);


//  Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/", isLoggedIn,
    (req, res, next) => {
        console.log("BODY:", req.body);
        next();
    },
    validateListing,
    wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditform));


// update Route
router.put("/:id",
    isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updatelistings));


// Delete Route
router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;