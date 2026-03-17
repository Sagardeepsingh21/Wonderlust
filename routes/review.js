const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review= require("../models/review.js");

const validateReview = (req,res,next) =>{
     let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

// POST ROUTE
    router.post("/",validateReview, wrapAsync(async(req,res)=>{
          let listing =await Listing.findById(req.params.id);
          let newReview = new Review(req.body.review);

          listing.reviews.push(newReview._id);

          await newReview.save();
          await listing.save();

          console.log("new review saved");
          res.redirect(`/listings/${req.params.id}`);
    }));

    // Delete Review Route
    router.delete("/:reviewId",
        wrapAsync(async (req,res)=>{
            let id = req.params.id.trim();
    let reviewId = req.params.reviewId.trim();

            await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
            await Review.findByIdAndDelete(reviewId);

            res.redirect(`/listings/${id}`);
        })
    );

    module.exports=router;