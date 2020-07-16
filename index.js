var dt = new Date();
var currentMonth = dt.getMonth();
var currentYear = dt.getFullYear();
var latitude;
var longitude;
window.addEventListener("resize", tempDisplay);

/* Calendar Data Functions */

function getMonthName() 
{
	var d = dt;
	// starts at index 0
	var month = d.getMonth();
	return month;
}

function setMonthName()
{
	var id = "month-" + getMonthName(currentMonth, currentYear);
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

function setDates()
{
	var d = dt;
	
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
		
		calendarRows += configDateBox(i);
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

function configDateBox(day = -1)
{
	var htmlString = "";
	var tempColor = "";
	
	htmlString += "<td class='text-right'>";
	
	if( sessionStorage.getItem("location-accepted") != "false" )
	{
		var weather = getTemp();
		
		if(weather != null)
		{
			var temp = null;
			var len = Object.keys(weather).length;
			
			for(k in weather)
			{
				if(weather[k][0] == currentYear && weather[k][1] == currentMonth && weather[k][2] == day)
				{
					temp = parseInt(weather[k][3]);
					break;
				}
			}
			
			switch(true)
			{
				case (temp >= 90):
					tempColor = "danger";
					break;
				case (temp < 90 && temp > 78):
					tempColor = "warning";
					break;
				case (temp < 58 && temp != null):
					tempColor = "info";
					break;
				default:
					break;
			}
		}
	}
	
	
	
	if(tempColor)
	{
		if(window.outerWidth >= 450)
		{
			htmlString += "<span style='float:left;' class='badge badge-pill badge-"+tempColor+"'>"+temp+"</span>";
			htmlString += "<div class='progress' style='height:5px;display:none;'> \
						  <div class='progress-bar bg-"+ tempColor +"' role='progressbar' style='width: 100%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div> \
						</div>";
		}
		else
		{
			htmlString += "<div class='progress' style='height: 5px;'> \
						  <div class='progress-bar bg-"+ tempColor +"' role='progressbar' style='width: 100%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div> \
						</div>";
			htmlString += "<span style='float:left;display:none;' class='badge badge-pill badge-"+tempColor+"'>"+temp+"</span>";
		}
		
		
	}
	htmlString += "<strong>"+(day + 1)+"</strong>";
	
	htmlString += "</td>";
	
	return htmlString;
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

/* Location Functions */
function locSuccess(position)
{
	sessionStorage.setItem("location-accepted","true");
	latitude = position.coords.latitude.toFixed(4);
	longitude = position.coords.longitude.toFixed(4);
	sessionStorage.setItem("latitude",latitude);
	sessionStorage.setItem("longitude",longitude);
}

function locError(error)
{
	sessionStorage.setItem("location-accepted","false");
	latitude = null;
	longitude = null;
	sessionStorage.setItem("latitude",latitude);
	sessionStorage.setItem("longitude",longitude);
}

function requestLocation()
{
	/* No location data */
	if(sessionStorage.getItem("location-accepted") == null || sessionStorage.getItem("location-accepted") == "false")
	{
		navigator.geolocation.getCurrentPosition(locSuccess, locError);
	}
	else	/* location data exists and permission previously given */
	{
		latitude = sessionStorage.getItem("latitude");
		longitude = sessionStorage.getItem("longitude");
	}
	
}

/* Weather API Functions */
function getTemp()
{
	// makes weather api call, creates and returns JSON object with relevant data
	
	var jsonData;

	try
	{
		var request = new XMLHttpRequest();
		var requestURL = "https://api.weather.gov/points/"+latitude.toString()+","+longitude.toString();
		request.open('GET', requestURL);
		request.responseType = 'json';
		request.send();
		
		request.onload = function()
		{
			jsonData = request.response;
		}
		
		var forecastData;
		
		var request2 = new XMLHttpRequest();
		var forecastURL = jsonData.properties.forecast;
		request2.open('GET', forecastURL);
		request2.responseType = 'json';
		request2.send();
		
		request2.onload = function()
		{
			forecastData = request2.response;
		}
		
		var weekForecast = forecastData.properties;
		var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var weatherData = {};
		
		for (w in weekForecast.periods)
		{
			var day = weekForecast.periods[w].name;
			var isDay = days.includes(weekForecast.periods[w].name);
			var ST = new Date(weekForecast.periods[w].startTime);
			var d = ST.getUTCDate();
			var m = ST.getUTCMonth();
			var y = ST.getUTCFullYear();
			
			if(isDay)
			{
				var temp = weekForecast.periods[w].temperature;
				weatherData[day] = [y,m,d,temp];
			}	
		}
		return weatherData;	
	}
	catch(err)
	{
		console.log(err.message);
	}
	return null;
}


function tempDisplay()
{
	/* event listener function for window resize */
	var badgeTemps = document.getElementsByClassName("badge");
	var barTemps = document.getElementsByClassName("progress");
	
	for(b1 = 0;b1 < badgeTemps.length;b1++)
	{
		if(window.outerWidth < 450)
		{
			badgeTemps[b1].style.display = "none";
			barTemps[b1].style.display = "flex";
		}
		else
		{
			badgeTemps[b1].style.display = "inline-block";
			barTemps[b1].style.display = "none";
		}
	}
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
	requestLocation();
	setDates();
}

function handleSession()
{
	sessionStorage.SessionName = "SessionData";
}

window.onload = function() 
{
	init();
	handleSession();
};