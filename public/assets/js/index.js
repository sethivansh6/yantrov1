
let tt;
let questions;
let question_count = 0;
let points = 0;
let mytime;
let time = 0;
let len;



function getdata(){
   
  document.getElementById("div").style.display="none";
  document.getElementById("wrapper").style.display="flex";

fetch('/gettestdata')
            .then(response => response.json())
            .then(test => {
              
                tt=JSON.parse(JSON.stringify(test));
                logDataset();
            });
       }

function logDataset(){

  questions=tt.questions;
  len=questions.length;
  console.log(questions);
  show(question_count);
  timer();
}
function next() {

   
  // if the question is last then redirect to final page
  if (question_count == questions.length - 1) {
    sessionStorage.setItem("time", time);
    clearInterval(mytime);
    document.getElementById("nextbtn").style.display="none";
    document.getElementById("submitbtn").style.display="block";
   // location.href = "/assets/html/end.html";
  }
  console.log(question_count);
  let user_answer=" ";
  if(document.querySelector("li.option.active")!=null)
  user_answer= document.querySelector("li.option.active").innerHTML;
  // check if the answer is right or wrong
  console.log("USER ANSWER"+user_answer);
  if (user_answer == questions[question_count].correct) {
    points += tt.positive;
    console.log("Positive "+tt.positive);
    sessionStorage.setItem("points", points);
  }
  if ((user_answer != questions[question_count].correct) && user_answer != " ") {
    points +=tt.negative;
    console.log("negative "+tt.negative);
    sessionStorage.setItem("points", points);
  }
  console.log("points are "+points);

  question_count++;
  show(question_count);
}

function show(count) {
  let question = document.getElementById("questions");
  let first = questions[count].option1;
  let second = questions[count].option2;
  let third = questions[count].option3;
  let fourth = questions[count].option4;

  question.innerHTML = `
  <h4>Q${count + 1}. ${questions[count].ques}</h4>
  <div><img src=${questions[count].ques_image}></div>
   <ul class="option_group">
  <li class="option">${first}</li>
  <li class="option">${second}</li>
  <li class="option">${third}</li>
  <li class="option">${fourth}</li>
</ul> 
  `;
  toggleActive();
}

function toggleActive() {
  let option = document.querySelectorAll("li.option");
  for (let i = 0; i < option.length; i++) {
    option[i].onclick = function() {
      for (let i = 0; i < option.length; i++) {
        if (option[i].classList.contains("active")) {
          option[i].classList.remove("active");
        }
      }
      option[i].classList.add("active");
    };
  }
}

function timer()
{
  let dt = new Date(new Date().setTime(0));
let ctime = dt.getTime();
let seconds = Math.floor((ctime % (1000 * 60))/ 1000);
let minutes = Math.floor((ctime % (1000 * 60 * 60))/( 1000 * 60));
console.log(seconds, minutes);

 mytime = setInterval(function(){
        time++;
        console.log("time is"+time);
        if(time == tt.time)
        {
          submit();
        }
        
        if(seconds < 59) {
            seconds++;
        } else {
            seconds = 0;
            minutes++;
        }
        let formatted_sec = seconds < 10 ? `0${seconds}`: `${seconds}`;
        let formatted_min = minutes < 10 ? `0${minutes}`: `${minutes}`
        document.querySelector("span.time").innerHTML = `${formatted_min} : ${formatted_sec}`;
    }, 1000);
}

function submit(){
let full=len*tt.positive;

let user_points = sessionStorage.getItem("points");
let user_time = sessionStorage.getItem("time");
let percentage=((user_points/full)*100).toPrecision(4);
document.querySelector("#totalmarks").innerHTML = `Full Marks is ${full}`;
document.querySelector("#score").innerHTML = `Score is ${user_points}`;
document.querySelector("#percentage").innerHTML = `Percentage is ${percentage}%`;
document.querySelector("#time").innerHTML = `Time Taken is ${user_time} sec`;
document.getElementById("wrapper").style.display="none";
document.getElementById("result").style.display="block";
document.querySelector("body").style.backgroundColor="#d3d3d3";
document.querySelector("#input").value=user_points;
document.querySelector("#input2").value=full;
document.querySelector("#input3").value=percentage;
document.getElementById("form").submit();
console.log("submitted");

}

