$(document).ready( function() {
  $("#about-dialog").dialog();
  $("#about-dialog").dialog("close");
  
  $("#save-dialog").dialog();
  $("#save-dialog").dialog("close");
  
  $("#delete-dialog").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Delete Note": function() {
                deleteNote();
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    $("#delete-dialog").dialog("close");
  
  
    function checkName(name) {
        var listOfNotes = $(".note");
        for (var i = 0; i < listOfNotes.length; i++) {
          var fart = $(listOfNotes[i]).find("a").text();
            if ($(listOfNotes[i]).find("a").text() == name)
                return false;
        }
        return true;
      }

    $("#add-dialog").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Create Note": function() {
                if ($("#note-name").val().length > 0 && checkName($("#note-name").val())) {
                    addNote();
                  $(this).dialog("close");
                }
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function(event, ui) {
            $("#note-name").val("");
        }
    });
  
    $("#add-dialog").dialog("close");
});