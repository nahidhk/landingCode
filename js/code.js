// the dynamic code 
console.log("code.js ")
//rt let cod


function mycan(){
  var contol= document.getElementById("category").value;
if (contol === "add") {
window.location.href="https://t.me/nahidhk"
} else {
 
}
}


function  loadmydata(){
  //url 
var link = document.getElementById("url").value;
// catagory
var category = document.getElementById("category").value;
// site name
var site = document.getElementById("site").value;
/// offer name 
var ofname = document.getElementById("ofname").value;
const host = "lndcode.vercel.app";
var dataapp = `
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" href="https://${host}/css/project.css">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${site}</title>
</head>

<body>

<section class="navbig animate__animated  animate__flipInX">
    <span class="title">${site}</span>
    <div onclick="window.location.href='${link}'" class="menu-btn">
      <i class="bi bi-list"></i>
    </div>
  </section>
  <section class="bgnote animate__bounceIn animate__animated ">
    <div class="rotex"> <br>
      <span>
        <blockquote>
         The offer is a All time Best offer shears. this offer is a only USA today offer!
        </blockquote>
      </span>
    </div>
  </section>
  <br><br>
  <center>
    <div class="card animate__animated animate__lightSpeedInLeft">
      <div class="ijtml animate__animated animate__bounceInDown ">
        <img src="https://landingcode.bmhm.sbs/img/card/${category}.png" /><br>
        <blockquote>
          <h1>${ofname}</h1>
        </blockquote>
        <a class="btn" href="${link}">Learn More</a>
      </div>
    </div>
  </center>
  <br><br>
  <section class="footer">
    <blockquote>
      <span class="rotez">${site}</span>
      <p>The <span>${site} </span> official offer share website </p>
      <br>
      <p onclick="callpryvice()" class="xi">Privacy policy </p>

      <br><br>
    </blockquote>
    <center> 
      <p>Copyright &copy; 2024 - <span>${site}</span></span></p>
    </center>
  </section>
  <script src="https://${host}/js/linkcall.js">
  </script>
  
</body>
</html>
`
document.getElementById('mainio').classList="younin animate__animated animate__bounceIn";
document.getElementById('pullio').innerHTML=dataapp;
}

function editapp(){
 document.getElementById('mainio').classList="younin animate__animated animate__bounceOut";
 
}

/// my copy app data 
function  mytextcopy(){
  var copyhtml = document.getElementById("pullio");
  copyhtml.select();
  copyhtml.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyhtml.value);
  setTimeout(clogeapp, 1000);
  setTimeout(apsmyrouter, 700);
apprunio();
}

function  apsmyrouter(){
  document.getElementById("outline").classList="bi bi-copy"
}
////app run 
function  apprunio(){
document.getElementById("outline").classList="bi bi-clipboard-check"
}

// apk cloge
function  clogeapp(){
  document.getElementById('mainio').classList="younin animate__animated animate__bounceOutDown";
}