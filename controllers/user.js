////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// The Signup Routes (Get => form, post => submit form)
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs")
})


//OLD ROUTER.POST
//router.post("/signup", (req, res) => {
//    res.send("signup")
//})
router.post("/signup", async (req, res) => {//wraps the callback in promis and wait  to finish before the next line
  // encrypt password
  req.body.password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))//passing the password with 10 degrees of dificulty.
  // create the new user
  User.create(req.body, (err, user) => {//create the user using the req.body info aka user and pass
      //redirect to login page
      res.redirect("/user/login")
  })
})

// The login Routes (Get => form, post => submit form)
router.get("/login", (req, res) => {
    res.render("user/login.ejs")
})


//OLD
//outer.post("/login", (req, res) => {
//    res.send("login")
//})
router.post("/login", (req, res) => {
  // get the data from the request body
  const { username, password } = req.body;//aka req.body.username, req.body.password
  User.findOne({ username }, (err, user) => {//find user name that matches username in req.body
    // checking if userexists. If we don not find the user in the collection send string "user doesnt exist"
    if (!user) {
      res.send("user doesn't exist");
    } else {
      //check if password matches if user is found
      const result = bcrypt.compareSync(password, user.password);//compareSyync method in bcrypt
      if (result) {//if result is true, go to /fruits aka or say "wrong password"
        req.session.username = username;
        req.session.loggedIn = true;
        res.redirect("/fruits");
      } else {
        res.render('user/login.ejs', {data: "wrong password"});
        //res.send('wong password)
      }
    }
  });
});


//logout route to destroy the session
router.get("/logout", (req, res) => {
  // destroy session and redirect to main page
  req.session.destroy((err) => {
      res.redirect("/")
  })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;