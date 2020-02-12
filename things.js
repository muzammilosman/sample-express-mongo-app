var express = require('express')
var router = express.Router()

router.use('/', function(req,res,next){
    console.log('New request recieved at '+Date.now())
    next()

})

router.get('/', function(req,res){
    res.send('Middle executed already ')

})

router.get('/:id([0-9]{2})', function(req,res){
    res.send('Parameter: '+req.params.id)
})

router.get('/mot', function(req,res){
    res.send('another route')
})

router.post('/',function(req,res){
    res.send('POST route')
})

module.exports = router