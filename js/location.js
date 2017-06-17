var locations = [];

function Location(id, name) {
	this.id = id;
	this.name = name;

	this.findManeuversThatReach = function() {
		console.log("mission planner wants to go to [" + this.name + "]...");
		var rv = [];
		for (var i = 0 ; i < maneuvers.length ; i++) {
			if (maneuvers[i].to == this.id) {
				rv.push(maneuvers[i]);
			}
		}
		console.log(rv);
		return rv;
	}

	this.findManeuversFrom = function() {
		console.log("mission planner wants to go from [" + this.name + "]...");
		var rv = [];
		for (var i = 0 ; i < maneuvers.length ; i++) {
			if (maneuvers[i].from == this.id) {
				rv.push(maneuvers[i]);
			}
		}
		console.log(rv);
		return rv;
	}

}

function getLocationById(locId) {
	for (var i = 0 ; i < locations.length ; i++) {
		if (locations[i].id == locId) {
			return locations[i];
		}
	}
	return null;
}

// must be manually sorted in the order you want them to appear in the dropdowns...
locations.push(new Location("lost", "Lost"));
locations.push(new Location("earth", "Earth"));
locations.push(new Location("earth_orbit", "Earth Orbit"));
locations.push(new Location("lunar_flyby", "Lunar Fly-By"));
locations.push(new Location("lunar_orbit", "Lunar Orbit"));
locations.push(new Location("moon", "Moon"));
locations.push(new Location("earth_suborb", "Suborbital Flight"));
