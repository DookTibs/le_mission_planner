function ManeuverLeg(m) {
	this.maneuver = m;
	this.payloadItems = [];

	this.toString = function() {
		if (this.maneuver == null) {
			return "not configured";
		} else {
			return this.maneuver.toString();
		}
	}
}
