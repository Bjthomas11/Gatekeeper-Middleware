const express = require('express');
const queryString = require('query-string');

const app = express();


const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   password: 'password'
  }
];

function gateKeeper(req, res, next) {
//   create variables that will be an object with null if the request in postman doesnt match the USERS array
//   if the requested information does match then it will find the values.
//   we will have an object no matter what the outcome is
  const parsedHeader = queryString.parse(req.get('x-username-and-password'));
  const user = parsedHeader.user || null;
  const pass = parsedHeader.pass || null;
  
//   If the request headers information was correct we use USERS array and find method to look in the array
//   for the correct username and password that was requested and request.user equal to that certain index
//   with the correct usernam eand password
  req.user = USERS.find(
    (usr, index) => usr.userName === user && usr.password === pass);
  
//   do i need to call next because theres not another middleware function
  // next();?
}

// use gatekeeper function route for whole app
app.use(gateKeeper);


app.get("/api/users/me", (req, res) => {
//   display error with status and in json format (object) if request header info is wrong
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
//   if information is correct then create variables for the keys i want 
//   then give response back with those key/value pairs in json format (object)
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
