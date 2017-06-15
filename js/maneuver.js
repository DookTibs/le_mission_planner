var maneuvers = [];

function Maneuver(difficulty, from, to) {
	this.difficulty = difficulty;
	this.from = from;
	this.to = to;
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

maneuvers.push(new Maneuver(8, "earth", "earth_orbit"));
maneuvers.push(new Maneuver(3, "earth", "earth_suborb"));
maneuvers.push(new Maneuver(0, "earth_suborb", "earth"));
maneuvers.push(new Maneuver(5, "earth_suborb", "earth_orbit"));
maneuvers.push(new Maneuver(0, "earth_orbit", "earth"));
maneuvers.push(new Maneuver(1, "earth_orbit", "lunar_flyby"));
maneuvers.push(new Maneuver(3, "earth_orbit", "lunar_orbit"));
maneuvers.push(new Maneuver(3, "lunar_orbit", "earth_orbit"));
maneuvers.push(new Maneuver(2, "lunar_orbit", "moon"));
maneuvers.push(new Maneuver(1, "lunar_flyby", "earth_orbit"));
maneuvers.push(new Maneuver(2, "lunar_flyby", "lunar_orbit"));
maneuvers.push(new Maneuver(4, "lunar_flyby", "moon"));
maneuvers.push(new Maneuver(2, "moon", "lunar_orbit"));
