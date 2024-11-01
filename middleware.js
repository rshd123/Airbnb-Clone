const Listing = require("./Models/listing.js");
const Review  = require("./Models/review.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema} = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must Login First!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.listingAuth = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.reviewAuth = async (req,res,next)=>{
    console.log(req.params);
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You can't edit this Review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req,res,next)=>{
    console.log("New Data: \n"+req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    };
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(req.body)
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};