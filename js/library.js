var Library = function(){
  this._bookShelf = new Array();
};


Library.prototype.addBook = function (book) {
  /*Purpose: Add a book object to your books array.
  Return: boolean true if it is not already added, false if it is already added.*/
  if (typeof book === 'object'){
    for(i=0; i<this._bookShelf.length; i++){
      if(book === this._bookShelf[i]){
        return false;
        console.log(false);
      }
    }
    this._bookShelf.push(book);
    return true;
    console.log(true);
  } else {
    console.log("Error: input must be in the Book object format")
  }
};

Library.prototype.removeBookbyTitle = function (title) {
  /*Purpose: Remove book from from the books array by its title.
  Return: boolean true if the book(s) were removed, false if no books match*/

};

Library.prototype.removeBookByAuthor = function (authorName) {
  /*Purpose: Remove a specific book from your books array by the author name.
  Return: boolean true if the book(s) were removed, false if no books match
*/

};

Library.prototype.getRandomBook = function () {
  /*Purpose: Return a random book object from your books array
  Return: book object if you find a book, null if there are no books
*/

};

Library.prototype.getBookByTitle = function (title) {
  /*Purpose: Return all books that completely or partially matches the string title passed into the function
  Return: array of book objects if you find books with matching titles, empty array if no books are found*/

};

Library.prototype.getBooksByAuthor = function (authorName) {
  /*
  Purpose: Finds all books where the author’s name partially or completely matches the authorName argument passed to the function.
  Return: array of books if you find books with match authors, empty array if no books match*/

};

Library.prototype.addBooks = function (books) {
  /*Purpose: Takes multiple books, in the form of an array of book objects, and adds the objects to your books array.
  Return: number number of books successfully added, 0 if no books were added*/

};

Library.prototype.getAuthors = function () {
  /*Purpose: Find the distinct authors’ names from all books in your library
  Return: array of strings the names of all distinct authors, empty array if no books exist or if no authors exist*/

};

Library.prototype.getRandomAuthorName = function () {
  /*Purpose: Retrieves a random author name from your books collection
  Return: string author name, null if no books exist*/

};

var Book = function (title, author, numberOfPages, publishDate){
  this.title = String(title);
  this.author = String(author);
  this.numberOfPages = Number(numberOfPages);
  this.publishDate = new Date(publishDate);
};

//List of Books to experiment:
var book1 = new Book("The Name of the Wind", "Patrick Rothfuss", 662, "March 2007");
var book2 = new Book("Harry Potter and the Sorceror's Stone", "JK Rowling", 102, "June 1997");
var book3 = new Book("Harry Potter and the Chamber of Secrets", "JK Rowling", 226, "July 1998");
var book4 = new Book("Harry Potter and the Golblet of Fire", "JK Rowling", 662, "July 2000");
var book5 = new Book("New Moon", "Midori Snyder", 176, "June 2005");
// var fiveBooks = {
//   book6 = new Book("206 Bones", "Kathy Reichs", 124, "May 2009");
//   book7 = new Book("Eragon", "Christopher Paolini", 662, "August 2003");
//   book8 = new Book("The Martian", "Andy Wier", 207, "February 2011");
//   book9 = new Book("Harry Potter and the Order of the Phoenix", "JK Rowling", 700, "June 2003");
//   book10 = new Book("The Wise Man's Fear", "Patrick Rothfuss", 540, "March 2011");
// }





document.addEventListener("DOMContentLoaded", function() {
  window.gLibrary = new Library();

});
