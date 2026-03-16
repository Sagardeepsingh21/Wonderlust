const express = require("express");
const path = require("path");
const app= express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
// const path = require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review= require("./models/review.js");

const listings = require("./routes/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "public")));


app.get("/",(req,res)=>{
    res.send("Hi,i am root");
});

const validateListing = (req,res,next) =>{
     let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};


const validateReview = (req,res,next) =>{
     let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=> el.message).join(",");
            throw new ExpressError(400,errMsg);
        }else{
            next();
        }
};

app.use("/listings", listings);
    
// Reiveiws
// POST ROUTE
    app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
          let listing =await Listing.findById(req.params.id);
          let newReview = new Review(req.body.review);

          listing.reviews.push(newReview._id);

          await newReview.save();
          await listing.save();

          console.log("new review saved");
          res.redirect(`/listings/${req.params.id}`);
    }));

    // Delete Review Route
    app.delete("/listings/:id/reviews/:reviewId",
        wrapAsync(async (req,res)=>{
            let id = req.params.id.trim();
    let reviewId = req.params.reviewId.trim();

            await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
            await Review.findByIdAndDelete(reviewId);

            res.redirect(`/listings/${id}`);
        })
    );

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price : 1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// 404 route
app.use((req,res,next) => {
    next(new ExpressError(404,"Page not found!"));
});

// error middleware
app.use((err,req,res,next) =>{
    let { status = 500, message = "Something went wrong!" } = err;
     res.status(status).render("error.ejs",{message: err.message});
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
}); 