"use strict";
const mongoose=require("mongoose");
const userschema=new mongoose.Schema({
    name:String,
    email:String,
    contact:String,
    password:String,
    city:String,
    admin:Boolean,
})
const usermodel=mongoose.model('users',userschema);
module.exports=usermodel;