const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

//npm start
//npm install
// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above
let users= [];   //In-memory array
let uniqueID= 1; //simple autogenerate ID

//store data in memory using an array
//Invoke-RestMethod -Method POST -Uri "<url>" -ContentType 'application/json' -Body '{"content": "Whatever you want to put in here"}' -UseBasicParsing
app.post( '/users', (req, res) => {
    //resquest body should contain user's name and email
    const { name, email } = req.body;
    if (!name || !email){
        res.status(404).json({ error: 'Need name and email' });
    }

    //create new user    
    const newUser= {
        id : uniqueID++,
        "name" : name,
        "email" : email
    };          

    users.push(newUser);

    //response is the created user with a unique id
    res.status(201).json(newUser);
});

//curl http://localhost:3000/users/1
app.get('/users/:id', (req, res) => {
    //the user's id will be passed as the URL parameter
    const id= parseInt(req.params.id);

    //Response is the user's details
    //Find the ID
    const user= users.find((item => item.id === id)); 

    if (!user){
        res.status(404).json({ error: 'User not found' });
    }
    else{
        res.status(201).json(user);
    }
});

//Invoke-RestMethod -Method PUT -Uri "http://localhost:3000/users/1" -ContentType 'application/json' -Body '{"name": "I", "email": "I@mymail.com"}' -UseBasicParsing
app.put('/users/:id', (req, res) => {
    // new name and email for the user
    const {name, email} = req.body;
    const id= parseInt(req.params.id);

    // Response is the updated user's details
    const user= users.findIndex((item => item.id === id));

    if (!user){
        res.status(404).json({error: "User not found"});
    }
    else{
        users[user]= {id: id, ...{name, email}};

        res.status(201).json(users[user]);
    }
});

//curl -Method DELETE http://localhost:3000/users/1
app.delete('/users/:id', (req, res) => {
    //delete user by id
    const id= parseInt(req.params.id);

    // Response: 204 no content
    const user= users.findIndex((item => item.id === id));
    if(!user){
        res.status(404).json({error: "User not found"});
    }
    else{
        users.splice(user, 1);
        res.status(201).send();
    }
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
