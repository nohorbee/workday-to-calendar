#! /usr/bin/env node

function leapYear(year)
{
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

var fs = require('fs');
// var os = require('os')
// var EOL = os.EOL;
var EOL = "\r";  // Excel just use this character, regardless the OS

console.log('workday-to-calendar');

var userArgs = process.argv.slice(2);
var inputFile = userArgs[0];
var year = userArgs[1] || new Date().getFullYear();

var fileData = fs.readFileSync(inputFile, "utf8");

var lines = fileData.split(EOL).slice(1);

var timeOffStructure = {};

lines.forEach(function(line, index, arr) {
  var fields = line.split(",");
  if (fields[2]!='') {
    var date = new Date(fields[7]);
    timeOffStructure[fields[2]] = timeOffStructure[fields[2]] || {}
    timeOffStructure[fields[2]][date] = timeOffStructure[fields[2]][date] || 0;
    timeOffStructure[fields[2]][date] += (parseInt(fields[10]) ? parseInt(fields[10]) : 0);

    if (timeOffStructure[fields[2]][date] == 0) {
      delete timeOffStructure[fields[2]][date];
    }

    if (Object.keys(timeOffStructure[fields[2]]).length == 0) {
      delete timeOffStructure[fields[2]];
    }
  }
});
// console.log(timeOffStructure);




var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

if(leapYear(year)) {
  daysOfMonth[1] = 29;
}

var HTMLMonth = [];


months.forEach(function(month, index, arr) {

  HTMLMonth[index] = "<table style = 'border: 1px solid #000000'>";
  HTMLMonth[index] += "<th style = 'border: 1px solid #000000'>" + month;
  for (i=0; i<daysOfMonth[index]; i++) {
    HTMLMonth[index] += "<td style = 'border: 1px solid #000000' align='center'>";
    HTMLMonth[index] += (i+1);
    HTMLMonth[index] += "</td>";
  }

  HTMLMonth[index] += "</th>";
  for (var name in timeOffStructure) {
    HTMLMonth[index] += "<tr>";
    HTMLMonth[index] += "<td style = 'border: 1px solid #000000'>";
    HTMLMonth[index] += name;
    HTMLMonth[index] += "</td>";
    for (i=0; i<daysOfMonth[index]; i++) {

      var transversedDate = new Date(year, index, i+1);

      HTMLMonth[index] += "<td style = 'border: 1px solid #000000;' "+ (timeOffStructure[name][transversedDate] ? "bgcolor = 'yellow'" : "") +" align='center'>";

      // if (timeOffStructure[name][transversedDate]) {
      //   console.log (name + ": " + transversedDate + " " + timeOffStructure[name][transversedDate] + " days")
      // }

      HTMLMonth[index] += (timeOffStructure[name][transversedDate] ? timeOffStructure[name][transversedDate] : '&nbsp;');
      HTMLMonth[index] += "</td>";
    }
    HTMLMonth[index] += "</tr>";
  }
  HTMLMonth[index] += "</table><br />";

})


fs.writeFileSync("test.html", year + "<br /><br />" + HTMLMonth.join(''));



//console.log (HTMLMonth);
