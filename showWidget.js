window.onload = pageInit;

function parseXML() 
{ 
xmlHttp = new window.XMLHttpRequest();
xmlHttp.open("GET","showList.xml",false);
xmlHttp.send(null);
xmlDoc = xmlHttp.responseXML.documentElement;
}

function pageInit()
{
	alert("preInitLibary");
	parseXML();
	alert("XML Loaded");
	var dayTag = xmlDoc.getElementsByTagName('day')[0];
	var dayValues = dayTag.childNodes[0];
    var text = dayValues.nodeValue;
	alert("The day value is " + text);
}