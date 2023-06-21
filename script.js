/* Copyright 2023 felixApps (https://github.com/felixApps)

Licensed under the MIT License (https://opensource.org/licenses/MIT) */

// Get cookie banner and accept button
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');

// Check if the user has already accepted the cookie policy
if (localStorage.getItem('cookieAccepted') === 'true') {
  cookieBanner.classList.add('hide');
} else {
  // Add delay to force fade-in animation
  setTimeout(() => {
    cookieBanner.classList.add('show');
  }, 50);
}

// If user clicks OK, hide the banner and store a cookieAccepted flag in local storage
cookieAccept.addEventListener('click', () => {
  localStorage.setItem('cookieAccepted', 'true');
  cookieBanner.classList.remove('show');
  cookieBanner.classList.add('hide');
});

// Disable right-click on image
document.getElementById('rawimg').addEventListener('contextmenu', event => event.preventDefault());
// Init textfields count
var textfields = 0;
var fieldinputs = document.getElementById('fieldinputs');
var memecontainer = document.getElementById('meme');
function addField() {
    // increase textfields count by 1
    textfields++;
    // Create Element for management on left side
    var newTextField = document.createElement('p');
    newTextField.className = 'fieldinputs';
    newTextField.id = 'msginput' + textfields;
    newTextField.innerHTML = '<p style="display:inline;">Meme Text ' + textfields + ': </p><div class="mdl-textfield mdl-js-textfield"><input class="mdl-textfield__input" type="text" id="meme_text_' + textfields + '" oninput="update_text(' + textfields + ')" maxlength="70"><label class="mdl-textfield__label" for="meme_text_' + textfields + '">Text</label></div>&nbsp;&nbsp;<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" onclick="remove_text(' + textfields + ')"><i class="material-icons">delete</i> Remove</button>';
    // Append Element
    fieldinputs.appendChild(newTextField);
    // upgrade Elements so ripple animation of buttons and textfield animation works
    componentHandler.upgradeElements(newTextField);
    // Create text on image
    var newField = document.createElement('div');
    newField.id = 'msg' + textfields;
    newField.className = 'message';
    newField.innerHTML = '&nbsp;';
    memecontainer.appendChild(newField);
    // The following lines of code allow you to move the text on the image using the computer mouse
    var move = false;
    var xPos, yPos;
    newField.addEventListener('mousedown', function(e) {
        move = true;
        xPos = e.clientX - newField.offsetLeft;
        yPos = e.clientY - newField.offsetTop;
    });
    document.addEventListener('mousemove', function(e) {
        if (move) {
        newField.style.left = (e.clientX - xPos) + 'px';
        newField.style.top = (e.clientY - yPos) + 'px';
        }
    });
    document.addEventListener("mouseup", function(e) {
        move = false;
    });
}
// Remove text
function remove_text(msg) {
    document.getElementById('msginput' + msg).remove();
    document.getElementById('msg' + msg).remove();
}
// Update image onto the screen 
function update_image(a) {
    var img = document.querySelector('img');
    // Returns the first img element
    if (a == 1) {
      var file = document.getElementById('replaceimageinput').files[0];
    // Returns the first file element found
    } else {
      var file = document.querySelector('input[type=file]').files[0];
    // Returns the first file element found
    }
    document.getElementById('rawimg').classList = 'memeuploaded';
    img.src = window.URL.createObjectURL(file);
    // Execute after update_image
    imgimported();
}
    // Write the text onto the meme
function update_text(msgcont) {
    var messagecontainer = document.getElementById('msg' + msgcont);
    var msg = document.getElementById('meme_text_' + msgcont).value.replace(' ', '&nbsp;');
    messagecontainer.innerHTML = msg;
}
// find all elements with the class "message"
var memetexts = document.querySelectorAll('.message');

// Loop through each element and add the event listener
for (var i = 0; i < memetexts.length; i++) {
  var memetext = memetexts[i];
  var move = false;
  var xPos, yPos;

  memetext.addEventListener('mousedown', function(e) {
    move = true;
    xPos = e.clientX - memetext.offsetLeft;
    yPos = e.clientY - memetext.offsetTop;
  });

  document.addEventListener('mousemove', function(e) {
    if (move) {
      memetext.style.left = (e.clientX - xPos) + "px";
      memetext.style.top = (e.clientY - yPos) + "px";
    }
  });

  document.addEventListener('mouseup', function(e) {
    move = false;
  });
}


