/*Constructor for Book class - no methods*/


//make book take an object as argument
var Book = function (bookObj){
  this.cover = bookObj.cover || "./assets/book_cover.png";
  this.title = String(bookObj.title);
  this.author = String(bookObj.author);
  this.numberOfPages = parseInt(bookObj.numberOfPages);
  this.publishDate = new Date(bookObj.publishDate).getUTCFullYear();
  this.rating = parseInt(bookObj.rating);
  this.__v = bookObj.__v;
  this._id = bookObj._id;
  //have to use getUTCFullYear cuz otherwise the year is decremented every time it's pulled from localStorage
  //Why?
};

//List of Books to experiment:
var book1 = {
  title: "The Name of the Wind",
  author: "Patrick Rothfuss",
  numberOfPages: 662,
  publishDate: "2007"
};
var book2 = {
  title: "Harry Potter and the Sorcerer's Stone",
  author: "JK Rowling",
  numberOfPages: 102,
  publishDate: "1997"
};
var book3 = {
  title: "Harry Potter and the Chamber of Secrets",
  author: "JK Rowling",
  numberOfPages: 226,
  publishDate: "1998"
};
var book4 = {
  title: "Harry Potter and the Golblet of Fire",
  author: "JK Rowling",
  numberOfPages: 662,
  publishDate: "2000"
};
var book5 = {
  title: "New Moon",
  author: "Midori Snyder",
  numberOfPages: 176,
  publishDate: "2005"
};
var book6 = {
  title: "206 Bones",
  author: "Kathy Reichs",
  numberOfPages: 124,
  publishDate: "2009"
};
var book7 = {
  title: "Eragon",
  author: "Christopher Paolini",
  numberOfPages: 662,
  publishDate: "2003"
};
var book8 = {
  title: "The Martian",
  author: "Andy Wier",
  numberOfPages: 207,
  publishDate: "2011"
};
var book9 = {
  title: "Harry Potter and the Order of the Phoenix",
  author: "JK Rowling",
  numberOfPages: 700,
  publishDate: "2003"
};
var book10 = {
  title: "The Wise Man's Fear",
  author: "Patrick Rothfuss",
  numberOfPages: 540,
  publishDate: "2011"
};
var book11 = {
  title: "Cloud Atlas",
  author: "David Mitchell",
  numberOfPages: 250,
  publishDate: "2012"
};
var book12 = {
  title: "The Cloud Atlas",
  author: "Liam Callanan",
  numberOfPages: 190,
  publishDate: "2004"
};
var book2000 = {
  title: "this is 2000",
  author: "Me",
  numberOfPages: 190,
  publishDate: "2000"
};

var fiveBooks = [book6, book7, book8, book9, book10];
var firstfiveBooks = [book1, book2, book3, book4, book5];
var tricksyBooks = [book11, book12];
var allBooks = [book1, book2, book3, book4, book5, book6, book7, book8, book9, book10, book11, book12];
