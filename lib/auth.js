const passport=require("passport");
const localstrategy=require("passport-local").Strategy;
const util=require('util');
const bcrypt=require("bcryptjs");
const usermodel=require("../models/user");
const compasyc=util.promisify(bcrypt.compare);
passport.use(new localstrategy({
usernameField: 'email',
},function(email,password,done){
    let userobj;
    usermodel.findOne({email:email})
    .then(user=>{
        userobj=user;
        return compasyc(password,user.password);
    })
    .then(isEqual=>{
        if(isEqual){
            return done(null,userobj);
        }
        return done(null,isEqual);
    })
}));
passport.serializeUser(function(user,done){
    return done(null,user.email);
});
passport.deserializeUser(function(email,done){
    return usermodel.findOne({email:email})
    .then(user=>done(null,user))
    .catch(err=>done(err));
})
