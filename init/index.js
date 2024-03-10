const mongoose = require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

main().then(res=>{console.log("DB Connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travigo');
}

const initDB=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65e40774e0f256317ae98461"}))
    await listing.insertMany(initData.data);
    console.log("Data was intialized"); 
}

initDB();
