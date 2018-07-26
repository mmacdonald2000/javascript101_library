//Everyting that does not directly affecting the bookShelf and the state of it goes hasTitleResults:
// 1-off functions, no inheritance

//make global variable  -- replace all the this._bookShelf with window.bookShelf in library.js
var bookShelf = new Array();

//Format date from datetime function here

//

//make camelCase words into normal words
var makeTitle = function(str){
  //split using regex to find uppercase letter but keep it attached to the letters following it
  var splits = str.split(/(?=[A-Z]+)/);
  //split the first word up
  var split1 = splits[0].split('');
  //make the first letter upper case
  split2 = split1[0].toUpperCase();
  //rejoin the first word
  var rejoin1 = split2;
  for(i=1; i<split1.length; i++){
    rejoin1 = rejoin1 + split1[i];
  }
  //reset the first word to capitalized word
  splits[0] = rejoin1;
  //rejoin the strings with a space in between
  var rejoined = splits.join(" ");

  return rejoined;
}

//encode image up
var fileReader = function (imageSelector, inputSelector, $target) {
  $target = $target || document;

  var preview = $target.find(imageSelector);
  var file    = document.querySelector(inputSelector).files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.attr('src', reader.result);
  }, false);

  if (file) {
    var cover = reader.readAsDataURL(file);
  }
  return cover;
};
