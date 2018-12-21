const express = require('express');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
//var randtoken = require('rand-token');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    //res.setHeader('')
    next();
});

//const tokenList = {}
const jwtauth = exjwt({secret: 'secretkey'});

//DB JSON EXAMPLE
const data = require('./db.json');

//LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;
        if (username == data.username && password == data.password) {
            const token = jwt.sign({ id: data.id, username: data.username }, 'secretkey', { expiresIn: 10 });
            const refreshToken = jwt.sign({ id: data.id, username: data.username }, 'secretkey', { expiresIn: 86400 });
            res.json({
                sucess: true,
                err: null,
                token,
                refreshToken
            });
        }
        else {
            res.status(401).json({
                sucess: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
});

//REFRESH TOKEN
//app.post('/token', (req,res) => {
//     // refresh the damn token
//     const postData = req.body
//     // if refresh token exists
//     if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
//         const user = {
//             "id": postData.id,
//             "username": postData.username
//         }
//         const token = jwt.sign(user, 'secretkey', { expiresIn: 900 })
//         const response = {
//             "token": token,
//         }
//         // update the token in the list
//         tokenList[postData.refreshToken].token = token
//         res.status(200).json(response);        
//     } else {
//         res.status(404).send('Invalid request')
//     }
//});

//HOME ROUTE
app.get('/', jwtauth, (req, res) => {
    res.send('You are authenticated');
});

//Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

app.listen(3001, () => console.log('Lets rock on port 3001'));