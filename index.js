var dt = new Date();
var currentMonth = dt.getMonth();
var currentYear = dt.getFullYear();

function getMonthName(month = -1, year = -1) 
{
	var d = dt;
	if(month >= 0 && year >= 0)
	{
		d = new Date(year, month);
	}
	// starts at index 0
	var month = d.getMonth();
	return month;
}

function setMonthName(month = -1, year = -1)
{
	var id = "month-" + getMonthName(month, year);
	document.getElementById(id).selected = true;
}

function setYearValue()
{
	var i;
	var options;
	var start = currentYear-4;
	var end = currentYear+5;
	for(i = start; i < end; i++){
		if(currentYear == i){
			options += "<option value=\"" + i + "\" id=\"year-" +  i + "\" selected>" + i + "</option>";
		}
		else{
			options += "<option value=\"" + i + "\" id=\"year-" +  i + "\">" + i + "</option>";
		}
	}
	document.getElementById("year-menu").innerHTML = options;
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

function selectMonth()
{
	var monthOption = document.getElementById("month-menu"); 
	var value = monthOption.options[monthOption.selectedIndex].value;
	currentMonth = value;

	dt = new Date(currentYear,currentMonth);
	setMonthName();
	setYearValue();
	setDates();
}

function selectYear()
{
	var yearOption = document.getElementById("year-menu"); 
	var value = yearOption.options[yearOption.selectedIndex].value;
	currentYear = parseInt(value);

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