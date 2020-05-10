"use strict";
const mongoose=require("mongoose");
const showschema=new mongoose.Schema({
    movieID:String,
    theater:String,
    city:String,
    showtype:String,
    showtime:[{type:String}],
})
const showmodel=mongoose.model('show',showschema);
module.exports=showmodel;