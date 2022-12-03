require("dotenv").config()  // Load env variables
const express = require('express') // bring in express to make our app
const morgan = require('morgan') // nice logger for our request
const methodOverride = require('method-override') // allows us to override post request from our ejs/forms
const PORT = process.env.PORT
const FruitRouter = require('./controllers/fruit')
const UserRouter = require("./controllers/user")

const session = require('express-session');//gives us the session cookie
const MongoStore = require('connect-mongo');//reads session and allows us to connectt to mongo db and create

const app = express()

//////////////////////////////////////////////
//////// Middlewares
///////////////////////////////////////////////

app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(session({//creates the session in mongo db once logged in
  secret: process.env.SECRET,
  store: MongoStore.create({mongoUrl: process.env.DATABASE_URL}),
  saveUninitialized: true,
  resave: false,
}))


// app.get('/', homeRoutes)
// app.get('/store', storeRoutes)
// app.get('/user', userRoutes)
app.use('/fruits', FruitRouter)
app.use("/user", UserRouter)


//home route has no distinction of user or fruit so it can go here in server.js
//root route aka landing page
app.get("/", (req, res) => {
  res.render("index.ejs")
});


app.listen(PORT, ()=> console.log(`Who let the dogs out on port: ${PORT}`))