//global variables
var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
//current show global variables
var dateTime = new Date();
var currentDay = dateTime.getUTCDay();
var currentMinutes;
var showNumbers = new Array();
var currentShow;

//startup code
window.onload = pageInit;
function $(id) { return document.getElementById(id); }

//LOGIC START
//XML load fucnction
function parseXML() 
{ 
xmlHttp = new window.XMLHttpRequest();
xmlHttp.open("GET","showList.xml",false);
xmlHttp.send(null);
xmlDoc = xmlHttp.responseXML.documentElement;
}
//main function
function pageInit()
{
	parseXML();
	var dayTag = xmlDoc.getElementsByTagName('day');
	generateCurrentTime();
	//adjusts day to eastern time from UTC
	if (currentMinutes > 1139)
	{
		currentDay--;
		if (currentDay < 0)
		{
			currentDay = 6;
		}
	}
	//gets list of all shows with matching date
	showNumbers = [];
	for (i=0; i<dayTag.length; i++)
	{
		if (dayTag[i].childNodes[0].nodeValue == dayArray[currentDay])
		{
			showNumbers.push(i)
		}
	}
	//compares times of all shows with correct day, tries to find the right show
	var startTimes = xmlDoc.getElementsByTagName('starttime');
	var endTimes = xmlDoc.getElementsByTagName('endtime');
	var isDefault = true;
	for (j=0; j<showNumbers.length; j++)
	{
		//checks to see if currentMinutes is a value within a show's start and end value
		if (currentMinutes >= startTimes[showNumbers[j]].childNodes[0].nodeValue && currentMinutes < endTimes[showNumbers[j]].childNodes[0].nodeValue )
		{
			isDefault = false;
			currentShow = showNumbers[j];

		}
	}
	//sets default case if true, matching show if false
	if (!isDefault)
	{
		setCurrent();
	}else{
		setDefault();
	}
}

//fetches current time and sets vars
function generateCurrentTime()
{
	dateTime = new Date();
	currentMinutes = dateTime.getUTCHours() * 60;
	currentMinutes += dateTime.getUTCMinutes();
	currentDay = dateTime.getUTCDay();
	currentMinutes -= 300;
	if (currentMinutes < 0)
	{
		currentMinutes = 1440 + currentMinutes;
	}
}

//sets Default show case in HTML
function setDefault(){
	$("showPic").setAttribute("src", xmlDoc.getElementsByTagName('dshowpic')[0].childNodes[0].nodeValue);
	$("showTitle").innerHTML = xmlDoc.getElementsByTagName('dtitle')[0].childNodes[0].nodeValue;
	$("djNames").innerHTML = xmlDoc.getElementsByTagName('ddjs')[0].childNodes[0].nodeValue;
	$("showTime").innerHTML = xmlDoc.getElementsByTagName('dshowtime')[0].childNodes[0].nodeValue;
	$("showinfo").innerHTML = xmlDoc.getElementsByTagName('dinfo')[0].childNodes[0].nodeValue;
}

//sets Current show in HTML
function setCurrent(){
	$("showPic").setAttribute("src", xmlDoc.getElementsByTagName('showpic')[currentShow].childNodes[0].nodeValue);
	$("showTitle").innerHTML = xmlDoc.getElementsByTagName('showtitle')[currentShow].childNodes[0].nodeValue;
	$("djNames").innerHTML = xmlDoc.getElementsByTagName('djs')[currentShow].childNodes[0].nodeValue;
	$("showTime").innerHTML = xmlDoc.getElementsByTagName('showtime')[currentShow].childNodes[0].nodeValue;
	$("showinfo").innerHTML = xmlDoc.getElementsByTagName('showinfo')[currentShow].childNodes[0].nodeValue;
}

//generates a schedule for the appropriate day
function generateCalendar(){
	$("calendarTitle").innerHTML = "Show Calendar for " + dayArray[currentDay];
	$("calendarList").innerHTML = "";
	var lastShowStart = 0;
	var startTimes = xmlDoc.getElementsByTagName('starttime');
	var endTimes = xmlDoc.getElementsByTagName('endtime');
	for (i=0; i<1440; i++)
	{
		for (j=0; j<showNumbers.length; j++)
		{
			if (endTimes[showNumbers[j]].childNodes[0].nodeValue == i)
			{
				$("calendarList").innerHTML += "<li>" + xmlDoc.getElementsByTagName('showtime')[showNumbers[j]].childNodes[0].nodeValue + " : " + xmlDoc.getElementsByTagName('showtitle')[showNumbers[j]].childNodes[0].nodeValue;
			}
		}
	}
}