const Listing=require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.session.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must logged in to access");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// To check the owner for displaying edit and delete route
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    // console.log(listing.owner);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don'thave permission to edit this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// For Validation using joi on server for listing
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  // mergeParams is used to send the data(ie id) from parent to child too. eg without it id of reviews are not send to review route it only stay at app.js only.
// For validation of Reviews on server Side using Joi
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }