const express = require('express');
const bookingmodel=require("../models/bookings");
const nodemailer = require('nodemailer');
const router = express.Router();

router.post("/bookingconfermation",function(req,res,next){
const seats=req.body.seats.split(",");
const {movieid,showid,bookingdate,bookingtime}=req.body;
    var book=new bookingmodel({
     email:req.user.email,
     movieid: movieid,
     showid: showid,
     bookingdate:bookingdate,
     bookingtime:bookingtime,
     seats:seats,

    })
    book.save(function(err,succ){
        res.send("Success");
    });
});

router.post("/bookedseats",function(req,res,next){
const {movieid,showid,bookingdate,bookingtime}=req.body;
bookingmodel.find({
movieid:movieid,
showid:showid,
bookingdate:bookingdate,
bookingtime:bookingtime,
},function(err,data){
 if(data){
    var seat=[];
    for(var i=0;i<data.length;i++){
        if(Array.isArray(data[i].seats)){
            for(itm of data[i].seats){
                seat.push(itm);
            }
        }
        else{
        seat.push(data[i].seats);}
    }
    res.status(200).json({seats:seat});
 }   
 else{
     res.send("NO BOOKING");
 }
})
});

router.post("/sendmail",function(req,res,next){
    var txt=req.body.txt;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ticketNow4u@gmail.com',
        pass: 'ticketnow1234'
      }
    });
    
    var mailOptions = {
      from: 'ticketNow4u@gmail.com',
      to: req.user.email,
      subject: 'TicketNow Booking',
      text: txt,
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.end()
      } else {
        console.log('Email sent: ' + info.response);
        res.end();
      }
    });
});
module.exports = router;