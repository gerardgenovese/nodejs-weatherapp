const path = require("path");
const express = require("express");
const hbs = require("hbs");

const forecast = require("./utils/forecast");
const geocode = require("./utils/geocode");

const app = express();

const port = process.env.PORT || 3000

// console.log(__dirname);
// console.log(__filename);
// console.log(path.join(__dirname, "../public"));

//key value for template engine
app.set("view engine", "hbs");

//define path for express config to public & setup static directory to serve
const publicDirectory = path.join(__dirname, "../public")
app.use(express.static(publicDirectory));

//if changing views folder to another name
const viewsPath = path.join(__dirname, "../templates/views");
app.set("views", viewsPath);

//partials path
const partialsPath = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialsPath)

//hbs route
app.get("", (req, res) => {
  res.render("index", {
      title: "Weather",
      name: "Gerard"
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
      title: "About Me",
      name: "Gerard"
  })
})
app.get("/help", (req, res) => {
  res.render("help", {
      helpText: "This is some helpful text.",
      title: "Help",
      name: "Gerard"
  })
})

app.get("/weather", (req, res) => {
  if(!req.query.address){

    return res.send({
      error: "You must provide an Address"
    })
  }
  // res.send({
  //     forecast: "It is snowing",
  //     location: "Philadelphia",
  //     address: req.query.address
  // })
  geocode(req.query.address, (error, { latitude, longitude, location } = {} ) => {
    if(error){
     
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if(error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
})

app.get("/products", (req, res) => {
  if(!req.query.search){
    return res.send({
      error: "You must provide a search term"
    })
  }
  console.log(req.query.search);
  res.send({
    products: []
  })
})

app.get("/help/*", (req, res) => {
  res.render("404", {
      title: "404",
      name: "Gerard",
      errorMessage: "Help article not found."
  })
})

app.get("*", (req, res) => {
  res.render("404", {
      title: "404",
      name: "Gerard",
      errorMessage: "Page not found."
  })
})






// app.get("/", (req, res) =>{
//   res.send("index.html");
// })

// app.get("/help", (req, res) => {
//   res.send("help page");
// })

// app.get("/about", (req, res) => {
//   res.send("about page");
// })





app.listen(port, () =>{
  console.log("Server is running");
});