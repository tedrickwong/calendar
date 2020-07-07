var dt = new Date();
var currentMonth = dt.getMonth();
var currentYear = dt.getFullYear();

function getMonthName(month = -1, year = -1) 
{
	var months = new Array();
	months[0] = "January";
	months[1] = "February";
	months[2] = "March";
	months[3] = "April";
	months[4] = "May";
	months[5] = "June";
	months[6] = "July";
	months[7] = "August";
	months[8] = "September";
	months[9] = "October";
	months[10] = "November";
	months[11] = "December";

	var d = dt;
	if(month >= 0 && year >= 0)
	{
		d = new Date(year, month);
	}
	
	var month = months[d.getMonth()];
	return month;
}

function setMonthName(month = -1, year = -1)
{
	document.getElementById("month-name").innerHTML = getMonthName(month, year);
}

function setYearValue()
{
	document.getElementById("year-val").innerHTML = currentYear;
}

function setDates(month = -1, year = -1)
{
	var d = dt;
	if(month >= 0 && year >= 0)
	{
		d = new Date(year, month);
	}
	
	var first = new Date(d.getFullYear(), d.getMonth(), 1);
	var firstDay = first.getDay(); // # from 0-6 representing day of week
	
	var numDays = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
	var last =  new Date(d.getFullYear(), d.getMonth(), numDays);
	var lastDay = last.getDay(); // # from 0-6 representing day of week
	
	var calendarRows = "";
	var dow = firstDay;
	
	for(i = 0;i < numDays;i++)
	{
		if(i == 0)	// fill row for first day
		{
			if(firstDay != 0)
			{
				calendarRows += "<tr>";
				for(j = 0;j < firstDay;j++)
				{
					calendarRows += "<td></td>";
				}
			}
		}
		
		if(dow == 0)
		{
			calendarRows += "<tr>";
		}
		else if(dow > 6)
		{
			calendarRows += "</tr>";
			dow = 0;
		}
		
		calendarRows += "<td class='text-right'>" + (i + 1) + "</td>";
		dow += 1;
		
		
		if(i == numDays - 1)	// fill row for last day
		{
			if(lastDay != 6)
			{
				for(j = 6;j > lastDay;j--)
				{
					calendarRows += "<td></td>";
				}
				calendarRows += "</td>";
			}
		}
		
	}
	
	document.getElementById("calendar-body").innerHTML = calendarRows;
	
}

function nextMonth()
{
	if(currentMonth > 10)
	{
		currentMonth = -1;
		currentYear += 1;
	}
	currentMonth += 1;
	
	dt = new Date(currentYear,currentMonth);
	setMonthName();
	setYearValue();
	setDates();
}

function prevMonth()
{
	if(currentMonth < 1)
	{
		currentMonth = 12;
		currentYear -= 1;
	}
	currentMonth -= 1;
	
	dt = new Date(currentYear,currentMonth);
	setMonthName();
	setYearValue();
	setDates();
}


function init()
{
	setMonthName();
	setYearValue();
	setDates();
}

window.onload = function() 
{
	init();
};