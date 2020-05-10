const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const passport=require("passport");
const usermodel=require("../models/user");
const moviemodel=require("../models/movie");
const showmodel=require('../models/show');
const bookingmodel=require('../models/bookings');
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
    moviemodel.find({position:"trending"},function(err,trending){
        for(i=0;i<trending.length;i++){
        var poster64= new Buffer(trending[i].poster,'binary').toString('base64');
        trending[i].poster=poster64;
        }
        var l=trending.length;
        if(l%4!==0){
            for(i=0;i<(4-(l%4));i++){
                trending.push(trending[i]);
            }
        }
    moviemodel.find({position:"upcoming"},function(err,upcoming){
        for(i=0;i<upcoming.length;i++){
        var poster_now64= new Buffer(upcoming[i].poster,'binary').toString('base64');
        upcoming[i].poster=poster_now64;
        }
        var l=upcoming.length;
        if(l%6!==0){
            for(i=0;i<(6-(l%6));i++){
                upcoming.push(upcoming[i]);
            }
        }
    moviemodel.find({position:"now_in_theater"},function(err,now){
        for(i=0;i<now.length;i++){
        var poster_now64= new Buffer(now[i].poster,'binary').toString('base64');
        now[i].poster=poster_now64;
        }
        var l=now.length;
        if(l%6!==0){
            for(i=0;i<(6-(l%6));i++){
                now.push(now[i]);
            }
        }
    if(req.isAuthenticated()){
    const name=req.user.name;
    res.render("index",{
        now:now,
        upcoming:upcoming,
        trending:trending,
        login:name.split(" ")[0],
    });
    return;
    }
    else{
        if(req.flash("error")[0]==="invalid"){
        res.render("index",{
            now:now,
            upcoming:upcoming,
            trending:trending,
            login:"LOG IN",
            msg:"* Invalid Credential Please Try Again",
        })}
        else{
            res.render("index",{
                now:now,
                upcoming:upcoming,
                trending:trending,
                login:"LOG IN",
            })

        }
    }
});
});
});
});
router.get('/search',function(req,res,next){
moviemodel.find({},function(err,data){
    moviename=[];
    movieid=[];
    for(var i=0;i<data.length;i++){
        moviename.push(data[i].name);
        movieid.push(data[i]._id);
    }
    res.status(200).json({mname:moviename,mid:movieid});
})
});
router.post('/signup',function(req,res){
    const {name,email,contact,password}=req.body;
    usermodel.findOne({email:email},function(err,data){
        if(data)
        res.status(200).json({status:"already exist"});
        else{
    bcrypt.hash(password,8,function(err,hashedpassword){
        const user=new usermodel({
            name:name,
            email:email,
            contact:contact,
            password:hashedpassword,
            admin:false,
        })
      user.save(function(err){
          res.status(200).json({status:"successfull"})
      })  
    })}
})
});
router.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/',
    failureFlash:"invalid",
}));
router.get('/profile',function(req,res,next){
    if(!req.isAuthenticated()){
        res.render("error",{
            mesg:"404 page not found",
        });
        return;
    };
    bookingmodel.find({email:req.user.email},function(err,data){
                res.render('profile',{
                    login:req.user.name.split(" ")[0],
                    profile:req.user,
                    booking:data,
    });
});
});
router.get('/profile/movie/:id',function(req,res,next){
    const id=req.params.id;
    moviemodel.findOne({_id:id},function(err,data){
        var poster64=new Buffer(data.poster,'binary').toString('base64');
        res.status(200).json({name:data.name,poster:poster64,posterType:data.posterType});
    });
}); 
router.get('/profile/show/:id',function(req,res,next){
    const id=req.params.id;
    showmodel.findOne({_id:id},function(status,data){
        res.status(200).json(data);
    })
});
router.get("/logout",function(req,res,next){
    req.session.destroy();
    res.redirect("/");
})
router.post('/update',function(req,res,next){
    const {name,contact,city}=req.body;
    usermodel.updateOne({email:req.user.email},{
    name:name,
    city:city.toLowerCase(),
    contact:contact,
    },function(err,succ){
        if(err)
            throw err;
        console.log("successfully updated");
    })
    res.redirect('/profile');

})
router.post('/change_password',function(req,res,next){
    const {oldpassword,newpassword}=req.body;
    bcrypt.hash(newpassword,8,function(err,password){
    bcrypt.compare(oldpassword,req.user.password,function(err,Equal){
      if(Equal){
          usermodel.updateOne({email:req.user.email},{
              password:password,
          },function(err,succ){
              if(succ){
                  res.status(200).json({status:"matched"})
              }
          })
      } 
      else{
          res.status(200).json({status:"unmatched"});
      } 
    })})
})
router.get("/movie/:id",function(req,res,next){
    const id=req.params.id;
    moviemodel.findOne({_id:id},function(err,data){
        if(data){
            var poster64= new Buffer(data.poster,'binary').toString('base64');
            data.poster=poster64;
            if(req.isAuthenticated()){
            res.render('movie',{
                login:req.user.name.split(" ")[0],
                movie:data,
            });
        }
        else{
            res.render('movie',{
                login:"LOG IN",
                movie:data,
            });
        }
    }
    })
})
router.get("/book/:id",function(req,res,next){
    var id=req.params.id;
    console.log(!req.isAuthenticated());
    moviemodel.findOne({_id:id},function(err,data){
            var poster64=new Buffer(data.poster,'binary').toString("base64");
            data.poster=poster64; 
            if(!req.isAuthenticated()){  
               res.render('movie',{
                    login:"LOG IN",
                    movie:data,
                    msg:"* please login first...",
                });
                return;
            }
            var city=req.user.city; 
            showmodel.find({movieID:id,showtype:'2D',city:city},function(err,value){
                if(value.length===0){
                res.render("book",{
                movie:data,
                login:req.user.name.split(" ")[0],
                err:"notFound",
                
            });
        }
        else{
            res.render("book",{
                movie:data,
                login:req.user.name.split(" ")[0],
                show:value,
            }) 
        }
        }); 
        })
    })
