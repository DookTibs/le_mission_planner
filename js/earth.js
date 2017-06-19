var mission = {
	name: "Test Mission",
	notes: "hardcoded notes",
	legs: []
};

function loadMissionFromJSON(strData) {
	strData = '{"name":"Test Mission Foo","notes":"notes","legs":[{"maneuver":{"difficulty":8,"from":"earth","to":"earth_orbit"},"payloadItems":[{"payload":{"name":"Astronaut","mass":0},"amount":"1"},{"payload":{"name":"Capsule: Eagle","mass":1},"amount":"1"}]}]}';
	var obj = JSON.parse(strData);
	console.log(obj);
	mission.name = obj.name;
	mission.notes = obj.notes;

	mission.legs = [];
	for (var i = 0 ; i < obj.legs.length ; i++) {
		var l = obj.legs[i];
		console.log(l);
		console.log(l["maneuver"]);
		var maneuver = getManeuverByEndpoints(l["maneuver"]["from"] + ":" + l["maneuver"]["to"]);
		var leg = new ManeuverLeg(maneuver);

		for (var k = 0 ; k < l["payloadItems"].length ; k++) {
			var pi = l["payloadItems"][k];
			var payload = getPayloadByName(pi["payload"]["name"]);
			var amt = pi["amount"];
			leg.payloadItems.push({ amount: amt, payload: payload });
		}

		mission.legs.push(leg);
	}
}


function debugMission() {
	var output = "<h3>" + mission.name + "</h3>";
	output += "<h5>" + mission.legs.length + " leg" + (mission.legs.length == 1 ? "" : "s") + "</h5>";
	output += "<ul>";
	for (var i = 0 ; i < mission.legs.length ; i++) {
		var l = mission.legs[i];
		output += "<li>" + l.toString() + "</li>";
	}
	output += "</ul>";
	$("#debug").html(output);
}

function recalc(fromIndex) {
	debugMission();
	if (fromIndex == undefined) { fromIndex = 0; }

	for (var i = fromIndex ; i < mission.legs.length ; i++) {
		var targetRow = $("table.mission_planner tr.leg:eq(" + i + ")");
		var diffBox = targetRow.find("td div.difficulty");

		var l = mission.legs[i];
		if (l.maneuver != null) {
			diffBox.html(l.maneuver.difficulty);
		} else {
			diffBox.html("");
		}
	}
}

function setupPayloadDialog() {
	$("#payload_dialog").dialog({
		autoOpen: false,
		width: 400,
		height: 390,
		close: savePopupItems,
		modal: true
	});

	var holder = $("#payload_dialog .items");
	for (var i = 0 ; i < payloads.length ; i++) {
		console.log("looping");
		var p = payloads[i];
		var div = $("<div/>").addClass("payload_config popup_config").attr("data-itemname", p.name);

		var minus = $("<span/>").addClass("minus").appendTo(div);
		$("<button/>").text("-").appendTo(minus);

		$("<span/>").addClass("centered title").html(p.name).appendTo(div);

		var plus = $("<span/>").addClass("plus").appendTo(div);
		$("<button/>").text("+").appendTo(plus);

		div.appendTo(holder);
	}

	$("#payload_dialog button").click(addOrRemovePopupItem);
}

function savePopupItems() {
	var d = $(this);

	// TODO - work for more than payloads
	var itemsAndAmounts = [];
	for (var i = 0 ; i < payloads.length ; i++) {
		var item = payloads[i];
		var row = d.find("div.popup_config:eq(" + i + ")");
		var amt = row.attr("data-amount");

		if (amt > 0) {
			console.log("[" +i + "] [" + row.attr("data-itemname") + "] / [" + row.attr("data-amount") + "]");
			var combo = { payload: getPayloadByName(row.attr("data-itemname")), amount: amt };
			itemsAndAmounts.push(combo);
		}
	}

	var legIndex = 0; // TODO -dont hardcode leg index
	mission.legs[legIndex].payloadItems = itemsAndAmounts;
}

function addOrRemovePopupItem() {
	var clickedButton = $(this);

	var wrapperDiv = clickedButton.parents("div.popup_config");
	var idx = wrapperDiv.index();
	var change = clickedButton.parent().hasClass("minus") ? -1 : 1;

	wrapperDiv.attr("data-amount", Number(wrapperDiv.attr("data-amount")) + change);
	formatItemPopupRow(wrapperDiv);
}

