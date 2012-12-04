//global variables
var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
//current show global variables
var dateTime = new Date();
var currentDay = dateTime.getUTCDay();
var currentMinutes;
var showNumbers = new Array();
var currentShow;
//seek show global variables
var seekTime;
var seekNumber;

//startup code
window.onload = pageInit;
function $(id) { return document.getElementById(id); }
//document.getElementById("nextButton").onclick = seekForward;
//logic start
//xml loading script

function parseXML() 
{ 
xmlHttp = new window.XMLHttpRequest();
xmlHttp.open("GET","showList.xml",false);
xmlHttp.send(null);
xmlDoc = xmlHttp.responseXML.documentElement;
}

function pageInit()
{
	//alert("preInitLibary");
	parseXML();
	//alert("XML Loaded");
	var dayTag = xmlDoc.getElementsByTagName('day');
	generateCurrentTime();
	//alert('time generated');
	//adjusts day to eastern time from UTC
	if (currentMinutes > 1260)
	{
		currentDay--;
		if (currentDay < 0)
		{
			currentDay = 7;
		}
	}
	//alert("starting daytag loop");
	//gets list of all shows with matching date
	showNumbers = [];
	for (i=0; i<dayTag.length; i++)
	{
		//alert("Current day = " + dayArray[currentDay] + " Show Day = " + dayTag[i].childNodes[0].nodeValue);
		if (dayTag[i].childNodes[0].nodeValue == dayArray[currentDay])
		{
			//alert("Found Matching Day at i=" + i);
			showNumbers.push(i)
		}
	}
	//compares times of all shows with correct day, tries to find the right show
	var startTimes = xmlDoc.getElementsByTagName('starttime');
	var endTimes = xmlDoc.getElementsByTagName('endtime');
	var isDefault = true;
	//alert("Start: " + startTimes[showNumbers[0]].childNodes[0].nodeValue + "|End: " + endTimes[showNumbers[0]].childNodes[0].nodeValue + "|Current : " + currentMinutes);
	for (j=0; j<showNumbers.length; j++)
	{
		if (currentMinutes >= startTimes[showNumbers[j]].childNodes[0].nodeValue && currentMinutes < endTimes[showNumbers[j]].childNodes[0].nodeValue )
		{
			isDefault = false;
			currentShow = showNumbers[j];

		}
	}
	//sets default case if true
	if (!isDefault)
	{
		//alert('Setting Current');
		setCurrent();
	}else{
		//alert('Setting default');
		setDefault();
		//alert('Defaults Set');
	}
}

function generateCurrentTime()
{
	dateTime = new Date();
	currentMinutes = dateTime.getUTCHours() * 60;
	currentMinutes += dateTime.getUTCMinutes();
	currentMinutes -= 300;
}

function setDefault(){
	$("showPic").setAttribute("src", xmlDoc.getElementsByTagName('dshowpic')[0].childNodes[0].nodeValue);
	$("showTitle").innerHTML = xmlDoc.getElementsByTagName('dtitle')[0].childNodes[0].nodeValue;
	$("djNames").innerHTML = xmlDoc.getElementsByTagName('ddjs')[0].childNodes[0].nodeValue;
	$("showTime").innerHTML = xmlDoc.getElementsByTagName('dshowtime')[0].childNodes[0].nodeValue;
	$("showinfo").innerHTML = xmlDoc.getElementsByTagName('dinfo')[0].childNodes[0].nodeValue;
}

function setCurrent(){
	$("showPic").setAttribute("src", xmlDoc.getElementsByTagName('showpic')[currentShow].childNodes[0].nodeValue);
	$("showTitle").innerHTML = xmlDoc.getElementsByTagName('showtitle')[currentShow].childNodes[0].nodeValue;
	$("djNames").innerHTML = xmlDoc.getElementsByTagName('djs')[currentShow].childNodes[0].nodeValue;
	$("showTime").innerHTML = xmlDoc.getElementsByTagName('showtime')[currentShow].childNodes[0].nodeValue;
	$("showinfo").innerHTML = xmlDoc.getElementsByTagName('showinfo')[currentShow].childNodes[0].nodeValue;
}

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