router.post("/book/:id/:tp",function(req,res,next){
    const id=req.params.id;
    const tp=req.params.tp;
    const city=req.user.city;
    moviemodel.findOne({_id:id},function(err,data){
    var poster64=new Buffer(data.poster,'binary').toString("base64");
    data.poster=poster64;
    showmodel.find({movieID:id,showtype:tp,city:city},function(err,value){
        if(value.length===0){
            res.render("book",{
            movie:data,
            login:req.user.name.split(" ")[0],
            err:"notFound",
           
        });
    }
    else{
        res.render("book",{
            movie:data,
            login:req.user.name.split(" ")[0],
            show:value,
        }) 
    }
            });
            })
});

router.get("/selectseat/:showid/:showtime/:showdate",function(req,res,next){
var showid=req.params.showid;
var showtime=req.params.showtime;
var showdate=req.params.showdate;
showmodel.findOne({_id:showid},function(err,data){
    moviemodel.findOne({_id:data.movieID},function(err,value){
    var poster64=new Buffer(value.poster,'binary').toString("base64");
    value.poster=poster64;
        res.render("seat",{
            movie:value,
            login:req.user.name.split(" ")[0],
            show:data,
            showdate:showdate,
            showtime:showtime,
        })
    })
})
});
router.get('/cancle/:id',function(req,res,next){
    var id=req.params.id;
    bookingmodel.deleteOne({_id:id},function(err,succ){
        if(succ){
            bookingmodel.find({email:req.user.email},function(err,data){
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
                    subject: 'Ticket has been cancelled',
                    text: "your Booking for id "+id+" has been cancelled successfully \n Thank for your concern",
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
                res.render('profile',{
                    login:req.user.name.split(" ")[0],
                    profile:req.user,
                    booking:data,
                    message:"success",
    });
});
        }
    });
});
module.exports = router;