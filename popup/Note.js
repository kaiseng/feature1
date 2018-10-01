/* Declare Variables */
var Title = document.querySelector('.new-note input');
var Body = document.querySelector('.new-note textarea');
var NoteContainer = document.querySelector('.note-container');
var ClearButton = document.querySelector('.clear');
var AddButton = document.querySelector('.add');

/*  Add Event Listeners to the Add and Clear buttons */
AddButton.addEventListener('click', addNote);
ClearButton.addEventListener('click', clearAll);

/* Generic the Error Handler */
function onError(error) {
  console.log(error);
}

/* Display the Stored Notes that are Previously-Saved on Startup */
initialize();

function initialize() {
  var getAllStorageItems = browser.storage.local.get(null);
  getAllStorageItems.then((results) => {
    var noteKeys = Object.keys(results);
    for (let noteKey of noteKeys) {
      var curValue = results[noteKey];
      displayNote(noteKey,curValue);
    }
  }, onError);
}

/* Add a Note to the Display and Storage */

function addNote() {
  var noteTitle = Title.value;
  var noteBody = Body.value;
  var gettingItem = browser.storage.local.get(noteTitle);
  gettingItem.then((result) => {
    var objTest = Object.keys(result);
    if(objTest.length < 1 && noteTitle !== '' && noteBody !== '') {
      Title.value = '';
      Body.value = '';
      storeNote(noteTitle,noteBody);
    }
  }, onError);
}

/* Function to Store a New Note in Storage */
function storeNote(title, body) {
  var storingNote = browser.storage.local.set({ [title] : body });
  storingNote.then(() => {
    displayNote(title,body);
  }, onError);
}

/* Function to Display a Note in the Note Box */
function displayNote(title, body) {

  /* Create the Note Display Box */
  var note = document.createElement('div');
  var noteDisplay = document.createElement('div');
  var noteH = document.createElement('h2');
  var notePara = document.createElement('p');
  var DeleteButton = document.createElement('button');
  var clearFix = document.createElement('div');

  note.setAttribute('class','note');

  noteH.textContent = title;
  notePara.textContent = body;
  DeleteButton.setAttribute('class','delete');
  DeleteButton.textContent = 'Delete Note';
  clearFix.setAttribute('class','clearfix');

  noteDisplay.appendChild(noteH);
  noteDisplay.appendChild(notePara);
  noteDisplay.appendChild(DeleteButton);
  noteDisplay.appendChild(clearFix);

  note.appendChild(noteDisplay);

  /* Set Up Listener for the Feature of Delete Note */
  DeleteButton.addEventListener('click',(e) => {
    const EventTarget = e.target;
    EventTarget.parentNode.parentNode.parentNode.removeChild(EventTarget.parentNode.parentNode);
    browser.storage.local.remove(title);
  })

  /* Create the Note Edit box */
  var noteEdit = document.createElement('div');
  var noteTitleEdit = document.createElement('input');
  var noteBodyEdit = document.createElement('textarea');
  var clearFix2 = document.createElement('div');

  var UpdateButton = document.createElement('button');
  var CancelButton = document.createElement('button');

  UpdateButton.setAttribute('class','update');
  UpdateButton.textContent = 'Update Note';
  CancelButton.setAttribute('class','cancel');
  CancelButton.textContent = 'Cancel Update';

  noteEdit.appendChild(noteTitleEdit);
  noteTitleEdit.value = title;
  noteEdit.appendChild(noteBodyEdit);
  noteBodyEdit.textContent = body;
  noteEdit.appendChild(UpdateButton);
  noteEdit.appendChild(CancelButton);

  noteEdit.appendChild(clearFix2);
  clearFix2.setAttribute('class','clearfix');

  note.appendChild(noteEdit);

  NoteContainer.appendChild(note);
  noteEdit.style.display = 'none';

  /* Set Up Listeners for the Feature of Update */

  noteH.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  })

  notePara.addEventListener('click',() => {
    noteDisplay.style.display = 'none';
    noteEdit.style.display = 'block';
  }) 

  CancelButton.addEventListener('click',() => {
    noteDisplay.style.display = 'block';
    noteEdit.style.display = 'none';
    noteTitleEdit.value = title;
    noteBodyEdit.value = body;
  })

  UpdateButton.addEventListener('click',() => {
    if(noteTitleEdit.value !== title || noteBodyEdit.value !== body) {
      updateNote(title,noteTitleEdit.value,noteBodyEdit.value);
      note.parentNode.removeChild(note);
    } 
  });
}

/* Function to Update Notes */
function updateNote(delNote,newTitle,newBody) {
  var storingNote = browser.storage.local.set({ [newTitle] : newBody });
  storingNote.then(() => {
    if(delNote !== newTitle) {
      var removingNote = browser.storage.local.remove(delNote);
      removingNote.then(() => {
        displayNote(newTitle, newBody);
      }, onError);
    } else {
      displayNote(newTitle, newBody);
    }
  }, onError);
}

/* Clear all the Notes from the Storage/Display */
function clearAll() {
  while (NoteContainer.firstChild) {
      NoteContainer.removeChild(NoteContainer.firstChild);
  }
  browser.storage.local.clear();
}


