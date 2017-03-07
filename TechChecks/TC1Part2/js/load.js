function loadDoc() {
      var searchTerm = document.getElementById("searchTerm").value;
      //var searchTerm = $("#searchTerm");
      if (searchTerm == null || searchTerm == "") {
        alert("Please enter a search term.");
        return;
      }
      
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          loadTable(this);
        }
      };
      
      //select * from blackcountryhistory.search where q="house";
      var yql = "https://query.yahooapis.com/v1/public/yql?q=" +
            "select%20*%20from%20blackcountryhistory.search%20" +
            "where%20q%20in%20(%22" + searchTerm + "%22)" +
            "&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
//      
      xhttp.open("GET", yql, true);
      xhttp.onloadstart = function () { $("#results_body").html("<i class='fa fa-circle-o-notch fa-spin' style='font-size:50px;text-align:center'></i>"); }
      xhttp.send();
  
//      $.ajax({
//        url: yql,
//        type: "GET",
//        beforeSend: function () { $("#results_body").html("<i class='fa fa-circle-o-notch fa-spin' style='font-size:50px;text-align:center'></i>"); },
//        success: loadTable(response),
//        error: function(response) {
//            alert(response.status + " " + response.statusText);
//            console.log(response.statusText);
//            console.log(response);
//            console.log(response.status + " " + response.statusText);
//        }
//      });
      //$.get(yql, loadTable())
    }

    function loadTable(response) {
      $("#results_body").html('');
      var i;
      var xmlDoc = response.responseXML;
      var tableBody="";
      var results = xmlDoc.getElementsByTagName("item");
      for (i = 0; i <results.length; i++) {
        //debugger
        var node = results[i];
        var title = getNodeContent(node, "title");
        var description =  getNodeContent(node, "description");
        tableBody += "<tr>";
        tableBody += "<td>" + title + "</td>";
        tableBody += "<td>" + description + "</td>";
        tableBody += "</tr>";
      }
      //document.getElementById("results_body").innerHTML = tableBody;
      $("#results_body").append(tableBody);
    }

    function getNodeContent(node, tagName) {
      var content = "";
      var elements = node.getElementsByTagName(tagName);
      if (elements.length == 1) {
        var element = elements[0];
        if (element.childNodes.length == 1) {
          var childNode = element.childNodes[0];
          return childNode.nodeValue;
        }
      }
      return content;
    }