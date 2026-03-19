const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const validateListing = (req,res,next) =>{
     let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};
// Index Route
router.get("/",wrapAsync(async(req,res)=>{
      const allListings= await Listing.find({});
         res.set("Cache-Control", "no-store"); 
      res.render("listings/index.ejs",{allListings});
    }));

    // New Route
    router.get("/new",(req,res)=>{
        res.render("listings/new.ejs");
    });
     

    //  Show Route
    router.get("/:id",wrapAsync(async(req,res)=>{
        let{ id} = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs",{listing});
    }));

    // Create Route
    router.post("/",
         (req,res,next)=>{
        console.log("BODY:", req.body);
        next();
    },
        validateListing,
        wrapAsync(async(req,res,next) => {
        const newListing= new Listing(req.body.listing);   
        await newListing.save();
        req.flash("success","New Listing Created");
        res.redirect("/listings");
    })
);

    // Edit Route
    router.get("/:id/edit",wrapAsync(async(req,res)=>{
        let{ id} = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/edit.ejs",{listing});
    }));


    // update Route
    router.put("/:id",
        wrapAsync(async(req,res)=>{
             if(!req.body.listing) {
            throw new ExpressError(400,"Send valid Data for listing");
        }
        let {id} =req.params;
         await Listing.findByIdAndUpdate(id, {...req.body.listing});
         res.redirect(`/listings/${id}`);
    })
);

    // Delete Route
    router.delete("/:id",
        wrapAsync(async(req,res)=>{
        let { id }=req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    })
);

module.exports =router;