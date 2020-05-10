const express = require('express');
const router = express.Router();
const moviemodel=require('../models/movie');
const showmodel=require('../models/show');
const bookingmodel=require("../models/bookings");
const multer=require("multer");
const fs=require('fs');
const fsextra=require('fs-extra');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
const upload=multer({storage:storage});

router.get('/',function(req,res,next){
    if(!(req.isAuthenticated()) || req.user.admin!==true){
        res.render('error',{
            mesg:'Unauthorised Access !...'
        })
        return;
    }
    moviemodel.find({email:req.user.email},function(err,data){
    res.render('admin',{
        login:req.user.name.split(" ")[0],
        profile:req.user, 
        movie:data,
    })
});
})
router.post('/add',upload.single('poster'),function(req,res,next){
    fs.readFile(req.file.path,function(err,data){
        const movie=new moviemodel({
            email:req.user.email,
            name:req.body.name,
            poster:data,
            posterType:req.file.mimetype,
            rating:req.body.rating,
            trailer:req.body.trailer,
            position:req.body.position,
            release:req.body.release,
            duration:req.body.duration,
            director:req.body.director, 
            description:req.body.description,
            geners:req.body.geners,
            stars:req.body.stars,
        });
        movie.save(function(err,succ){
            fsextra.remove(req.file.path);
            moviemodel.find({email:req.user.email},function(err,data){
                res.render('admin',{
                    login:req.user.name.split(" ")[0],
                    profile:req.user, 
                    movie:data,
                    msg:'Successfully added your movie....'
                })
            });
        });
    });
})
router.post('/remove',function(req,res,next){
    movie=req.body.movie;
    moviemodel.deleteOne({_id:movie},function(err,succ){
        if(err)
            throw err;
    });
    showmodel.deleteMany({movieID:movie},function(err,succ){
        if(err)
            throw err;
    });
    bookingmodel.deleteMany({movieid:movie},function(err,succ){
        if(err)
            throw err;
    });
    res.status(200).json({status:"Successfully Removed.."})
})
router.get('/addshow/:id',function(req,res,next){
const id=req.params.id;
moviemodel.findOne({_id:id},function(err,data){
    res.render("addshow",{
        login:req.user.name.split(" ")[0],
        show:data,
    })
})
});
router.post('/addshow',function(req,res,next){
const {theater,city,showtype,show,movieid}=req.body;
const addshow=new showmodel({
  movieID:movieid,
  theater:theater,
  city:city.toLowerCase(),
  showtype:showtype,
  showtime:show,  
});
addshow.save(function(err,succ){;
    moviemodel.find({email:req.user.email},function(err,data){
        res.render('admin',{
            login:req.user.name.split(" ")[0],
            profile:req.user, 
            movie:data,
            msg:'Successfully Added..' 
        })
    });
    });
});
router.post('/update',function(req,res,next){
    var {name,rating,position,trailer,id}=req.body;
    moviemodel.updateOne({_id:id},{
        name:name,
        rating:rating,
        position:position,
        trailer:trailer,
    },function(err,succ){
        if(succ)
            res.status(200).json({status:"success"});
        else
            res.status(200).json({status:"failure"})
    })
})
module.exports = router;