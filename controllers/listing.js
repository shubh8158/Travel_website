const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");

// Controller for Index Route
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

// Controller for New Route
module.exports.renderNewForm=(req, res) => {
    res.render("./listings/new.ejs");
};

// COntrollers for Show Route
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if (!listing) {
      req.flash("error", "No such listing Exists!");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  }

//   Controllers for Create Route
module.exports.createNewListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
};

// COntrollers for Edit Route
module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "No such listing Exists!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload","/upload/h_200,w_250")
    res.render("./listings/edit.ejs", { listing,originalImageUrl });
  }

//   Controllers for Update route
module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data listing");
    }
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

// Controllers for Delete Route
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }  