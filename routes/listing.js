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

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,
    (req, res, next) => {
        console.log("BODY:", req.body);
        next();
    },
    validateListing,
    wrapAsync(listingController.createListing));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewform);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updatelistings))
.delete( isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditform));

module.exports = router;