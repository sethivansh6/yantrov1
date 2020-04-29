let btn=document.getElementById("use");
let bar=document.getElementById("bar");
let main=document.getElementById("mainbody");
let cl=document.getElementById("close");
let box=document.getElementById("box");
let message=document.getElementById("message");
let close=document.getElementById("closes");

box.addEventListener("click",function(){
    message.style.display="block";
});

close.addEventListener("click",function(){
    message.style.display="none";
});

btn.addEventListener("click",function(){
    bar.style.display="block";
//alert("hey");
//main.style.marginLeft="200px";

//sidebar.style.backgroundColor="red"


})
cl.addEventListener("click",function(){
    bar.style.display="none";
//alert("hey");
//main.style.marginLeft="200px";

//sidebar.style.backgroundColor="red"


})