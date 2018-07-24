/*"Class" to represent a Library with functions to add, remove, and look up books in various ways*/

//Sington example from Kyle:
var Library;

(function() {
  var instance;

  Library = function() {

    //If instance exists return instance
    if (instance) {
      return instance;
    }
    //this will run the first time and only the first time
    instance = this;
    window.bookShelf = [];
    this._libraryKey = 'goldenLibrary';
    window.libraryURL = 'http://localhost:3002/Library';
  }
})();


// //This is the previous constructor from before we made this a singlton
// /*Constructor for Library class - use prototype (below) to make methods*/
// var Library = function(key){
//   window.bookShelf = new Array();
//   this._libraryKey = key;
// };


Library.prototype.addBook = function (book) {
  /*Purpose: Add a book object to your books array.
  Return: boolean true if it is not already added, false if it is already added.*/

  //error handling - check if input is already in bookShelf
  if (this.checkForDuplicates(book)){
    window.bookShelf.push(book);
    //store change to localStorage
    // this.store();
    //trigger _updateTable
    this._handleEventTrigger('tableUpdate')
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
    this._handleEventTrigger('tableUpdate', {details: "added Books: "+ count})
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
  for(i=0; i<window.bookShelf.length; i++){
    //variable to keep crazy dots in perspective
    //toLowerCase used so function is not case sensitive
    //if using RegEx could use /i flag
    var bookShelfTitle = window.bookShelf[i].title.toLowerCase();
    //if titles are exactly equal remove entry, increment removed variable
    if(bookShelfTitle === (title.toLowerCase())){
      window.bookShelf.splice(i, 1);
      removed++;
    };
  }
  //if removed is not 0, book was removed, return true
  if(removed > 0){
    this._handleEventTrigger('tableUpdate', {details: "removeBookbyTitle"})
    //store change to localStorage
    // this.store();
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
  for(i=0; i<window.bookShelf.length; i++){
    var bookShelfAuthor = window.bookShelf[i].author.toLowerCase();
    //if titles are exactly equal remove entry, increment removed
    if(bookShelfAuthor === (authorName.toLowerCase())){
      window.bookShelf.splice(i, 1);
      removed++;
      /* splice lets the next entry "fall" back into the previous index so we have to go back to check that entry
      We accomplish this by resetting the index to the previous number but only if we've spliced something
      This doesn't matter for removeBookbyTitle because there will only be one book with that title.
      Technically though, we are skipping searching an entry. */
      i--;
    };
  }
  if(removed > 0){
    this._handleEventTrigger('tableUpdate', {details: "removeBookByAuthor"})
    // this.store();
    return true;
  } else {
    return false;
  }
};

Library.prototype.getBookByTitle = function (title) {
  /*Purpose: Return all books that completely or partially matches the string title passed into the function
  Return: array of book objects if you find books with matching titles, empty array if no books are found*/
  var titleResults = new Array();

  if(title){
    // var regex = new RegExp(title, 'gi');

    for(i=0; i<window.bookShelf.length; i++){
      //create holder variable because dot notation was getting crazy
      //toLowerCase allows the input to be matched regardless of capitalization (must use on both input and .title)
      var bookShelfTitle = window.bookShelf[i].title.toLowerCase();
      //check if there is a match, then push the {Book} to results
      //match checks for exact match and outputs an array
      if(bookShelfTitle.match(title.toLowerCase()) !== null){
        titleResults.push(window.bookShelf[i]);
      };
    }
  } else {
    console.log("Please enter a valid title.")
  }
  return titleResults;
};

Library.prototype.getOneBookByTitle = function (title) {
  for (var i = 0; i < window.bookShelf.length; i++) {
    if(window.bookShelf[i].title.toLowerCase() === title.toLowerCase()){
      return window.bookShelf[i]
    }
  }
};

Library.prototype.getBooksByAuthor = function (authorName) {
  /* Purpose: Finds all books where the author’s name partially or completely matches the authorName argument passed to the function.
  Return: array of books if you find books with match authors, empty array if no books match*/

  //reuse logic from getBookByTitle
  if(authorName){
    var regex = new RegExp(authorName, 'gi');
    var hasAuthorResults = new Array();
    for(i=0; i<window.bookShelf.length; i++){
      var bookShelfAuthor = window.bookShelf[i].author;
      if(bookShelfAuthor.match(regex) !== null){
        hasAuthorResults.push(window.bookShelf[i]);
      };
    }
    return hasAuthorResults;
  } else {
    console.log("Please enter a valid author name.");
    return [];
  }
};


Library.prototype.getAuthors = function () {  //research filter for this
  /*Purpose: Find the distinct authors’ names from all books in your library
  Return: array of strings the names of all distinct authors, empty array if no books exist or if no authors exist*/

  var fullAuthorArray = new Array();
  //for loop to make an array of author names
  for(i=0; i<window.bookShelf.length; i++){
    fullAuthorArray.push(window.bookShelf[i].author);
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
  if(window.bookShelf.length === 0){
    return null;
  } else {
    var randomBook = window.bookShelf[Math.floor(Math.random()*window.bookShelf.length)];
    return randomBook;
  }
};

Library.prototype.getRandomAuthorName = function () {
  /*Purpose: Retrieves a random author name from your books collection
  Return: string author name, null if no books exist*/

  //reuse logic from randomBook
  var randomAuthor = new Array();
  randomAuthor = window.bookShelf[Math.floor(Math.random()*window.bookShelf.length)].author;
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
    for(i=0; i<window.bookShelf.length; i++){
      //create a variable pointing toward numberOfPages
      var bookShelfPages = window.bookShelf[i].numberOfPages
      //push to results array if numberOfPages is within 50 pages of input
      if((bookShelfPages >= pages - range) && (bookShelfPages <= pages + range )){
        hasResults.push(window.bookShelf[i]);
      };
    }
    return hasResults;
};

Library.prototype.getBookByPubDate = function (pubDate, range){
  //Returns an array of books with matching publishDate
    var hasResults = [];
    //range is an optional variable that is either the number the user inputs or 0
    var range = range || 5;
    //loope through bookShelf
    for(i=0; i<window.bookShelf.length; i++){
      //create variable pointing toward publishDate
      var bookShelfpubDate= window.bookShelf[i].publishDate;
      //push to results array if publishDate is within range years of input
      if((pubDate-range)<= bookShelfpubDate && bookShelfpubDate <= (pubDate+range)){
        hasResults.push(window.bookShelf[i]);
      };
    }
    return hasResults;
};

Library.prototype.search = function (input, input2) {
  //if input is a string search by Title and author
  if (input){
    //call previous funtions and concatenate into one array
    var results = this.getBookByTitle(input).concat(this.getBooksByAuthor(input)).concat(this.getBookByPageCount(parseInt(input), parseInt(input2))).concat(this.getBookByPubDate(parseInt(input), parseInt(input2)));
  }
  var resultsFilter = results.reduce(function(accumulator, current){
    if (accumulator.indexOf(current) == -1){
      accumulator.push(current);
    }
    return accumulator;
  },[]);
  // var resultsFilter = new Set(results); // May be an ES6 solution only?
  return resultsFilter;
};

/*-----LOCAL STORAGE- don't use this now: use mongoDB
----------------------------------------------------------*/
/*Use localstorage and JSON.stringify to save the state of your library*/
// Library.prototype.recover = function (){
//   //a function to recover the Library stored in localStorage
//   var parsed = JSON.parse(localStorage.getItem(this._libraryKey));
//   if(parsed){
//     for(i=0; i<parsed.length; i++){
//       //change to take object instead of specific arguments
//       window.bookShelf[i] = new Book(parsed[i]);
//     }
//   }
// }
//
// Library.prototype.store = function () {
//   //a function to push the library to localStorage
//   var storeParsed = JSON.stringify(window.bookShelf);
//   localStorage.setItem(this._libraryKey, storeParsed);
// }

/*-----USEFUL FUNCTION--------------------------------------------------------*/
Library.prototype.clearAll= function () {
  /*Purpose: Remove all books to reset testing environment*/
  window.bookShelf.splice(0, window.bookShelf.length);
  // this.store();
  return window.bookShelf
};

Library.prototype.checkForDuplicates = function (book) {
  if (book){
    for(i=0; i<window.bookShelf.length; i++){
      //check if book title is present, if present return false, otherwise return true
      if(book.title === window.bookShelf[i].title){
        return false;
      }
    }
    return true;
  }
};

Library.prototype._handleEventTrigger = function (sEvent, oData) {
  var oData = oData || {};
  if(sEvent){
    var event = new CustomEvent(sEvent,{'detail': oData});
    document.dispatchEvent(event);
  }
  //have to use detail as the key in the object you pass
};



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


//get data from database
Library.prototype.getDataFromDatabase = function () {
  console.log("Database function was called");
  $.ajax({
    url: window.libraryURL,
    dataType: 'json',
    method: 'GET',
    success: function (data) {
      console.log("I got some data!");
      console.log(data)
      if(data){
        for(item in data){
          console.log(data[item].publishDate)
          window.bookShelf.push(new Book(data[item]));
        }
      }
      console.log(window.bookShelf)
    }
  })
};
