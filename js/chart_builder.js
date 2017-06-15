function ChartBuilder() {
	this.fractionLookups = {};

	this.renderCharts = function() {
		this.storeFractions();
		this.buildMaxRocketPayloadChart();
		this.buildMaxIonPayloadChart();
	}

	this.storeFractions = function() {
		for (var d = 2 ; d <= 9 ; d++) {
			for (var n = 1 ; n < d ; n++) {
				var result = "" + (n / d).toFixed(2);
				var dotPos = result.indexOf(".");
				var floatPart = result.substring(dotPos+1);

				if (!(floatPart in this.fractionLookups)) {
					this.fractionLookups[floatPart] = n + "&frasl;" + d;
				}
			}
		}
	};

	this.padName = function(n, amt) {
		return ("&nbsp;".repeat(amt)) + n + ("&nbsp;".repeat(amt));
	};

	this.buildMaxIonPayloadChart = function() {
		var maxDifficulty = 9;
		var maxYears = 8;
		var table = $("table.max_ion_payload_chart");
		// table.attr("border", 1);
		
		var ionThruster = new IonThruster();
		for (var diff = 1 ; diff <= maxDifficulty ; diff++) {
			if (diff == 1) {
				var headerRow = $("<tr/>");
				$("<td/>").attr("colspan", 2).appendTo(headerRow);
				$("<td/>").attr("colspan", maxYears).addClass("legend horiz").html("max payload mass: ion thrusters").appendTo(headerRow);
				headerRow.appendTo(table);

				headerRow = $("<tr/>");
				$("<td/>").attr("colspan", 2).appendTo(headerRow);
				for (var year = 1 ; year <= maxYears ; year++) {
					$("<td/>").html(this.padName(year + "&#8987;", 4)).addClass("bottom_bordered centered").appendTo(headerRow);
				}
				headerRow.appendTo(table);
			}

			var row = $("<tr/>");

			if (diff == 1) {
				$("<td/>").html("maneuver difficulty").addClass("legend vert").attr("rowspan", maxDifficulty).appendTo(row);
			}
			$("<td/>").html(diff).addClass("right_bordered").appendTo(row);

			for (var year = 1 ; year <= maxYears ; year++) {
				var maxPayload = ionThruster.calculateMaxPayload(diff, year);
				var cell = $("<td/>").addClass("centered").html(this.fractionate(maxPayload)).appendTo(row);
			}
			row.appendTo(table);
		}
	};

	this.buildMaxRocketPayloadChart = function() {
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
					$("<td/>").html(this.padName(rockets[i].name, 2)).addClass("bottom_bordered centered").appendTo(headerRow);
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
				var maxPayload = rocket.calculateMaxPayload(diff);
				var cell = $("<td/>").addClass("centered").html(this.fractionate(maxPayload)).appendTo(row);
			}
			row.appendTo(table);
		}
	};

	this.fractionate = function(num) {
		if (num <= 0) {
			return "";
		} else if (num % 1 !== 0) {
			var numAsString = "" + num.toFixed(2);
			var dotPos = numAsString.indexOf(".");
			var floatPart = numAsString.substring(dotPos+1);
			var wholePart = numAsString.substring(0, dotPos);

			var fraction = "&nbsp;" + this.fractionLookups[floatPart];

			return (wholePart === "0" ? "" : wholePart) + fraction;
		} else {
			return num;
		}
	}
}
