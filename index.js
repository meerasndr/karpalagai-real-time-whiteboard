const express = require('express');
const app = express();
const http = require('http').createServer(app);
var mongoose = require('mongoose');
var { User } = require('./user');
var bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
const io = require('socket.io')(http);
//const path = require('path');

app.post('/createuser', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    var userData = req.body;
    var user = new User(userData);
    user.save().then(function(data){
        res.json({
            message: 'Success'
        })

    }).catch(function(err){
        res.status(500).json({
            message: "Error"
        })
    })
});



app.get('/texteditor', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/getuser', function(req, res){
    User.find().then(function(userData){
        res.json(userData)
    }).catch(function(err){
        res.status(500).json({
            message: "Error"
        })
    })
})


io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('docData',function(docData){
        console.log(docData.docValue);
        socket.broadcast.emit('recDocData', {   
            docValue: docData.docValue
        });
    })
});

http.listen(3000, function(){
    console.log("listening on port 3000");
})