/*Class to represent a Library with functions to add, remove, and look up books in various ways*/

//Sington example from Kyle:
var Library;

(function() {
  var instance;

  Library = function(key) {
    //If instance exists return instance
    if (instance) {
      return instance;
    }
    //this will run the first time and only the first time
    instance = this;
    this._bookShelf = [];
    this._libraryKey = key;
  }
})();


// //This is the previous constructor from before we made this a singlton
// /*Constructor for Library class - use prototype (below) to make methods*/
// var Library = function(key){
//   this._bookShelf = new Array();
//   this._libraryKey = key;
// };

/*Constructor for Book class - no methods*/
var Book = function (title, author, numberOfPages, publishDate){
  this.title = String(title);
  this.author = String(author);
  this.numberOfPages = Number(numberOfPages);
  this.publishDate = new Date(publishDate.toString()).getUTCFullYear();
  //have to use getUTCFullYear cuz otherwise the year is decremented every time it's pulled from localStorage
  //Why?
};

Library.prototype.addBook = function (book) {
  /*Purpose: Add a book object to your books array.
  Return: boolean true if it is not already added, false if it is already added.*/

  //error handling - check if input is a {Book}
  if (book instanceof Book){
    for(i=0; i<this._bookShelf.length; i++){
      //check if book is present, if present return false, otherwise push {Book} and return true
      if(book === this._bookShelf[i]){
        return false;
      }
    }
    this._bookShelf.push(book);
    //store change to localStorage
    this.store();
    return true;
  } else {
    console.log("Error: input must be in the Book object format")
  }
};

Library.prototype.addBooks = function (books) {
  /*Purpose: Takes multiple books, in the form of an array of book objects, and adds the objects to your books array.
  Return: number number of books successfully added, 0 if no books were added*/

  //error handling - check if input is an array
  if (Array.isArray(books)){
    var count = 0;
    //loop through input array
    for(j=0; j<books.length; j++){
      /*use previous function (which outputs true for added and false for not added)
      if book can be added, increase count.
      Calling the function in the if statement will cause the book to be added, so we don't need to retell it to add.*/
      if(this.addBook(books[j])) {
        count++;
      }
    }
    return count;
  } else {
    console.log("Error: input must be in array format")
  }
};

Library.prototype.removeBookbyTitle = function (title) {
  /*Purpose: Remove book from from the books array by its title.
  Return: boolean true if the book(s) were removed, false if no books match*/

  //create counter for removed books
  var removed = 0;
  for(i=0; i<this._bookShelf.length; i++){
    //variable to keep crazy dots in perspective
    //toLowerCase used so function is not case sensitive
    //if using RegEx could use /i flag
    var bookShelfTitle = this._bookShelf[i].title.toLowerCase();
    //if titles are exactly equal remove entry, increment removed variable
    if(bookShelfTitle === (title.toLowerCase())){
      this._bookShelf.splice(i, 1);
      removed++;
    };
  }
  //if removed is not 0, book was removed, return true
  if(removed > 0){
    //store change to localStorage
    this.store();
    return true;
  } else {
    return false;
  }
};

Library.prototype.removeBookByAuthor = function (authorName) {
  /*Purpose: Remove a specific book from your books array by the author name.
  Return: boolean true if the book(s) were removed, false if no books match */

  //reuse logic from removeBookbyTitle
  var removed = 0;
  for(i=0; i<this._bookShelf.length; i++){
    var bookShelfAuthor = this._bookShelf[i].author.toLowerCase();
    //if titles are exactly equal remove entry, increment removed
    if(bookShelfAuthor === (authorName.toLowerCase())){
      this._bookShelf.splice(i, 1);
      removed++;
      /* splice lets the next entry "fall" back into the previous index so we have to go back to check that entry
      We accomplish this by resetting the index to the previous number but only if we've spliced something
      This doesn't matter for removeBookbyTitle because there will only be one book with that title.
      Technically though, we are skipping searching an entry. */
      i--;
    };
  }
  if(removed > 0){
    this.store();
    return true;
  } else {
    return false;
  }
};

Library.prototype.getBookByTitle = function (title) {
  /*Purpose: Return all books that completely or partially matches the string title passed into the function
  Return: array of book objects if you find books with matching titles, empty array if no books are found*/
  var hasTitleResults = new Array();
  for(i=0; i<this._bookShelf.length; i++){
    //create holder variable because dot notation was getting crazy
    //toLowerCase allows the input to be matched regardless of capitalization (must use on both input and .title)
    var bookShelfTitle = this._bookShelf[i].title.toLowerCase();
    //check if there is a match, then push the {Book} to results
    //match checks for exact match and outputs an array
    if(bookShelfTitle.match(title.toLowerCase()) !== null){
      hasTitleResults.push(this._bookShelf[i]);
    };
  }
  return hasTitleResults;
};

Library.prototype.getBooksByAuthor = function (authorName) {
  /* Purpose: Finds all books where the author’s name partially or completely matches the authorName argument passed to the function.
  Return: array of books if you find books with match authors, empty array if no books match*/

  //reuse logic from getBookByTitle
  var hasAuthorResults = new Array();
  for(i=0; i<this._bookShelf.length; i++){
    var bookShelfAuthor = this._bookShelf[i].author.toLowerCase();
    if(bookShelfAuthor.match(authorName.toLowerCase()) !== null){
      hasAuthorResults.push(this._bookShelf[i]);
    };
  }
  return hasAuthorResults;

};


