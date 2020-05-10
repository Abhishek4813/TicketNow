"use strict";
const mongoose=require("mongoose");
const bookingschema=new mongoose.Schema({
email: String,
movieid:String,
showid:String,
bookingdate:String,
bookingtime:String,
seats: [{type:String}],
})
const bookingmodel=mongoose.model('booking',bookingschema);
module.exports=bookingmodel;