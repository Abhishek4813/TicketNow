"use strict";
const mongoose=require("mongoose");
function connect(){
    mongoose.connect('mongodb+srv://ticketNow:Abhi1234@moviecluster-rmszw.azure.mongodb.net/test?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology: true,
    });
    const connection=mongoose.connection;
    connection.on("error",function(err){
        console.log("server is down");
        throw err;
    });
    connection.on("open",function(){
        console.log("Database is connected");
    });
}
module.exports={
    connect:connect,
}
