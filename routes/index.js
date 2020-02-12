const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {ensureAuthenticated, forwardAuthenticated} = require('../config/auth')

const User = require('../models/User')


router.get('/login', (req,res) => {
    res.sendFile(__dirname + '/views/login.html')
})

router.get('/register', (req,res) => {
    res.sendFile(__dirname + '/views/register.html')
})

router.get('/dashboard', ensureAuthenticated,( req, res) => {
    res.json({
        user: req.user
    })
})

router.post('/register', (req,res) => {
    const { name, email, password, password1 } = req.body
    let errors = []
    
    if(errors.length == 0){
        User.findOne({ email: email }).then(
            user => {
                if(user) {
                    errors.push({msg: 'User already exists'})
                    res.send("User already exists")
                }
                else {
                    const newUser = new User( {
                        name,
                        email,
                        password
                     })

                     bcrypt.genSalt(10, (err,salt) => 
                            bcrypt.hash(newUser.password, salt, (err,hash) => {
                                if(err) throw err;

                                newUser.password = hash
                                newUser.save().then(
                                    user => {
                                       res.redirect('/new-app/login')
                                    }
                                )
                                .catch(err => {
                                    console.log(err)
                                })
                            })
                        )
             
                    //  console.log("New User", newUser)
                    //  res.send("User Created")
                }
            }
        )
    }
})

router.post('/login',(req,res,next) => {
    passport.authenticate('local', function(err ,user, info) {

      console.log("User:",user)
      if(err){
          return next(err)
      }

      if(!user){
          return res.redirect('/register')
      }

      req.logIn(user, function(err){
          
          return res.redirect('/new-app/dashboard')
      })

    })(req,res,next)
})

module.exports = router