var apiKey = "AIzaSyAxQDbF37B_LG03XnPxEpCWz9sTxMgsRl8";
var start;
var destination;
var directionsHTML = '';
var date;
var datebox;

function currentTime() {//F U N C T I O N currentTime sets the time on load of the page.
  date = new Date();
  var hours = date.getHours(); if (hours < 10) { hours = "0" + hours; } //the time box requires numbers less than 10 to be prefaced with a 0
  var minutes = date.getMinutes(); if(minutes < 10) { minutes = "0" + minutes; }
  var timeString = hours + ":" + minutes;
  datebox = document.getElementById("leaveTime");
  datebox.value = timeString;
}

function prepareTableRow(step){//F U N C T I O N prepareTableRow creates the html string out of the raw data.
  if(step.childNodes[1].innerHTML == "TRANSIT"){ var icon = "<i class='fa fa-bus'></i>" } else { var icon = "<i class='fa fa-male'></i>" }
  var direction = step.getElementsByTagName('html_instructions')[0].childNodes[0].nodeValue;
  var duration = step.getElementsByTagName('duration')[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
  var distance = step.getElementsByTagName('distance')[0].getElementsByTagName('text')[0].childNodes[0].nodeValue;
  return "<tr><td>" + icon + "</td><td>" + direction + "</td><td>" + distance + "</td><td>" + duration + "</td></tr>";
}

function loadData(xml) {//F U N C T I O N loadData is called by the xhttp object once it has correctly loaded
  directionsHTML = "";
  xml = xml.responseXML;
  if (xml === null) {alert('Invalid response from server.'); return; }
  var steps = xml.getElementsByTagName('step');
  if(steps.lentgh == 0) {alert('no directions found'); return;}
  for (step = 0; step < steps.length; step++) {
    directionsHTML += prepareTableRow(steps[step]) //M A K E a table row for each S T E P                      
  }
  directionsArea = document.getElementById('directionsTable');
  directionsArea.innerHTML = directionsHTML;
}

function populateDirections() {//F U N C T I O N populateDirections is called by the form button. It queries Google's API for the directions.
  start = document.getElementById("start").value;
  destination = document.getElementById("destination").value;
  var leaveTime = Math.floor((date.getTime() + ((datebox.value.split(':')[0] - date.getHours()) * 3600000) + ((datebox.value.split(':')[1] - date.getMinutes()) * 60000)) / 1000);
  var xmlLink = "https://maps.googleapis.com/maps/api/directions/xml?origin=" + start + "&destination=" + destination + "&mode=transit&arrival_time=" + leaveTime + "&key=" + apiKey;
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    if (this.status === 200) {loadData(this); }
  };
  xhttp.onerror = function (err) {
    alert("Error loading direction data" + err);
  };
  xhttp.open("GET", xmlLink, true);
  xhttp.send();
}