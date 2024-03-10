if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

const dbUrl=process.env.ATLASDB_URL;
const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const methodOverride=require("method-override")
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

main().then(res=>{console.log("DB Connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate)

// app.get("/",(req,res)=>{
//     res.send("I am Root")
// })

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",(err)=>{
  console.log("Error is Mongo Store",err)
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}


app.use(session(sessionOptions));
app.use(flash());

// Session is reqired for using passport so for that we write it below session is declared
// passport.initalize is used to intialized the passport and passport.session is used to connect it with session part
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success"),
  res.locals.error=req.flash("error"),
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not Found!"))
})

app.use((err,req,res,next)=>{
let{statusCode=500,message="Something Went Wrong!"}=err;
res.status(statusCode).render("error.ejs",{err});
// res.status(statusCode).send(message);
})
 
app.listen(8080,(req,res)=>{
    console.log("Server is Running");
})


// app.get("/testing",async(req,res)=>{
//     let sample=new listing({
//         title:"My Home",
//         description:"My Sweet home",
//         image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         location:"Goa",
//         country:"India",
//     });

//     await sample.save();
//     console.log(sample);
//     res.send("Testing Successfull");
// });