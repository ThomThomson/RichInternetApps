var notes;
var sess;
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
                function onLogin (session) {
                    if (!session.error) {
                        sess = session;
//                        alert('xxx' + session.session.access_token);
                        $.ajax({
                           url: "https://www.onenote.com/api/v1.0/me/notes/pages",
                           type: "GET",
                           beforeSend: function(xhr){
                                xhr.setRequestHeader('Authorization','Bearer ' + session.session.access_token);
                                //xhr.responseText("Title", "New OneNote");
                               
                           },
                           success: function(data){
                           showElements();
                           var list = $('#Notes');
                           if(data.value != null){
                               notes = data;
                               console.log(data.value[0].body);
                               console.log(data.value[0].title);
                                $("#Body").val(data.value[0].body);
                                $("#NoteTitle").val(data.value[0].title);
                                for(var i = 0; i < data.value.length; i++){
                                    //console.log(data.value[i]);
                                    list.append('<li id="wellnote' + i + '" class = "well well-sm"><a id = "note' + i + '" onclick="displayNote('+i+')">' + data.value[i].title + "</a></li>");
                                    
                                    }//end for
                                }//end if
                            },
                            error: function(response) {
                                alert(response.status + " " + response.statusText);
                                console.log(response.statusText);
                                console.log(response);
                                console.log(response.status + " " + response.statusText);
                            }
                        });
                        WL.api({
                            path: "me",
                            method: "GET"
                        }).then(
                            function (response, session) {
//                                  debugger;
//                                  var access_token = WL.getLastAccessToken();
                                  console.log("Logged In.");
//                                document.getElementById("info").innerText =
//                                    "Hello, " + response.first_name + " " + response.last_name + "!";
                                  
                                  //$("#signin").setAttribute("onclick", "reload()");
                            },
                            function (responseFailed) {
                               alert("Error calling API: " + responseFailed.error.message);
                            }
                        );
                    }
                    else {
                            alert("Error signing in: " + session.error_description);
                    }
                }