Library.prototype.getAuthors = function () {  //research filter for this
  /*Purpose: Find the distinct authors’ names from all books in your library
  Return: array of strings the names of all distinct authors, empty array if no books exist or if no authors exist*/

  var fullAuthorArray = new Array();
  //for loop to make an array of author names
  for(i=0; i<this._bookShelf.length; i++){
    fullAuthorArray.push(this._bookShelf[i].author);
  };
  //use reduce to remove duplicate items
  //chose because I found an example on MDN removing duplicate numbers - this seems to be used primarily for numerical transforms
  var authorArray = fullAuthorArray.reduce(function(accumulator, current){
    //check if the current value is in the accumulator, and push to accumulator if it's not
    //indexOf returns an index value of location, -1 means it didn't find a match
    if (accumulator.indexOf(current) == -1){
      accumulator.push(current);
    }
    //must return the accumulator outside the if statement in order to continue running
    //if it is inside the conditional the accumulator will become undefined and break the loop
    return accumulator;
  },[]);
  return authorArray;
};

Library.prototype.getRandomBook = function () {
  /*Purpose: Return a random book object from your books array
  Return: book object if you find a book, null if there are no books */

  //Math.random gives a random number between 0 & 1,
  //*length will make it between 0 and length
  //Math.floor rounds number down to nearest integer
  var randomBook = new Array();
  randomBook = this._bookShelf[Math.floor(Math.random()*this._bookShelf.length)];
  return randomBook;
};

Library.prototype.getRandomAuthorName = function () {
  /*Purpose: Retrieves a random author name from your books collection
  Return: string author name, null if no books exist*/

  //reuse logic from randomBook
  var randomAuthor = new Array();
  randomAuthor = this._bookShelf[Math.floor(Math.random()*this._bookShelf.length)].author;
  return randomAuthor;
};

/*-----MORE ROBUST SEARCH FUNCTIONS-------------------------------------------*/
//Add a more robust search function to your app to allow you to filter by one or more book properties
//the search function should return an array of book instances
Library.prototype.getBookByPageCount = function (pages, range){
  //Returns an array of books with matching numberOfPages
    var hasResults = [];
    //range is an optional variable that is either the number the user inputs or 50
    var range = range || 50;
    //loop through bookShelf
    for(i=0; i<this._bookShelf.length; i++){
      //create a variable pointing toward numberOfPages
      var bookShelfPages = this._bookShelf[i].numberOfPages
      //push to results array if numberOfPages is within 50 pages of input
      if((bookShelfPages >= pages - range) && (bookShelfPages <= pages + range )){
        hasResults.push(this._bookShelf[i]);
      };
    }
    return hasResults;
};

Library.prototype.getBookByPubDate = function (pubDate, range){
  //Returns an array of books with matching publishDate
    var hasResults = [];
    //range is an optional variable that is either the number the user inputs or 0
    var range = range || 0;
    //loope through bookShelf
    for(i=0; i<this._bookShelf.length; i++){
      //create variable pointing toward publishDate
      var bookShelfpubDate= this._bookShelf[i].publishDate;
      //push to results array if publishDate is within range years of input
      if((pubDate-range)<= bookShelfpubDate && bookShelfpubDate <= (pubDate+range)){
        hasResults.push(this._bookShelf[i]);
      };
    }
    return hasResults;
};

Library.prototype.search = function (input, input2) {
  //if input is a string search by Title and author
  if (input && typeof input === "string"){
    //call previous funtions and concatenate into one array
    var results = this.getBookByTitle(input).concat(this.getBooksByAuthor(input));
    //else if input is a number search by numberOfPages and publishDate
  } else if (input && typeof input === "number"){
    //call previous functions and concatenate into one array
    var results = this.getBookByPageCount(input, input2).concat(this.getBookByPubDate(input, input2));
  }
  return results;
};

/*-----LOCAL STORAGE----------------------------------------------------------*/
/*Use localstorage and JSON.stringify to save the state of your library*/
Library.prototype.recover = function (){
  //a function to recover the Library stored in localStorage
  var parsed = JSON.parse(localStorage.getItem(this._libraryKey));
  for(i=0; i<parsed.length; i++){
    this._bookShelf[i] = new Book(parsed[i].title, parsed[i].author, parsed[i].numberOfPages, parsed[i].publishDate);
  }
}

Library.prototype.store = function () {
  //a function to push the library to localStorage
  var storeParsed = JSON.stringify(this._bookShelf);
  localStorage.setItem(this._libraryKey, storeParsed);
}

/*-----USEFUL FUNCTION--------------------------------------------------------*/
Library.prototype.clearAll= function () {
  /*Purpose: Remove all books to reset testing environment*/
  this._bookShelf.splice(0, this._bookShelf.length);
  this.store();
  return this._bookShelf
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

//We don't need this now since jquery is creating the instance
// //Things to do after DOM loaded
// document.addEventListener("DOMContentLoaded", function() {
//   window.goldenLibrary = new Library("goldenLibrary");
//
//   if(localStorage.length > 0){
//     console.log("Recovered from localStorage")
//     window.goldenLibrary.recover();
//   }
// });
