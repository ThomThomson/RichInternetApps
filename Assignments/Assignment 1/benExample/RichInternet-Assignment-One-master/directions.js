var g_html;
var origin;
var destination;
function displaydirections() {
    origin = document.getElementById("origin");
    destination = document.getElementById("destination");
    
    // Validation
    if (!origin.checkValidity()) {
       alert("ERROR: Origin Field") 
        return;
    }
    if (!destination.checkValidity()) {
        alert("ERROR: Destination Field")
        return;
    }
    origin = origin.value;
    destination = destination.value;
    var xhttp = new XMLHttpRequest();
    xhttp.onloadstart = function() {
        spinner.style.display = "block";
    }
    xhttp.onload = function() {
        if (this.status == 200) {
            loadData(this);
        }
    };
    xhttp.onerror = function(err) {
        alert("Error loading direction data" + err);
    }
    xhttp.onloadend = function() {
        spinner.style.display = "none";
    }
    var porigin = document.getElementById('origindiv');
    var pdestination = document.getElementById('destinationdiv');
    porigin.innerHTML = "<div class= 'well well-sm'>" + "Leave " + origin + "</div>";
    pdestination.innerHTML = "<div class= 'well well-sm'>" + "Arrive at " +  destination + "</div>";
    // Could display progress bar as data is loading.
    var yql = "https://maps.googleapis.com/maps/api/directions/xml?origin=" + origin +
        "&destination=" + destination + "&key=AIzaSyAQLrqyOK42M1juBuy9SY4DUVPdqnlVeEA";
    xhttp.open("GET", yql, true);
    xhttp.send();
}

function loadData(response) {
    var xmlDoc = response.responseXML;
    if (xmlDoc == null) {
        alert('Invalid response from server.');
        return;
    }
    var directions = xmlDoc.getElementsByTagName("step");
    if (directions.length == 0) {
        alert("No Direction Data.");
    }
    for (var i = 0; i < directions.length; i++) {
        var direc = directions[i];
       
        if (direc != null) {
            displayDirections(direc, i, directions.length);
        }
    }

}

function displayDirections(direc, num, maxnum) {
    var panel = document.getElementById("directions");
    //Directions
    var directions = direc.getElementsByTagName("html_instructions")[0];
    var nodeD = directions.childNodes[0];
    //Distance
    var distance = direc.getElementsByTagName("distance")[0];
    var distsub = distance.getElementsByTagName("text")[0];
    var nodeDist = distsub.childNodes[0];
    //Duration
    var duration = direc.getElementsByTagName("duration")[0];
    var dursub = duration.getElementsByTagName("text")[0];
    var nodeDur = dursub.childNodes[0];
    if(g_html == null){
        g_html = "<div class='well' id='step"+num+"'> " + nodeD.nodeValue +" "  +
    nodeDist.nodeValue  + " or " + nodeDur.nodeValue +  "</div>";
    }else{
        g_html += "<div class='well' id='step"+num+"'> " + nodeD.nodeValue +" "  +
    nodeDist.nodeValue  + " or " + nodeDur.nodeValue +  "</div>";
    }
    
    panel.innerHTML = g_html;
}