const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// /////////////////////////////////Request Targeting all articles/////////////////////////////////////////////
app.route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Saved Successfully");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfuly deleted.");
      } else {
        res.send(err);
      }
    });
  });

  // /////////////////////////////////Request Targeting a specific article/////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No matching article was found");
        }
    })
})
.put(function(req, res){
    Article.updateOne(
        { title: req.params.articleTitle},
        { title: req.body.title, content: req.body.content },
        function(err){
            if(!err){
                res.send("Successfully Updated article");
            }
        }
    )
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Updated Successfuly");
            }else{
                res.send(err);
            }
        }
    );
})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Article deleted successfuly.");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(3000, function () {
  console.log("Server Started on port 3000");
});
