function setup() {
	var chartBuilder = new ChartBuilder();
	chartBuilder.renderCharts();

	setupDestinationBox();

	$("td.payload_mass input").change(function() {
		recalcForRow($(this).parents("tr"));
	});
}

function onDestinationBoxChanged() {
	var changedBox = $(this);
	var changedRow = changedBox.parents("tr");


	if (changedBox.val() != -1) {
		var destination = locations[changedBox.val()];
		console.log("+++");
		console.log(destination);

		var possibleManeuvers = destination.findManeuversThatReach();
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
