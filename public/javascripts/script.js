setTimeout(function(){
var a=document.getElementById("pswdmsg");
if(a){
    var v=document.getElementById("pswdmsg").innerHTML;
//do not use id with name pswdmsg above login <span> 
if(v!=''){
    document.getElementById("popup").style.display="block";
}
}
},1000)
function show_nav(){
    box=document.getElementById("drop_nav");
    if(box.classList.contains('display')){
        setTimeout(function(){
        box.classList.remove('display');  
        },750);
        box.classList.remove('height_animi');
    }
    else{
        setTimeout(function(){
            box.classList.add('height_animi');
        },1);
        box.classList.add("display");
    }
}
function hide_nav(){
    document.getElementById("drop_nav").classList.remove('display');
}
function display(){
    document.getElementById("login").style.display="none";
    document.getElementById("signup").style.display="block";
}
function display_login(){
    document.getElementById("login").style.display="block";
    document.getElementById("signup").style.display="none";
}
function login(){
    var v=document.getElementsByClassName('loginlink')[0].innerHTML;
    if(v==='LOG IN')
    document.getElementById("popup").style.display="block";
    else{
        var c=document.getElementsByClassName("loginlink");
        for(i=0;i<c.length;i++){
            c[i].href="/profile";
        }
    }
}
function popupclose(){
    document.getElementById("popup").style.display="none";
    document.getElementById("signup").style.display="none";
    document.getElementById("login").style.display="block";
}
function signupvalid(){
    if(document.form.name.value==""){
        document.form.name.style.cssText="outline:1px solid red";
        document.form.name.focus();
        return false;
    }
    if(document.form.email.value==""){
        document.form.email.style.cssText="outline:1px solid red";
        document.form.email.focus();
        return false;
    }
    if(document.form.contact.value==""){
        document.form.contact.style.cssText="outline:1px solid red";
        document.form.contact.focus();
        return false;
    }
    if(document.form.password.value==""){
        document.form.password.style.cssText="outline:1px solid red";
        document.form.password.focus();
        return false;
    }
    if(document.form.confirmpassword.value==""){
        document.form.confirmpassword.style.cssText="outline:1px solid red";
        document.form.confirmpassword.focus();
        return false;
    }
    var password=document.form.password.value;
    var cnfpassword=document.form.confirmpassword.value;
    if(password!=cnfpassword){
        document.getElementById("spswdmsg").innerHTML="* password is not same"
        document.getElementById("spswdmsg").style.visibility="visible";
        return false;
    }
    $.post("/signup",{
        name:document.form.name.value,
        email:document.form.email.value,
        contact:document.form.contact.value,
        password:document.form.password.value,
    },function(data,status){
     if(data.status==="already exist"){
         document.getElementById("spswdmsg").innerHTML="* email already exist try <p class='login_refer' onclick='display_login()'>Login</p>";
         document.getElementById("spswdmsg").style.visibility="visible";
     }  
     else{
         display_login();
     } 
    }
    )
    return false;
}
function password_visible(x,y){
    var v=document.getElementById(x);
    v.style.cssText='Padding-right:35px;';
    if(v.type==='password')
        v.type="text";
    else
    v.type="password";
}
function outline(x){
    x.style.cssText="outline:0px;";
    document.getElementById("spswdmsg").style.visibility="hidden";
}
function outlinel(x){
    x.style.cssText="outline:0px;";
    document.getElementById("pswdmsg").style.visibility="hidden";
}
function closecnfpopup(){
    document.getElementById("cnfpopup").style.display="none";
    location.reload();
}
