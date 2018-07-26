//a UI to handle adding books from a modal
//contructor - container is a placeholder for the selector of the modal
var AddBooksUI = function(container){
  //reassign 'this' to the instance of Library -- native javaScript version of proxy
  Library.call(this);
  this._tempBookShelf = new Array();
  this.$container = container;
  this._queueCounter = 0;
};

//extending from Library
AddBooksUI.prototype = Object.create(Library.prototype);

//initialize the instance
AddBooksUI.prototype.init = function () {
  this._bindEvents();
  return;
};

//put all events that should be controlled by this modal here
//proxy similar to call - resets the context to the scope of the class or it would just be within the function's context -- if we didn't use it 'this' would return the jQuery object that was clicked
AddBooksUI.prototype._bindEvents = function () {
  //bind event to open modal
  $('#add-books-btn').on('click', $.proxy(this._handleModalOpen, this));

  //bind event to add book to queue
  this.$container.find('.queue-btn').on('click', $.proxy(this._queueBooks, this));
  //bind event to clear queue
  this.$container.find('.clear-queue-btn').on('click', $.proxy(this._clearQueue, this));
  //bind event to add books to library
  this.$container.find('#formAddAllBooks').on('click', $.proxy(this._addBooksToLIb, this));
  //bind event to upload images
  this.$container.on('change','#formAddBookCover', $.proxy(this._handleImageUpload, this))
  // return;
};

//open the modal
AddBooksUI.prototype._handleModalOpen = function () {
  this.$container.modal('show');
  return;
};

//make book object from inputs
AddBooksUI.prototype.makeBook = function () {
  // serializeArray returns an array of objects with name and value keys - name is the name from html, value is the user input
  var serializedInput = $('form').serializeArray();

    var holdingObj = new Object();
    var validBook = true;
    //for each entry in the inputs put the value into the object with name as the key (if there's a value)
    $.each(serializedInput, function(index, entry){
      if(entry.value !== ''){
        holdingObj[entry.name] = entry.value;
      } else {
        validBook = false;
        // alert("Please enter a value for " + entry.name)
      }
    });
    var cover = $('#preview-image').attr('src');
    holdingObj['cover'] = cover;
    if(validBook){
      //put the holdingObj into a Book object
      var inputBook = new Book(holdingObj)
    } else {
      alert("This book does not have all required fields.")
    }

    //return book
    return inputBook;

};



//add books to queue
AddBooksUI.prototype._queueBooks = function (event) {
  //prevent button from closing modal
  event.preventDefault();
  if ($('form').val() !== 0) {
    //make a book from input data
    inputBook = this.makeBook();
    //check if already on bookShelf, if not push to temp and increase queue counter
    if(this.checkForDuplicates(inputBook)){
      this._tempBookShelf.push(inputBook);
      this._queueCounter++;
      $('.queueNumber').text(this._queueCounter);
      $('form').trigger('reset');
      $('#preview-image').removeClass("show").addClass("hide");
      $('#preview-image').removeAttr('src').attr('src', './assets/cover_images/book_cover_b&w.jpg');
    } else {
      alert("This book is already on your Bookshelf!")
    }
  }
  return;
};

//function to clear the _tempBookShelf and reset the _queueCounter
AddBooksUI.prototype._clearQueue = function (event) {
  //stop default so modal doesn't immediately close
  event.preventDefault();
  this._tempBookShelf = [];
  this._queueCounter = 0;
  $('.queueNumber').text(this._queueCounter);
  $('form').trigger('reset');
  $('#preview-image').removeClass("show").addClass("hide");
  $('#preview-image').removeAttr('src').attr('src', './assets/cover_images/book_cover_b&w.jpg')
};

//add Queued books to bookshelf
AddBooksUI.prototype._addBooksToLIb = function (event) {
  //stop default so modal doesn't immediately close
  event.preventDefault();
  //if there are no books in queue push this book to bookShelf otherwise add queue to bookShelf
  if(this._queueCounter===0 && $('form').val()===''){
    inputBook = this.makeBook();
    if(this.checkForDuplicates(inputBook)){
      this.addBook(inputBook);
      this._clearQueue();
      this.$container.modal('hide');
    } else {
      alert("This book is missing entry fields or is already on your bookshelf.");
    }
  } else {
    if($('form').val()!==''){
      inputBook = this.makeBook();
      if(this.checkForDuplicates(inputBook)){
        this.addBook(inputBook);
      }
    }
    this.addBooks(this._tempBookShelf);
    this._clearQueue(event);
    this.$container.modal('hide');
  }
  return;
};

//encode image up
AddBooksUI.prototype._handleImageUpload = function () {
  $('#preview-image').removeClass("hide").addClass("show");

  var preview = document.querySelector('#preview-image');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    var cover = reader.readAsDataURL(file);

  }
  return cover;

};

// AddBooksUI.prototype.validator = function (input) {
//   //uses jQuery Validation Plugin: not currently using in code (haven't tested)
//
//   // //Example: jQuery Form Validation Plugin
//   // $(document).ready(function() {
//   //     $('#your_form_id').ajaxForm( { beforeSubmit: dateCheck } );
//   // });
//   $("#formAddBook").validate({
//     rules: {
//       //basic syntax
//       title: "required",
//       author: "required",
//       numberOfPages: {
//         required: true,
//         number: true
//       },
//       publishDate: {
//         required: true,
//         date: true
//       }
//     },
//     messages: {
//       title: "Please enter a title",
//       author: "Please enter an author",
//       numberOfPages: {
//         required: "Please enter number of pages",
//         number: "Please enter a number"
//       },
//       publishDate: {
//         required: "Please enter a date",
//         minlength: "Please enter a date in mm/dd/yyyy format"
//       }
//     }
//   }
//   )
// };

$(function(){
  window.gAddBooksUI = new AddBooksUI($('#addBookModal'));
  window.gAddBooksUI.init();
});
