function profile_link(x,y){
    var v=document.getElementsByClassName("active_profile_link");
    for(i=0;i<v.length;i++){
        v[i].className=v[i].className.replace("active_profile_link"," ");}
    x.className+="active_profile_link";
    var w=document.getElementsByClassName("visible_profile_link");
    for(i=0;i<w.length;i++){
        w[i].className=w[i].className.replace("visible_profile_link"," ");}
    document.getElementById(y).className+="visible_profile_link";
}
function change_password(){
    $.post("/change_password",{
        oldpassword:document.changepswd.oldpassword.value,
        newpassword:document.changepswd.newpassword.value,
    },function(data,status){
        if(data.status==="matched")
            window.alert("password has been changed :)");
        else
            window.alert("Incorrect previous password :(");
    })
    return false;
}
function remove_movie(x){
    $.post('/admin/remove',{
        movie:x,
    },function(data,status){
        window.alert(data.status);
        location.reload();
    })
}
function updateadded(x,ev){
    $.post('/admin/update',{
        id:x,
        name:ev.target.name.value,
        rating:ev.target.rating.value,
        position:ev.target.position.value,
        trailer:ev.target.trailer.value,
    },function(data,status){
        if(data.status==="success")
            window.alert("successfully Updated..");
        else
            window.alert("please try again..");
    })
    return false;
}
function addstars(){
    console.log("helo");
    document.getElementById('star').innerHTML+='\n<input type="text" name="stars" style="margin-bottom:2px">';
    return false;
}
function showtime(){
    document.getElementById('show').innerHTML+='\n<input type="text" name="show" style="margin-bottom:2px">';
    return false;
}
function showtp(x){
    v=document.stp.showType.value;
    document.stp.action='/book/'+x+'/'+v;
    document.stp.submit();
}