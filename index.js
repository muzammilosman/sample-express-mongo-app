var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var passport = require('passport')

var app = express();

require('./config/passport')(passport)    

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


//Setting up and connecting to mongoDB
mongoose.Promise = global.Promise;
const db = require('./config/keys').MongoURL
mongoose.connect(db)

//Creating Schema and Model
var nameSchema = new mongoose.Schema({
        firstName: String,
        lastName: String
})

var Names = mongoose.model("Names", nameSchema)

app.post("/addname", (req,res) => {
    var myData = new Names(req.body)
    myData.save().then(item => {
        res.redirect('/getnames')
    }).catch( err => {
        res.status(400).send("Unable to save to database")
    })
})

app.get("/getnames", (req,res) => {
    Names.find(function(err,response){
        res.json(response)
    })
})

//Routing for "/things.js"
var things = require('./things.js')
app.use('/things', things)




app.use("/new", (req,res) => {
    res.sendFile(__dirname+"/index.html")
})

app.use("/names" ,(req,res) => {
    res.sendFile(__dirname + "/names.html")
})


//Cookies
app.use('/create-cookie',(req,res) => {
    res.cookie('name','cookie-man').send("Cookie created")
})

app.use('/clear-cookies',(req,res) => {
    res.clearCookie('name')
    res.send("Cookies Cleared")
})


//Session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))
  
//Passport initialize

app.use(passport.initialize());
app.use(passport.session())


app.use('/new-app', require('./routes/index.js'))


app.listen(3000);