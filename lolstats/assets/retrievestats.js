// Javascript for my web app, known as LoL Stats.
// The API Key is specifically for my Riot Games developer account.
var apiKey = "92e69b56-f7b4-45fa-a92a-8a50891051b4";
var player = "";
var playerInfo, playerId, playerStats, playerMatchHistory, xmlhttp;

// Set defaults for Chart.js
Chart.defaults.global.responsive = true;

// For browser compatibility, sets xmlhttp variable to proper request object.
if(window.XMLHttpRequest){
	xmlhttp = new XMLHttpRequest();
} else {
	xmlhttp	= new ActiveXObject("Microsoft.XMLHTTP");
}

// Given the player (Summoner) name, returns basic info about the player.
function getPlayerInfo(playerName){
	xmlhttp.open("GET", "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + playerName + "?api_key=" + apiKey, false);
	xmlhttp.send();
	return JSON.parse(xmlhttp.responseText)[playerName];
}

// Given the player (Summoner) ID, returns a JSON string with stats for that player.
function getPlayerStats(playerId){
	xmlhttp.open("GET", "https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/" + playerId + "/summary?season=SEASON2015&api_key=" + apiKey, false);
	xmlhttp.send();
	return JSON.parse(xmlhttp.responseText).playerStatSummaries;
}

// Given the player (Summoner) ID, returns a JSON string with match history (15 games) for that player.
function getPlayerMatchHistory(playerId){
	xmlhttp.open("GET", "https://na.api.pvp.net/api/lol/na/v2.2/matchhistory/" + playerId + "/?api_key=" + apiKey, false);
	xmlhttp.send();
	return JSON.parse(xmlhttp.responseText);	
}

// Sets the values for variables and executes functions for showing player (Summoner) stats.
function displayStats(){
	// Get the player (Summoner) name from an input field. Spaces need to be removed for the xmlhttp GET method.
	player = document.getElementById("nameInput").value.replace(/ /g,"");
	playerInfo = getPlayerInfo(player);
	playerId = playerInfo.id;
	playerStats = getPlayerStats(playerId);
	displaySummName();
	showChart();
	showTable();
}

// Prints the player (Summoner) name above the displayed statistics.
function displaySummName(){
	$("#nameDisplay").empty();
	$("#nameDisplay").append("<h2>" + playerInfo.name + "</h2>");
}

// Shows chart that displays player (Summoner) stats.
function showChart(){
	// Bugs in the Chart.js library require the canvas to be removed and reinserted for new charts.
	$("#winChart").remove();
	$("#chartContainer").append('<canvas id="winChart" width="300" height="300">ERROR: Browser does not support canvas tags.</canvas>');
	
	// Variables for Chart.js
	var ctx = $("#winChart").get(0).getContext("2d");
	var data = [];
	
	// Variables to change the color of each chart section.
	var red = 60;
	var green = 100;
	var blue = 20;

	// For each queue type in the stats, creates a new section in the pie chart per index.
	for(var i = 0; i < playerStats.length; i++){	
		red = 60 + (10 * i);
		green = 100 - (5 * i);
		data.push(
			{
				value: playerStats[i].wins,
				color: "rgb(" + red + "," + green + "," + blue + ")",
				highlight: "rgb(" + red + "," + green + "," + blue + ")",
				label: playerStats[i].playerStatSummaryType
			}
		);
	}
	
	new Chart(ctx).Pie(data);
}

function showTable(){
	var statTable = "<tbody>";
	statTable += "<tr>";
	statTable += "<th>Queue Type</th>";
	statTable += "<th>Total Wins</th>";
	statTable += "<th>Total CS</th>";
	statTable += "<th>Total Kills</th>";
	statTable += "<th>Total Assists</th>";
	statTable += "<th>Total Turrets</th>";
	statTable += "</tr>";

	for(var i = 0; i < playerStats.length; i++){
		statTable += "<tr>";
		statTable += "<td>" + playerStats[i].playerStatSummaryType;
		statTable += "<td>" + playerStats[i].wins + "</td>";
		statTable += "<td>" + playerStats[i].aggregatedStats.totalMinionKills + "</td>";
		statTable += "<td>" + playerStats[i].aggregatedStats.totalChampionKills + "</td>";
		statTable += "<td>" + playerStats[i].aggregatedStats.totalAssists + "</td>";
		statTable += "<td>" + playerStats[i].aggregatedStats.totalTurretsKilled + "</td>";
		statTable += "</tr>";
	}
	statTable += "</tbody>";
	statTable = statTable.replace(/undefined/gi,"N/A");
	$("#statTable").empty();
	$("#statTable").append(statTable);
}

// Prevents the user from actually submitting form data by pressing enter. Runs the proper function(s) instead.
$(document).ready(function(){
	$("#nameInput").keydown(function(event){
		if(event.keyCode == 13){
			event.preventDefault();
			displayStats();
			return false;
		}

	});
});

// When the Search button is click, execute these functions.
$(document).ready(function(){
	$("#subButton").click(function(){
		displayStats();
	});
});

