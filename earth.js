var fractionLookups = {};

var locations = [
	{ id: "lost", name: "Lost" },
	{ id: "earth", name: "Earth" },
	{ id: "earth_orbit", name: "Earth Orbit" },
	{ id: "lunar_flyby", name: "Lunar Fly-By" },
	{ id: "lunar_orbit", name: "Lunar Orbit" },
	{ id: "moon", name: "Moon" },
	{ id: "earth_suborb", name: "Suborbital Flight" }
];

var maneuvers = [
	{ difficulty: 8, from: "earth", to: "earth_orbit" },
	{ difficulty: 3, from: "earth", to: "earth_suborb" },
	{ difficulty: 0, from: "earth_suborb", to: "earth" },
	{ difficulty: 5, from: "earth_suborb", to: "earth_orbit" },
	{ difficulty: 0, from: "earth_orbit", to: "earth" },
	{ difficulty: 1, from: "earth_orbit", to: "lunar_flyby" },
	{ difficulty: 3, from: "earth_orbit", to: "lunar_orbit" },
	{ difficulty: 3, from: "lunar_orbit", to: "earth_orbit" },
	{ difficulty: 2, from: "lunar_orbit", to: "moon" },
	{ difficulty: 1, from: "lunar_flyby", to: "earth_orbit" },
	{ difficulty: 2, from: "lunar_flyby", to: "lunar_orbit" },
	{ difficulty: 4, from: "lunar_flyby", to: "moon" },
	{ difficulty: 2, from: "moon", to: "lunar_orbit" },
	/*
	{ name: "Lunar Descent", difficulty: 2 },
	{ name: "Lunar Transfer", difficulty: 3 },
	{ name: "To Orbit", difficulty: 5 },
	{ name: "Launch", difficulty: 3 },
		*/
];

var rockets = [
	{ name: "Juno", thrust: 4, mass: 1 },
	{ name: "Atlas", thrust: 27, mass: 4 },
	{ name: "Soyuz", thrust: 80, mass: 9 },
	{ name: "Saturn", thrust: 200, mass: 20 },
];

function padName(n, amt) {
	return ("&nbsp;".repeat(amt)) + n + ("&nbsp;".repeat(amt));
}

function getLocationById(locId) {
	for (var i = 0 ; i < locations.length ; i++) {
		if (locations[i].id == locId) {
			return locations[i];
		}
	}
	return null;
}

function getManeuverByEndpoints(endpoints) {
	var chunks = endpoints.split(":");
	var from = chunks[0];
	var to = chunks[1];

	for (var i = 0 ; i < maneuvers.length ; i++) {
		if (maneuvers[i].from == from && maneuvers[i].to == to) {
			return maneuvers[i];
		}
	}
	return null;
}

function calculateMaxIonPayload(diff, year) {
	var ionMass = 1;
	var ionThrustPerYear = 5;
	return ((ionThrustPerYear * year) - (diff * ionMass)) / diff;
}

function calculateMaxRocketPayload(diff, rocket) {
	var rocketMass = rocket.mass;
	var rocketThrust = rocket.thrust;
	var consumed = diff * rocketMass;
	var remainder = rocketThrust - consumed;

	return remainder / diff;
}

function buildMaxIonPayloadChart() {
	var maxDifficulty = 9;
	var maxYears = 8;
	var table = $("table.max_ion_payload_chart");
	// table.attr("border", 1);
	for (var diff = 1 ; diff <= maxDifficulty ; diff++) {
		if (diff == 1) {
			var headerRow = $("<tr/>");
			$("<td/>").attr("colspan", 2).appendTo(headerRow);
			$("<td/>").attr("colspan", maxYears).addClass("legend horiz").html("max payload mass: ion thrusters").appendTo(headerRow);
			headerRow.appendTo(table);

			headerRow = $("<tr/>");
			$("<td/>").attr("colspan", 2).appendTo(headerRow);
			for (var year = 1 ; year <= maxYears ; year++) {
				$("<td/>").html(padName(year + "&#8987;", 4)).addClass("bottom_bordered centered").appendTo(headerRow);
			}
			headerRow.appendTo(table);
		}

		var row = $("<tr/>");

		if (diff == 1) {
			$("<td/>").html("maneuver difficulty").addClass("legend vert").attr("rowspan", maxDifficulty).appendTo(row);
		}
		$("<td/>").html(diff).addClass("right_bordered").appendTo(row);

		for (var year = 1 ; year <= maxYears ; year++) {
			var maxPayload = calculateMaxIonPayload(diff, year);
			var cell = $("<td/>").addClass("centered").html(fractionate(maxPayload)).appendTo(row);
		}
		row.appendTo(table);
	}
}

