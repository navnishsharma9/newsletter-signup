const express = require("express");
const request = require("request");
const path = require("path");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");


mailchimp.setConfig({
  apiKey: "2a40284eaf5c61ddfa5c1594fa3a217a-us6",
  server: "us6",
});
const app = express();


app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/signup.html"));
});


app.post("/", (req, res) => {

  const listId = "4f0fa8ca95";
  const subscribingUser = {
    fName: req.body.firstName,
    lName: req.body.firstName,
    email: req.body.email
  };

  const jsonData = JSON.stringify(subscribingUser);


  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.fName,
        LNAME: subscribingUser.lName
      }
    });
   
    
  };
  
  
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/success", (req, res) => {
  res.redirect("/");
});


//code for unsubscribe form 
app.get("/unsubscribe", (req, res)=>{
  res.sendFile(__dirname + "/unsubscribe.html");
})

app.post("/unsubscribe", (req, res)=>{
  const listId = "4f0fa8ca95";
  const email = req.body.email;

  async function run(){
    const response = await mailchimp.lists.updateListMember(
      listId,
      email,
      {
        status: "unsubscribed"
      }
    );
  }
  if(mailchimp.Status === "unsubscribed" ){
    res.sendFile(__dirname + "/successful.html")
  }
  run();
});


app.post("/unsuccessful",(req, res)=>{
  res.redirect("/unsubscribe");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running at port no 3000");
});