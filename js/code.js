// the dynamic code 
console.log("code.js ")
//rt let cod
function  loadmydata(){
  //url 
var link = document.getElementById("url").value;
// catagory
var category = document.getElementById("category").value;
// site name
var site = document.getElementById("site").value;
/// offer name 
var ofname = document.getElementById("ofname").value;


alert(link+category+site+ofname);
}



var dataapp = `
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
  <link rel="stylesheet" href="/css/project.css">

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Offer</title>
</head>

<body>

<section class="navbig animate__animated  animate__flipInX">
    <span class="title"></span>
    <div onclick="window.location.href='#'" class="menu-btn">
      <i class="bi bi-list"></i>
    </div>
  </section>
  <section class="bgnote animate__bounceIn animate__animated ">
    <div class="rotex"> <br>
      <span>
        <blockquote>
          This is a Demo ! This page is not link set.
        </blockquote>
      </span>
    </div>
  </section>
  <br><br>
  <center>
    <div class="card animate__animated animate__lightSpeedInLeft">
      <div class="ijtml animate__animated animate__bounceInDown ">
        <img src="/img/card/Cash.png" /><br>
        <blockquote>
          <h1>$750 Cash App
            Gift Card</h1>
        </blockquote>
        <a class="btn" href="#">Learn More</a>
      </div>
    </div>
  </center>
  <br><br>
  <section class="footer">
    <blockquote>
      <span class="rotez">My Offer</span>
      <p>The <span> My Offer </span> official offer share website </p>
      <br>
      <p onclick="callpryvice()" class="xi">Privacy policy </p>

      <br><br>
    </blockquote>
    <center>
      <p>Copyright &copy; 2024 - <span>My Offer</span></spaN></p>
    </center>
  </section>
  <script src="/js/linkcall.js">
  </script>
  
</body>
</html>
`