function buildMaxRocketPayloadChart() {
	var maxDifficulty = 9;
	var table = $("table.max_rocket_payload_chart");
	//table.attr("border", 1);
	for (var diff = 1 ; diff <= maxDifficulty ; diff++) {
		if (diff == 1) {
			var headerRow = $("<tr/>");
			$("<td/>").attr("colspan", 2).appendTo(headerRow);
			$("<td/>").attr("colspan", rockets.length).addClass("legend horiz").html("max payload mass: rockets").appendTo(headerRow);
			headerRow.appendTo(table);

			headerRow = $("<tr/>");
			$("<td/>").attr("colspan", 2).appendTo(headerRow);
			for (var i = 0 ; i < rockets.length ; i++) {
				$("<td/>").html(padName(rockets[i].name, 2)).addClass("bottom_bordered centered").appendTo(headerRow);
			}
			headerRow.appendTo(table);
		}

		var row = $("<tr/>");

		if (diff == 1) {
			$("<td/>").html("maneuver difficulty").addClass("legend vert").attr("rowspan", maxDifficulty).appendTo(row);
		}
		$("<td/>").html(diff).addClass("right_bordered").appendTo(row);

		for (var i = 0 ; i < rockets.length ; i++) {
			var rocket = rockets[i];
			var maxPayload = calculateMaxRocketPayload(diff, rocket);
			var cell = $("<td/>").addClass("centered").html(fractionate(maxPayload)).appendTo(row);
		}
		row.appendTo(table);
	}
}

function storeFractions() {
	for (var d = 2 ; d <= 9 ; d++) {
		for (var n = 1 ; n < d ; n++) {
			var result = "" + (n / d).toFixed(2);
			var dotPos = result.indexOf(".");
			var floatPart = result.substring(dotPos+1);

			if (!(floatPart in fractionLookups)) {
				fractionLookups[floatPart] = n + "&frasl;" + d;
			}
		}
	}
}

function fractionate(num) {
	if (num <= 0) {
		return "";
	} else if (num % 1 !== 0) {
		var numAsString = "" + num.toFixed(2);
		var dotPos = numAsString.indexOf(".");
		var floatPart = numAsString.substring(dotPos+1);
		var wholePart = numAsString.substring(0, dotPos);

		var fraction = "&nbsp;" + fractionLookups[floatPart];

		return (wholePart === "0" ? "" : wholePart) + fraction;
	} else {
		return num;
	}
}

function setup() {
	storeFractions();
	buildMaxRocketPayloadChart();
	buildMaxIonPayloadChart();

	setupDestinationBox();

	$("td.payload_mass input").change(function() {
		recalcForRow($(this).parents("tr"));
	});
}

function findManeuversToReach(loc) {
	console.log("user wants to go to [" + loc.name + "]...");
	var rv = [];
	for (var i = 0 ; i < maneuvers.length ; i++) {
		if (maneuvers[i].to == loc.id) {
			rv.push(maneuvers[i]);
		}
	}
	console.log(rv);
	return rv;
}

function onDestinationBoxChanged() {
	var changedBox = $(this);
	var changedRow = changedBox.parents("tr");


	if (changedBox.val() != -1) {
		var destination = locations[changedBox.val()];

		var possibleManeuvers = findManeuversToReach(destination);
		setPossibleManeuvers(possibleManeuvers);
	} else {
		setPossibleManeuvers([]);
	}

}

function onManeuverBoxChanged() {
	var changedBox = $(this);
	var changedRow = changedBox.parents("tr");
	var diffBox = changedRow.find("td div.difficulty");

	if (changedBox.val() == "") {
		diffBox.html("");
	} else {
		// var selectedManeuver = maneuvers[changedBox.val()];
		// diffBox.html(selectedManeuver.difficulty);
		var maneuver = getManeuverByEndpoints(changedBox.val());
		diffBox.html(maneuver.difficulty);
	}

	recalcForRow(changedRow);
}

function recalcForRow(r) {
	var diff = r.find("div.difficulty").html();
	var mass = r.find("td.payload_mass input").val();

	var requiredThrust = diff * mass;

	r.find("div.required_thrust").html(requiredThrust);
}

function setupDestinationBox() {
	var destBox = $("td.destination select");
	$("<option value='-1'></option>").appendTo(destBox);
	for (var i = 1 ; i < locations.length ; i++) { // start at 1 so we skip "Lost"
		var loc = locations[i];
		$("<option value='" + i + "'>" + loc.name + "</option>").appendTo(destBox);
	}

	destBox.change(onDestinationBoxChanged);
}

function setPossibleManeuvers(possibilities) {
	var maneuverBox = $("td.maneuver select").empty();
	$("<option value=''></option>").appendTo(maneuverBox);
	for (var i = 0 ; i < possibilities.length ; i++) {
		var maneuver = possibilities[i];
		var fromLoc = getLocationById(maneuver.from);
		$("<option value='" + maneuver.from + ":" + maneuver.to + "'>" + fromLoc.name + "</option>").appendTo(maneuverBox);
	}

	maneuverBox.change(onManeuverBoxChanged);
}

$(document).ready(setup);
