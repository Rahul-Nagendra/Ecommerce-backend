const {users}=require('./data/users');

users.forEach(function(user){
    console.log(user.name);
});

// users.forEach(user=> console.log(user))