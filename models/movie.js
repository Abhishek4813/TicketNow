"use strict";
const mongoose=require("mongoose");
const movieschema=new mongoose.Schema({
    email:String,
    name:String,
    poster:Buffer,
    posterType:String,
    rating:String, 
    position:String,
    trailer:String,
    release:String,
    duration:String,
    director:String,
    description:String,
    geners:[{type:String}],
    stars:[{type:String}],

})
const moviemodel=mongoose.model('movies',movieschema);
module.exports=moviemodel;