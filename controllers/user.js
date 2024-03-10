const User=require("../models/user.js");

// Controller FOr SIgnUp
module.exports.signUp=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome to Travigo!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", "Username Exists");
      res.redirect("/signup");
    }
  }

//   To render Login Form
module.exports.renderLoginForm=(req, res) => {
    res.render("./users/login.ejs");
  }

// To Login
module.exports.login=async (req, res) => {
    req.flash("success","Welcome Back!");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }
  
//   To logOut
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success","You are Logged out!");
      res.redirect("/listings");
    })
  }