const bcrypt=require('bcryptjs');
let pass='secret123';

bcrypt.genSalt(10).then(function(salt){
    bcrypt.hash(pass,salt).then(function(encrypted){
        console.log(encrypted);
    })
})