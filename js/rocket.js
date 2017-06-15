var rockets = [];

function Rocket(name, thrust, mass) {
	this.name = name;
	this.thrust = thrust;
	this.mass = mass;

	this.calculateMaxPayload = function(diff) {
		var consumed = diff * this.mass;
		var remainder = this.thrust - consumed;

		return remainder / diff;
	};
}

rockets.push(new Rocket("Juno", 4, 1));
rockets.push(new Rocket("Atlas", 27, 4));
rockets.push(new Rocket("Soyuz", 80, 9));
rockets.push(new Rocket("Saturn", 200, 20));
