const express = require('express');
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
  res.render("index", {});
});

app.post("/", function(req, res){
  const query = req.body.cityName;
  const apiKey = "162830b1b853a049d2b8868d23cd84aa";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units="+ unit +"&appid=" + apiKey;

  // https.get(url, function(response){
  //   console.log(response.statusCode);

  //   response.on("data", function(data){
  //     const weatherData = JSON.parse(data);
  //     const temp = weatherData.main.temp;
  //     const weatherDescription = weatherData.weather[0].main;
  //     const icon = weatherData.weather[0].icon;
  //     const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
  //     res.write("<h1>Weather Report</h1>");
  //     res.write("<img src=" + imageURL + ">");
  //     res.write("<p>The weather is currently " + weatherDescription + "</p>");
  //     res.write("<h2>The temperature at "+ query +" is: "+ temp + "degree celcius</h2>");

  //     res.send();
  //   });
  // }); OR
  const options = {
    method: "GET"
  }
  const request =  https.request(url, options, function(response){
    console.log(response.statusMessage);

    if(response.statusMessage == "OK"){
      response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].main;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
        res.render("report", {imageURL: imageURL, weatherDescription: weatherDescription, query: query, temp: temp});
      });

    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
  });
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is ready at 3000.");
});
