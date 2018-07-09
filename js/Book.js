/*Constructor for Book class - no methods*/
var Book = function (title, author, numberOfPages, publishDate){
  this.title = String(title);
  this.author = String(author);
  this.numberOfPages = Number(numberOfPages);
  this.publishDate = new Date(publishDate.toString()).getUTCFullYear();
  //have to use getUTCFullYear cuz otherwise the year is decremented every time it's pulled from localStorage
  //Why?
};

//List of Books to experiment:
var book1 = new Book("The Name of the Wind", "Patrick Rothfuss", 662, "March 2007");
var book2 = new Book("Harry Potter and the Sorceror's Stone", "JK Rowling", 102, "June 1997");
var book3 = new Book("Harry Potter and the Chamber of Secrets", "JK Rowling", 226, "July 1998");
var book4 = new Book("Harry Potter and the Golblet of Fire", "JK Rowling", 662, "July 2000");
var book5 = new Book("New Moon", "Midori Snyder", 176, "June 2005");
var book6 = new Book("206 Bones", "Kathy Reichs", 124, "May 2009");
var book7 = new Book("Eragon", "Christopher Paolini", 662, "August 2003");
var book8 = new Book("The Martian", "Andy Wier", 207, "February 2011");
var book9 = new Book("Harry Potter and the Order of the Phoenix", "JK Rowling", 700, "June 2003");
var book10 = new Book("The Wise Man's Fear", "Patrick Rothfuss", 540, "March 2011");
var book11 = new Book("Cloud Atlas", "David Mitchell", 250, "October 2012");
var book12 = new Book("The Cloud Atlas", "Liam Callanan", 190, "October 2004");
var book2000 = new Book("this is 2000", "Me", 190, "October 2000");
var fiveBooks = [book6, book7, book8, book9, book10];
var firstfiveBooks = [book1, book2, book3, book4, book5];
var tricksyBooks = [book11, book12];
var allBooks = [book1, book2, book3, book4, book5, book6, book7, book8, book9, book10, book11, book12];
