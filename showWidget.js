//global variables
var dayArray = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
//current show global variables
var dateTime = new Date();
var currentDay = dateTime.getUTCDay();
var currentMinutes;
var showNumbers = new Array();
var currentShow;
var dayCutoff = 1139;

// DST check
// A free script from: www.mresoftware.com
function DST(){
	var today = new Date;
	var yr = today.getFullYear();
	var dst_start = new Date("March 14, "+yr+" 02:00:00"); // 2nd Sunday in March can't occur after the 14th 
	var dst_end = new Date("November 07, "+yr+" 02:00:00"); // 1st Sunday in November can't occur after the 7th
	var day = dst_start.getUTCDay(); // day of week of 14th
	dst_start.setDate(14-day); // Calculate 2nd Sunday in March of this year
	day = dst_end.getUTCDay(); // day of the week of 7th
	dst_end.setDate(7-day); // Calculate first Sunday in November of this year
	if (today >= dst_start && today < dst_end){ //does today fall inside of DST period?
		currentMinutes += 60;
		dayCutoff +=60;
	}else{
		currentMinutes += 0;
	}

}

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
	alert("Currentday_start:"+currentDay);



	parseXML();
	var dayTag = xmlDoc.getElementsByTagName('day');
	generateCurrentTime();
	alert("Current Minutes = " + currentMinutes);
	//adjusts day to eastern time from UTC
	if (currentMinutes > dayCutoff)
	{
		currentDay--;
		if (currentDay < 0)
		{
			currentDay = 6;
		}
	}
	alert("Current Day = " + currentDay);
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
		alert("Testing Shownumber: " + showNumbers[j] + "||ST:" + startTimes[showNumbers[j]].childNodes[0].nodeValue + "||ET:" + endTimes[showNumbers[j]].childNodes[0].nodeValue + "||CT:" + currentMinutes);
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
	alert("Currentday_gentime:"+currentDay);
	DST();
	alert("Currentday_gentime_postDST:"+currentDay);
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
	for (i=0; i<=1440; i++)
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