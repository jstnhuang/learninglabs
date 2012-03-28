// Gets the inputs from the input area and puts them into an array.
function getInputs() {
  var formInputs = $('.inputArea :input');
  var inputs = new Array();
  formInputs.each(function() {
    var name = $(this).attr('name');
    var value = $(this).val();
    inputs[name] = value;
  });
  
  return inputs
}

// Returns the text that should be at the top of the card (e.g.,
// "Happy birthday, George!"
function makeCardTitle(occasion, name) {
  var title = '';
  
  if (occasion == 'birthday') {
    title += 'Happy birthday';
  }
  else if (occasion == 'graduation') {
      title += 'Congratulations';
  }
  else if (occasion == 'get-well-soon') {
    title += 'Get well soon';
  }
  else {
    title += 'Have fun';
  }
  
  // If a name was entered, then append the name to the title.
  if (name != '') {
    title += ', ' + name;
  }
  
  title += '!';
  return title;
}

// Replaces newline characters with line breaks to put into HTML code.
function makeCardMessage(message) {
  return message.replace(/\n/g, '<br />');
}

function changeBackground(background) {
  var image = '';
  if (background == 'space') {
    image = 'space.jpg';
  }
  else if (background == 'history') {
    image = 'history.jpg';
  }
  else { // background == 'surfing'
    image = 'surfing.jpg';
  }
    
  $('#card').css('background-image', 'url(images/' + image + ')');
}

// Surrounds the given code in HTML <div> tags.
function addToDiv(code) {
  return '<div>' + code + '</div>';
}

// Escapes special characters in HTML.
function htmlEntities(str) {
  if (str == '') {
    return str;
  }
  else {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

// This function generates the HTML code for the card, using the inputs given in
// the input area.
function generateCard() {
  var inputs = getInputs();
  var occasion = inputs['occasion'];
  var name = htmlEntities(inputs['name']);
  
  // Add the title.
  var cardTitle = makeCardTitle(occasion, name);
  $('.cardTitle').html(addToDiv(cardTitle));
  
  // Add the message.
  var message = htmlEntities(inputs['message']);
  
  var cardMessage = makeCardMessage(message);
  $('.cardMessage').hide();
  if (cardMessage != '') {
    $('.cardMessage').html(addToDiv(cardMessage));
    $('.cardMessage').show();
  }
  
  changeBackground(inputs['background']);
}

// Initialize the card creator.
function init() {
  // When the user clicks on "Make card", call the code that generates the
  // card.
  $('#card').hide();
  $('.inputArea input[name=submit]').click(function() {
    generateCard();
    $('#card').fadeIn();
  });
}