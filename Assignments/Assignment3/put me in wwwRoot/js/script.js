//V A R I A B L E S
var notes = [];
var sess;

//L O G I N  S T U F F 
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

function displayNote(index){
  alert(notes[index]);
}

function fillNotes(listData){
    for (var i = 0; i < listData.value.length; i++) {
        var currentItem = listData.value[i];
        notes.push(currentItem.body);
        var title = $(`<li><a href="javascript:displayNote(${i})">${currentItem.title}</a></li>`);
        $(".notesList").append(title);
        debugger;
    }
//    if (activeNoteId != null){
//        activeItem = $(`[data-id="${activeNoteId}"]`);
//        $(activeItem).addClass(active);
//    }
}

//O N  L O G I N
function onLogin (session) {
    if (!session.error) {
        WL.api({
            path: "me",
            method: "GET"
        }).then(
            function (response) {//S U C C E S S F U L  L O G I N
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
                document.getElementById("info").innerText = "Error calling API: " + responseFailed.error.message;
            }
        );
    }
    else {
        document.getElementById("info").innerText = "Error signing in: " + session.error_description;
    }
}

