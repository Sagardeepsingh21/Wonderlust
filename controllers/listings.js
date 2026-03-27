const Listing =require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.set("Cache-Control", "no-store");
    res.render("listings/index.ejs", { allListings });
}