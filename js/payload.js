var payloads = [];

function Payload(name, mass) {
	this.name = name;
	this.mass = mass;
}

function getPayloadByName(name) {
	for (var i = 0 ; i < payloads.length ; i++) {
		if (payloads[i].name == name) {
			return payloads[i];
		}
	}
	return null;
}

payloads.push(new Payload("Astronaut", 0));
payloads.push(new Payload("Capsule: Aldrin", 3));
payloads.push(new Payload("Capsule: Apollo", 3));
payloads.push(new Payload("Capsule: Eagle", 1));
payloads.push(new Payload("Capsule: Vostok", 2));
payloads.push(new Payload("Probe", 1));
payloads.push(new Payload("Sample", 1));
payloads.push(new Payload("Supplies", 1));