var rowPrototype;
function setup() {
	rowPrototype = $("tr.leg").detach();

	setupPayloadDialog();

	var chartBuilder = new ChartBuilder();
	chartBuilder.renderCharts();

	// var l = new ManeuverLeg(null);
	// mission.legs.push(l);

	loadMissionFromJSON();

	setupRowsAndHandlers();
	// setupOriginBox();
	// $("a.payload_picker").html("None").click(editPayload);

	recalc();

	// editPayload();

	/*
	$("td.payload_mass input").change(function() {
		recalcForRow($(this).parents("tr"));
	});
	*/
}

function setupRowsAndHandlers() {
	var legTable = $("table.mission_planner");
	legTable.find("tr.leg").remove();
	$("table.mission_planner tr.leg").remove();
	for (var i = 0 ; i < mission.legs.length ; i++) {
		var leg = mission.legs[i];
		var row = rowPrototype.clone().appendTo(legTable);

		setupOriginBox(row.find("td.origin select"), leg.maneuver.from);

		console.log("ADSFFDSSDAFSDF");
		console.log(leg);

		// row.find("td.origin select").val(leg.maneuver.from);	
		// row.find("td.destination select").val(leg.maneuver.to);	
	}
}

function onOriginBoxChanged(changedBox) {
	// var changedBox = $(this);
	var changedRow = changedBox.parents("tr");
	var legIndex = changedRow.index() - 1;
	mission.legs[legIndex].maneuver = null;
	console.log("origin box changed [" + changedBox.val() + "]");

	if (changedBox.val() != -1) {
		var origin = getLocationById(changedBox.val());
		var possibleManeuvers = origin.findManeuversFrom();
		setPossibleDestinations(possibleManeuvers);
	} else {
		setPossibleDestinations([]);
	}

	recalc(legIndex);
}

function onDestinationBoxChanged() {
	var changedBox = $(this);
	var changedRow = changedBox.parents("tr");
	var legIndex = changedRow.index() - 1;

	if (changedBox.val() == "") {
		mission.legs[legIndex].maneuver = null;
	} else {
		var endpoints = changedRow.find("td.origin select").val() + ":" + changedBox.val();
		console.log(endpoints);
		mission.legs[legIndex].maneuver = getManeuverByEndpoints(endpoints);
	}

	recalc(legIndex);

	// recalcForRow(changedRow);
}

/*
function recalcForRow(r) {
	var diff = r.find("div.difficulty").html();
	var mass = r.find("td.payload_mass input").val();

	var requiredThrust = diff * mass;

	r.find("div.required_thrust").html(requiredThrust);
}
*/

function setupOriginBox(originBox, startVal) {
	console.log("setting maneuever with [" + startVal + "]");
	// var originBox = $("td.origin select");
	$("<option value='-1'></option>").appendTo(originBox);
	for (var i = 1 ; i < locations.length ; i++) { // start at 1 so we skip "Lost"
		var loc = locations[i];
		$("<option value='" + loc.id + "'" + (loc.id == startVal ? " selected" : "") + ">" + loc.name + "</option>").appendTo(originBox);
	}

	originBox.change(function() {
		onOriginBoxChanged($(this));
	});
	onOriginBoxChanged(originBox);
}

function setPossibleDestinations(possibilities) {
	var destinationBox = $("td.destination select").empty();
	$("<option value=''></option>").appendTo(destinationBox);
	for (var i = 0 ; i < possibilities.length ; i++) {
		var maneuver = possibilities[i];
		var toLoc = getLocationById(maneuver.to);
		$("<option value='" + maneuver.to + "'>" + toLoc.name + "</option>").appendTo(destinationBox);
	}

	destinationBox.change(onDestinationBoxChanged);
}

function editPayload() {
	var clickedLink = $(this);
	var changedRow = clickedLink.parents("tr");
	var legIndex = changedRow.index() - 1;

	$("#payload_dialog").dialog("open");
	
	for (var i = 0 ; i < payloads.length ; i++) {
		var amt = 0; // TODO - get a real payload amount
		var itemRow = $("#payload_dialog .items div:eq(" + i + ")");
		itemRow.attr("data-amount", amt);

		formatItemPopupRow(itemRow);
	}
}

function formatItemPopupRow(itemRow) {
	var amt = Number(itemRow.attr("data-amount"));
	var name = itemRow.attr("data-itemname");
	itemRow.find("span.minus button").attr("disabled", amt == 0);
	itemRow.find("span.title").html(name + (amt == 0 ? "" : " (" + amt + ")"));
}

$(document).ready(setup);
