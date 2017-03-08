//V A R I A B L E S
var noteIds = [];
var currentNoteText;
var sess;
var unsavedTitles = [];
var currentTitle;
var unsavedContent;
var originalContent;

var currentIndex;

//O N L O A D
$(document).ready(function(){
  //L O G I N  S T U F F WL comes directly from a microsoft script included in the head of index.html
  WL.Event.subscribe("auth.login", onLogin);

  WL.init({
      client_id: APP_CLIENT_ID,
      redirect_uri: "http://localhost",
      scope: "wl.signin office.onenote_update",
      response_type: "token"
  });

  WL.ui({
      name: "signin",
      element: "signin"
  });

  //T I N Y  M C E 
  tinyMCE.init({ 
    selector: '.tinyMCEarea',
    height: 500,
    setup:function(ed) {
       ed.on('change', function(e) {
           unsavedContent = ed.getContent();
       });
   }
  });
});//E N D  D O C U M E N T  R E A D Y

//F U N C T I O N fillNotes populates a list of ids and populates the Unordered list of note titles.
function fillNotes(listData){
  currentIndex = 0; unsavedTitles = []; noteIds = [];  unsavedContent = ""; originalContent = "";
  $("li.note").remove();
  tinyMCE.activeEditor.setContent("");
  $(".currentNoteTitle").text("Current Note");
  
  for (var i = 0; i < listData.value.length; i++) {
    var currentItem = listData.value[i];
    noteIds.push(currentItem.id);
    var title = $(`<li class="note"><a href="javascript:displayNote(${i})">${currentItem.title}</a></li>`);
    $(".notesList").append(title);
  }
}//E N D  F U N C T I ON fillNotes

//F U N C T I O N onLogin deals with the access token and the login ajax call
function onLogin (session) {
    if (!session.error) {
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response) {//S U C C E S S F U L  L O G I N
              sess = session
              accessToken = session.session.access_token;
              $.ajax({
                  url: 'https://www.onenote.com/api/v1.0/me/notes/pages',
                  type: "GET",
                  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
                  success: function(data) {
                      fillNotes(data);
                  }
              });
            },
            function (responseFailed) { // L O G I N  F A I L U R E
                alert("Login Failed");
            }
        );
    }
    else {
        alert("Error signing in");
    }
}//E N D  F U N C T I O N onLogin

//F U N C T I O N displayNote populates the textarea with the results of an ajax call based on the note's id.
function displayNote(index){
  //debugger;
  currentIndex = index;
  if(index < noteIds.length){
    $.ajax({
      url: `https://www.onenote.com/api/v1.0/me/notes/pages/${noteIds[index]}/content?preAuthenticated=true&includeIDs=true`,
      type: "GET",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
      success: function(data) {
        //$(".tinyMCEarea").html(data);
        var parser = new DOMParser();
        currentTitle = ($(data).filter("title").text() == null || $(data).filter("title").text() == "") ? "Untitled" : $(data).filter("title").text();
        var content = parser.parseFromString(data, "text/html").querySelector("body").innerHTML;
        $(".currentNoteTitle").text(currentTitle);//setting title
        tinyMCE.activeEditor.setContent(content);
        unsavedContent = "";
        originalContent = content;
      },
      error: function(){
        alert("Error retrieving note data");
        unsavedContent = "";
        originalContent = "";
      }
    });
  }
  else{
    currentTitle = unsavedTitles[index - noteIds.length];
    $(".currentNoteTitle").text(currentTitle);
    originalContent = "";
    //content = (unsavedContent == null || unsavedContent == "") ? "" : unsavedContent;
    tinyMCE.activeEditor.setContent((unsavedContent == null || unsavedContent == "") ? "" : unsavedContent);
  }
  //alert(currentIndex + "\n" + originalContent + "\n" + unsavedContent);
}//E N D  F U N C T I O N displayNote

//F U N C T I O N editNote
function editNote(){
  alert("edit button pressed");
}//E N D  F U N C T I O N editNote


function delNote(){$("#delete-dialog").dialog("open");}
//F U N C T I O N deleteNote
function deleteNote(){
  $.ajax({
      url: `https://www.onenote.com/api/v1.0/me/notes/pages/${noteIds[currentIndex]}/`,
      type: "DELETE",
      beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
      success: function(data) {
        onLogin(sess);
      },
      error: function(){
        alert("Error deleting Note");
      }
    });
}//E N D  F U N C T I O N deleteNote

//F U N C T I O N  saveNote
function saveNote(){
  if(currentIndex < noteIds.length){//if it's not a new note
    
    //UPDATING
    if(unsavedContent != originalContent){
      var updatedNote = formUpdateJSON();
      var url = 'https://www.onenote.com/api/v1.0/me/notes/pages/' + noteIds[currentIndex] + '/content';
      $.ajax({
        url: url,
        method: "PATCH",
        data: "[{"+
        "'target': '#_default',"+
        "'action': 'replace'," +
        "'content': '" + unsavedContent + "'"+
        "}]",
        contentType: "application/json",
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        //Accept: "application/json",
        success: function(data) { 
          alert("saved");
          onLogin(sess);
        },
        error: function(err){
          alert("failure to save changes");
          debugger;
        }
      }); 
    }
  }
  else{
    
    //ADDING
   if(unsavedContent != originalContent && unsavedContent != undefined){
      var createdNote = formNoteHTML();
      $.ajax({
        url: `https://www.onenote.com/api/v1.0/me/notes/pages`,
        type: "POST",
        data: createdNote,
        contentType: "application/xhtml+xml",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);},
        success: function(data) {
          $("#save-dialog").dialog("open");
          onLogin(sess);
        },
        error: function(){
          alert("failure to save new note");
        }
      }); 
    }
  } 
}//E N D  F U N C T I O N saveNote

function addaNote(){$("#add-dialog").dialog("open");}
//F U N C T I O N addNote
function addNote(){
  var noteTitle = $("#note-name").val();
  if(noteTitle != null && noteTitle != ""){
    var title = $(`<li class="note"><a href="javascript:displayNote(${noteIds.length} + ${unsavedTitles.length})">${noteTitle}</a></li>`);
    $(".note:first").before(title);
    unsavedTitles.push(noteTitle);
  }else{
    addNote()
  }
}//E N D  F U N C T I O N addNote

function formUpdateJSON(){
  return [{
    'target' : '#_default',
    'action' : 'replace',
    'content' : "<p>UnsavedContent</p>"
  }];
  //return JSON.stringify(updates);
}

function about(){
  $("#about-dialog").dialog("open");
}

function formNoteHTML(){
  var fart1 = currentIndex;
  var fart2 = noteIds;
  currentTitle = unsavedTitles[currentIndex - noteIds.length];
  return `<!DOCTYPE html>`                                                    +
          `<html>`                                                            +
            `<head>`                                                          +
              `<title>${currentTitle}</title>`                                +
              `<meta name='created' content='${new Date().toISOString()}'/>`  +
            `</head>`                                                         +
            `<body>`                                                          +
              `<div>`                                                         +
                `<p>${unsavedContent}</p>`                                    +
              `</div>`                                                        +
            `</body>`                                                         +
          `<html>`                                                            ;
}//E N D  F U N C T I O N  formNoteHTML

