const mongoose = require('mongoose');
const {Schema}=mongoose;
const Review=require("./review.js")

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travigo');
}

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    price: Number,
    image:{
        url:String,
        filename:String,
    },
    country:String,
    location:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing=new mongoose.model("Listing",listingSchema);
module.exports=Listing;
