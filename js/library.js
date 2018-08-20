/*"Class" to represent a Library with functions to add, remove, and look up books in various ways*/

//Sington execution of Library
var Library;

(function() {
  var instance;

  Library = function() {

    if (instance) {
      return instance;
    }
    instance = this;
    window.bookShelf = [];
    window.searchResults = [];
    this._libraryKey = 'goldenLibrary';
    window.libraryURL = 'http://localhost:3002/Library/';
  }
})();


Library.prototype.addBook = function (book) {
  /*Purpose: Add a book object to your books array.
  Return: boolean true if it is not already added, false if it is already added.*/

  if (this.checkForNoDuplicates(book)){
    console.log("adding to bookshelf");
    window.bookShelf.push(book);

    // this.storeToDatabase(book).then((res)=>{
    //   console.log(res);
    //   this.getDataFromDatabase();
    // })
    return true;
  } else {
    console.log("Error: input must be in the Book object format")
  }
};

Library.prototype.addBooks = function (books) {
  /*Purpose: Takes multiple books, in the form of an array of book objects, and adds the objects to your books array.
  Return: number number of books successfully added, 0 if no books were added*/

  if (Array.isArray(books)){
    var _self = this;
    // var count = 0;
    // for(j=0; j<books.length; j++){
    //   if(this.addBook(books[j])) {
    //     count++;
    //   }
    // }
     this.storeToDatabase(books).then((res)=>{
      console.log(res);
      if(res.insertedCount){
        for (var i = 0; i < res.ops.length; i++) {
          window.bookShelf.push(new Book(res.ops[i]))
        }
        _self._handleEventTrigger('specialUpdate', window.bookShelf);


      }
      // this.getDataFromDatabase();
      return res.insertedCount;
    })


  } else {
    console.log("Error: input must be in array format")

  }
  return 0;
};

Library.prototype.removeBookbyTitle = function (title) {
  /*Purpose: Remove book from from the books array by its title.
  Return: boolean true if the book(s) were removed, false if no books match*/

  var removed = 0;
  for(i=0; i<window.bookShelf.length; i++){
    var bookShelfTitle = window.bookShelf[i].title.toLowerCase();

    if(bookShelfTitle === (title.toLowerCase())){
      window.bookShelf.splice(i, 1);
      removed++;
    };
  }
  //if removed is not 0, book was removed, return true
  if(removed > 0){
    this._handleEventTrigger('tableUpdate', {details: "removeBookbyTitle"})
    return true;
  } else {
    return false;
  }
};

Library.prototype.removeBookByAuthor = function (authorName) {
  /*Purpose: Remove a specific book from your books array by the author name.
  Return: boolean true if the book(s) were removed, false if no books match */

  var removed = 0;
  for(i=0; i<window.bookShelf.length; i++){
    var bookShelfAuthor = window.bookShelf[i].author.toLowerCase();
    //if titles are exactly equal remove entry, increment removed
    if(bookShelfAuthor === (authorName.toLowerCase())){
      window.bookShelf.splice(i, 1);
      removed++;
      /* need i-- to check spliced entry */
      i--;
    };
  }
  if(removed > 0){
    this._handleEventTrigger('tableUpdate', {details: "removeBookByAuthor"})

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

    for(i=0; i<window.bookShelf.length; i++){
      var bookShelfTitle = window.bookShelf[i].title.toLowerCase();
      //check if there is a match, then push the {Book} to results
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

    for(i=0; i<window.bookShelf.length; i++){

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

    for(i=0; i<window.bookShelf.length; i++){

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

/*-----USEFUL FUNCTION--------------------------------------------------------*/
Library.prototype.clearAll= function () {
  /*Purpose: Remove all books to reset testing environment*/
  window.bookShelf.splice(0, window.bookShelf.length);

  return window.bookShelf
};

/**
 * [description]
 * @param  {[Book} book [a book to check against the bookShelf]
 * @return {[bool]}      [true for no duplicates]
 */

Library.prototype.checkForNoDuplicates = function (book) {
  // TODO: make regex to remove white space
  if (book){
    for(i=0; i<window.bookShelf.length; i++){

      if(book.title === window.bookShelf[i].title){
        return false;
      }
    }
    return true;
  }
};

/**
 * [description]
 * @param  {[string]} sEvent [an event name in string format]
 * @param  {[type]} oData  [object data to pass]
 * @return {[type]}        [description]
 */

Library.prototype._handleEventTrigger = function (sEvent, oData) {
  var oData = oData || {};
  if(sEvent){
    var event = new CustomEvent(sEvent,{'detail': oData});
    document.dispatchEvent(event);
  }
  //have to use detail as the key in the object you pass
};

Library.prototype.removeBookbyId = function (id) {

  var removed = 0;
  for(i=0; i<window.bookShelf.length; i++){
    var bookShelfId = window.bookShelf[i]._id;
    if(bookShelfId === id){
      window.bookShelf.splice(i, 1);
      removed++;
    };
  }
  if(removed > 0){

    this.deleteFromDatabase(id).then((res)=>{
      this.getDataFromDatabase();
    });
    return true;
  } else {
    return false;
  }
};

/* ------------------- CRUD routes ----------------- */

//send data to database (Create(POST))
Library.prototype.storeToDatabase = function (aBooks) {
  return $.ajax({
    url: window.libraryURL,
    dataType: 'json',
    method: 'POST',
    data: {books: JSON.stringify(aBooks)}
  })
};

//get all books from database (Read(GET))
Library.prototype.getDataFromDatabase = function () {
  var _self = this;
  $.ajax({
    url: window.libraryURL,
    dataType: 'json',
    method: 'GET',
     success: function (data) {
      if(data){
        window.bookShelf = [];
        for(item in data){
          window.bookShelf.push(new Book(data[item]));
        }
        _self._handleEventTrigger('specialUpdate', window.bookShelf);
        console.log('Successful GET');
      }
    },
    error: function (error) {
      console.log("GET ERROR: ");
      console.log(error);
    }
  })
};

//get 1 book from database (Read(GET))
Library.prototype.getOneBookFromDatabase = function (id) {
  return $.ajax({
    url: window.libraryURL + id,
    dataType: 'json',
    method: 'GET'
  })
};

//get search results from database (Read(GET))
Library.prototype.getSearchResults = function (searchParam) {
  return $.ajax({
    url: window.libraryURL+'search/'+ searchParam,
    dataType: 'json',
    method: 'GET'
  })
}

//edit data in database (Update(PUT))
Library.prototype.editDataFromDatabase = function (oBook) {
  return $.ajax({
    url: window.libraryURL + oBook._id,
    dataType: 'text',
    method: 'PUT',
    data: oBook
  })
};

//delete data to database (Delete(DELETE))
Library.prototype.deleteFromDatabase = function (id) {
  return $.ajax({
    url: window.libraryURL + id,
    dataType: 'text',
    method: 'DELETE',
    data: id
  })
};


function rearrange (callback, array) {
  // console.log(arguments);
  return function() {
    var aResults = []

    for(i=0; i<array.length; i++) {
    aResults[i] = arguments[array[i]]
    }
    // console.log(this);
    return aResults;
  }
};


var test = rearrange( function(a,b,c) {
  // console.log(this)
  return[a,b,c];
}, [2,0,1]);
