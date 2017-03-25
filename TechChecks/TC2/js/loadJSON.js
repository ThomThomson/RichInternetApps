$( document ).ready(function() {
  $(".loadJSON").button();
  $("#accordion").accordion();
  $(".loadJSON").click( function( event ) {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      type: "GET",
      success: function(data) {
        $("#accordion").empty();
        var posts = [];
        $(data).each(function( index ) {
          posts.push(
            "<h3>" + data[index].title + "</h3>" +
            "<div>" +
              "<p>" + data[index].body + "</p>" +
            "</div>"
          );
        });
        $(posts).each(function(index){
          $("#accordion").append(posts[index]);
          $("#accordion").accordion("refresh");
        });
      },
      error: function(){
        alert("Error retrieving data");
      }
    });
  } );
});