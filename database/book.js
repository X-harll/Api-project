const mongoose = require("mongoose");

 //Create book schema
 const BookSchema = mongoose.Schema(
   {
     ISBN: String,
     Title: String,
     pubDate: String,
     Language: String,
     numPage: Number,
     author: [Number],
     publication: [Number],
     category: [String]
   }
 );

 const BookModel = mongoose.model("books",BookSchema);

 module.exports = BookModel;
