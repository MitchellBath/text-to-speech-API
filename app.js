//require  modules
const express = require('express');

// create app
const app = express();

// config app
let port = 3000;
let host = 'localhost';


app.get('/', (req, res)=>{
    res.send('Hello world!')
});

// start server
app.listen(port, host, ()=> {
    console.log('Server is running on port', port)
})