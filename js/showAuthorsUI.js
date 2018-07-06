var ShowAuthorsUI = function(container) {
  this.$container = container; //refactor
  Library.call(this);//set the this keyword to Library so that we can call anything in the library using 'this' "resetting scope"
};

//make a new reference to the Library
ShowAuthorsUI.prototype = Object.create(Library.prototype);

//make an initialization function - put things you want immediately loaded here
ShowAuthorsUI.prototype.init = function () {
  //separate concerns - recover should be inside the Library not here
  this.recover();
  this._bindEvents();
  return false;
};

ShowAuthorsUI.prototype._bindEvents = function () {
  //using proxy to force this to be the scope and not the element
  $('button#show-all-button"]').on('click', $.proxy(this._handleShowAuthors, this));
  return false;
};

ShowAuthorsUI.prototype._handleShowAuthors = function () {

  //console.log(this.getAuthors());
  var authors = this.getAuthors();
  this.$container.modal('show');
  this.$container.find('.modal-body').html(this._createUlOfAuthors(authors));
  if(authors.length){

  } else {
    alert('Nothing in library!')
  }
  return false;
};

ShowAuthorsUI.prototype._createUlOfAuthos = function () {
  var ul = document.createElement('ul');
  for (var i = 0; i < authors.length; i++) {
    var li = document.createElement('li');
    $(li).text(authors[i]);
    ul.append(li);
  }
};

$(function(){
  //creating a new instance here will create a new instance of library
  //can access anything on the Library
  //creating references to original - sorta protects it
  // window.gShowAuthUI = new ShowAuthorsUI();

  window.gShowAuthUI = new ShowAuthorsUI($('allAuthorModal'));//refactor
  window.gShowAuthUI.init();
});
