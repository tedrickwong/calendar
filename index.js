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
	
	htmlString += "<td class='text-right'>";
	
	htmlString += "<strong>"+(day + 1)+"</strong>";
	
	htmlString += "</td>";
	
	return htmlString;
}

function addWeather(data)
{
	
	var weather = data;
	var len = Object.keys(weather).length;
	var days = document.getElementsByTagName("td");
	
	for(v = 0;v < days.length;v++)
	{
		if(days[v].classList.contains("text-right"))
		{
			var newnode;
			var newnode2;
			var temp = null;
			var tempColor = "";
			
			for(k in weather)
			{
				if(weather[k][0] == currentYear && weather[k][1] == currentMonth && weather[k][2] == days[v].firstChild.innerHTML)
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
			
			if(tempColor)
			{
				if(window.outerWidth >= 450)
				{
					newnode = document.createElement("span");
					newnode.setAttribute("style","float:left");
					newnode.setAttribute("class","badge badge-pill badge-"+tempColor);
					newnode.innerHTML = temp;
					
					newnode2 = document.createElement("div");
					newnode2.setAttribute("class","progress");
					newnode2.setAttribute("style","height:5px;display:none;");
					newnode2.innerHTML = "<div class='progress-bar bg-"+ tempColor +"' role='progressbar' style='width: 100%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div>";					
				}
				else
				{				
					newnode = document.createElement("div");
					newnode.setAttribute("class","progress");
					newnode.setAttribute("style","height:5px;");
					newnode.innerHTML = "<div class='progress-bar bg-"+ tempColor +"' role='progressbar' style='width: 100%;' aria-valuenow='25' aria-valuemin='0' aria-valuemax='100'></div>";
					
					newnode2 = document.createElement("span");
					newnode2.setAttribute("style","float:left;display:none;");
					newnode2.setAttribute("class","badge badge-pill badge-"+tempColor);
					newnode2.innerHTML = temp;					
				}
				days[v].insertBefore(newnode, days[v].firstChild);
				days[v].insertBefore(newnode2, days[v].firstChild);
			}
			
			
		}
	}
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
	getTemp();
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
	getTemp();
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
	var forecastData;
	var weatherData = {};

	try
	{
		var request = new XMLHttpRequest();
		var requestURL = "https://api.weather.gov/points/"+latitude.toString()+","+longitude.toString();
		request.open('GET', requestURL,true);
		request.responseType = 'json';
		request.send();
		
		request.onload = function()
		{
			var forecastURL = request.response.properties.forecast;
			
			request.open('GET', forecastURL);
			request.responseType = 'json';
			request.send();
			
			request.onload = async function()
			{
				if(request.readyState == 4)
				{
					if(request.status == 200)
					{
						weatherData = parseTemp(request);
						addWeather(weatherData);
					}
				}
				
			}
		}
	}
	catch(err)
	{
		console.log(err.message);
	}
}

function parseTemp(rqst)
{
	var data = {};
	var request = rqst;
	
	forecastData = request.response;
				
	var weekForecast = forecastData.properties;
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	
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
			data[day] = [y,m,d,temp];
		}	
	}
	return data;
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
	getTemp();
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
	getTemp();
}

function init()
{
	handleSession();
	setMonthName();
	setYearValue();
	requestLocation();
	setDates();
	getTemp();
}

function handleSession()
{
	sessionStorage.SessionName = "SessionData";
}

window.onload = function() 
{
	init();
};