// Finish the meme
function fin() {
    if (document.getElementById('rawimg').classList == 'memeuploaded') {
      // Makes a Screenshot of Element #meme
      // Please note that this isn't a professional solution and this website isn't professional either. If you want to do professional image editing, you will use Photoshop or GIMP.
    html2canvas(document.querySelector('#meme')).then(canvas => {
      // Insert new Buttons
      var base64 = canvas.toDataURL('image/png');
      document.getElementById('result').innerHTML = `<a href="` + base64 + `" download="Meme.png" style="display:inline;text-decoration:none;"><button style="display:inline;" id="downloadbtn" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">download</i> Download!</button></a>&nbsp;<button style="display:inline;" id="copybtn" onclick="copyContent('` + base64 + `')" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">content_copy</i> Copy to clipboard!</button>&nbsp;<button style="display:inline;" id="editbtn" onclick="returntoEdit()" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">edit</i> Edit</button>&nbsp;<button style="display:inline;" onclick="location.reload();" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">refresh</i> Reset</button>`;
      // Don't forget to upgrade elements!!
      componentHandler.upgradeElements(document.getElementById('result'));
  });
  } else {
    triggerSnackbar('Please upload a picture first!');
  }
}
// Function to copy content into clipoard
const copyContent = async (textcontent) => {
    try {
        await navigator.clipboard.writeText(textcontent);
        triggerSnackbar('Copied to clipboard!');
    } catch (err) {
        // If error happens, throw the error.
        triggerSnackbar('Failed to copy: ', err);
        throw('Failed to copy: ', err);
    }
}
// allows to restore previous function buttons
function returntoEdit() {
  document.getElementById('result').innerHTML = '<button onclick="addField();" id="addtextfield" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">add</i> Add Text Field</button>&nbsp;<button id="finished-btn" onclick="fin();" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">done</i> Finish</button>';
  componentHandler.upgradeElements(document.getElementById('result'));
}
// triggers the material snackbar with a message
function triggerSnackbar(text) {
  var snackbarContainer = document.querySelector('#demo-toast-example');
      'use strict';
      var data = {message: text};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// the following code manages the take-photo-modal

const openModalBtn = document.getElementById('open-modal-btn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementsByClassName('close-btn')[0];

openModalBtn.onclick = async function() {
  modal.style.display = 'block';
  setTimeout(function() {
    modal.classList.add('show');
  }, 50);
  init();
}

closeBtn.onclick = function() {
  closeTheModal();
}

async function openModal() {
  modal.style.display = 'block';
  setTimeout(function() {
    modal.classList.add('show');
  }, 50);
  init();
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(function() {
      modal.style.display = 'none';
      modal.classList.remove('hide');
    }, 500);
  }
}

function closeTheModal() {
modal.classList.remove('show');
  modal.classList.add('hide');
  setTimeout(function() {
    modal.style.display = 'none';
    modal.classList.remove('hide');
  }, 500);
}

// this is going to be executed after import_image(a)
function imgimported() {
  document.getElementById('replace_image').innerHTML=`<p style="display:inline;" id="imginput1">Meme Image: <form style="display:inline;" onsubmit="return false;"><label for="replaceimageinput" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary"><i class="material-icons">upload</i> Upload</label><input type="file" id="replaceimageinput" onchange="update_image(1)"> or <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" style="display:inline;" onclick="openModal(1)" id="open-modal-btn"><i class="material-icons">photo_camera</i> take photo</button>.</form>`;
  componentHandler.upgradeElements(document.getElementById('replace_image'));
  document.getElementById('importimage').style.display='none';
  document.getElementById('rawimg').classList = 'memeuploaded';
}

// now let's manage the webcam!
const video = document.getElementById('video');
const captureButton = document.getElementById('capture');

// request camera permission
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    // put stream onto video element
    video.srcObject = stream;
  } catch (e) {
    triggerSnackbar('Requesting camera permission with getUserMedia failed: ', e);
    console.error('Requesting camera permission with getUserMedia failed: ', e);
  }
}

// capture image
function capture() {
var img = document.querySelector('img');
html2canvas(document.querySelector('#video')).then(canvas => {
        // Make Data url
        var base64 = canvas.toDataURL('image/png');
        // Make Link href
        img.src = base64;
        closeTheModal();
        imgimported();
        // stop webcam stream
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    });
}

captureButton.addEventListener('click', () => {
  capture();
});

// I think I don't have to explain this function. 
function hideshowCredits(hideorshow) {
  if (hideorshow == 0) {
    var action = 'block';
  } else if (hideorshow == 1) {
    var action = 'none';
  }
  document.getElementById('credits').style.display = action;
}