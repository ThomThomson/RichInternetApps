var editshown = false;
var selectedID;
var posts;

function Post(title, body, date) {
    this.title = title;
    this.body = body;
    this.date = date;
}


$(function(){//S t a r t u p  F u n c t i o n s
  populatePosts();
});//E N D  S t a r t u p  f u n c t i o n 

function createPost(id, title, body, date) {  
  var post = [`<div class="post-preview">`,
               `<h2 class="post-title">${title}</h2>`,
               `<p class="post-subtitle">${body}</p>`,           
               `<p class="post-meta">Posted at ${date}`,
               `<a href="javascript:edit(${id})" class="btn"><span class="glyphicon glyphicon-pencil"></span></a>`,
               `<a href="javascript:del(${id})" class="btn"><span class="glyphicon glyphicon-trash"></span></a></p>`,
             `</div>`,
            `<hr>`].join("\n")
  return post;
}//E N D function createPost

function populatePosts(e) {
  $("#spinner").toggleClass("hidden");
  $.getJSON("http://localhost:3000/posts", function(data) {
    posts = data;
    $("#postsHere").html("");
    $.each(posts, function(i, post) {
      var postTableRow = createPost(post.id, post.title, post.body, post.date);
      $("#postsHere").append(postTableRow);
    });
  });
  $("#spinner").toggleClass("hidden");
}//E N D  function populatePosts

function createDialog(title, text, options) {
  return $("<div class='dialog' title='" + title + "'><p>" + text + "</p></div>").dialog(options);
}

function edit(id){
  selectedID = id;
  $.getJSON("http://localhost:3000/posts/" + id, function(data) {
    post = data;
    $("#titleBox").val(post.title);
    $("#bodyArea").val(post.body);
  });  
  if(!editshown){slideEditPanel(!editshown);}
}

function del(id){
  var deleteButton = this;
  createDialog("Delete Note", "Are you sure you want to delete this post?", {
      buttons: {
          "Delete": function() {
            deletePost(id);
            $(this).dialog("close");
          },
          Cancel: function() {
            $(this).dialog("close");
          }
      }
  });
}

function deletePost(id){
  $("#spinner").toggleClass("hidden");
  $.ajax({
    url: `http://localhost:3000/posts/${id}`,
    type: 'delete',
    dataType: 'json'
  }).done(function() {
    populatePosts();
    //$(this).dialog("close");
  }).fail(function(data) {
    createDialog("Error", data.statusText, null);
    $(this).dialog("close");
  });
  $("#spinner").toggleClass("hidden");
}

function showAddPanel(){ 
  selectedID = null;
  if(!editshown){slideEditPanel(!editshown);}
  $("#titleBox").val("");
  $("#bodyArea").val("");
}

function cancelAddOrEdit(){
  selectedID = null;
  if(editshown){slideEditPanel(!editshown);}
  $("#titleBox").val("");
  $("#bodyArea").val("");
}

function submit(){
  if($("#titleBox").val() != "" && $("#bodyArea").val() != ""){
    $("#spinner").toggleClass("hidden");
    var date = formatDate(new Date());
    var post = new Post($("#titleBox").val(), $("#bodyArea").val(), date);
    if(selectedID == null){//N E W  post
      $.post("http://localhost:3000/posts", post, function() {
          populatePosts();
          slideEditPanel(false);
      }, "json").fail(function(data) {
          createDialog("Error", data.statusText, null);
      });
    }else{//E D I T  post
      $.ajax({
        url: `http://localhost:3000/posts/${selectedID}`,
        data: post,
        type: 'put',
        dataType: 'json'
      }).done(function() {
        populatePosts();
        slideEditPanel(false);
      }).fail(function(data) {
        createDialog("Error", data.statusText, null);
      });
    }
    $("#spinner").toggleClass("hidden");
  }else{
    createDialog("Error", "Title and Body are required fields", null);
  }
}

function slideEditPanel(flag){
  editshown = flag;
  //$("#formPanel").toggleClass("hidden");
  if(flag){ $("#postsHere").toggleClass("col-sm-offset-4"); $("#formPanel").fadeIn("slow"); }
  else{ $("#formPanel").fadeOut("slow", function(){$("#postsHere").toggleClass("col-sm-offset-4")}); }
}

function formatDate(date) {
        var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }