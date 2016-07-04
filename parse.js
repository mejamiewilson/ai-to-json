//test scirpts
var toparse = "<</AIMetaData 19 0 R/AIPrivateData1 20 0 R/AIPrivateData2 21 0 R/AIPrivateData3 22 0 R/AIPrivateData4 23 0 R/AIPrivateData5 24 0 R/AIPrivateData6 25 0 R/ContainerVersion 11/CreatorVersion 19/NumBlock 6/RoundtripStreamType 1/RoundtripVersion 17>>";
var longParse = "<</ArtBox[622.0 382.319 658.0 418.319]/BleedBox[0.0 0.0 1280.0 800.0]/Contents 8 0 R/LastModified(D:20160603163149+12'00')/MediaBox[0.0 0.0 1280.0 800.0]/Parent 3 0 R/PieceInfo<</Illustrator 9 0 R>>/Resources<</ColorSpace<</CS0 10 0 R>>/ExtGState<</GS0 11 0 R>>/Properties<</MC0 5 0 R>>>>/Thumb 12 0 R/TrimBox[0.0 0.0 1280.0 800.0]/Type/Page>>";

var Parse = function(input, obj) {

  //If it starts with <, then it starts with <</
  if(input[0]==='<') {
    input = input.substr(3);
  }
  //If it starts with >, then it starts with >>/
  if(input[0]==='>') {
    input = input.substr(input.indexOf('/') + 1);
  }
  //if it still starts with >, then it has another level of >>
  if(input[0]==='>') {
    input = input.substr(2);
  }
  //If it's now empty, fail
  if(input.length === 0) {
    return '';
  }

  var breakPos = input.indexOfOneOf([' ', '<', '[', '(']);

  //There is no value
  if(!breakPos) {
    var breakPoint = input.indexOfOneOf(['/', '>']);
    var solitaryKey = input.substr(0, breakPoint);
    obj[solitaryKey] = {};
    return input.substr(solitaryKey.length + 1);
  }

  var key = input.substr(0, breakPos);

  input = input.substr(key.length);

  var value;

  if(input[0] === '<') {

    obj[key] = {};
    input = Parse(input, obj[key]);

  } else {

    var breakPoint = input.indexOfOneOf(['/', '>']);
    obj[key] = input.substr(0, breakPoint);
    input = input.substr(breakPoint + 1);

  }

  return input;

};


String.prototype.indexOfOneOf = function(arr) {

  var pieces = this.split('');
  for(var i = 0; i < pieces.length; i++) {
    var piece = pieces[i];
    for(var a = 0; a < arr.length; a++) {
      if(arr[a] === piece) {
        return i;
      }
    }
  }

};

module.exports = {
  parse: function(str) {
    var result = {};
    while(str.length > 0) {
      str = Parse(str, result);
    }
    return result;
  }
}
