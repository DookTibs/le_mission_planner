function IonThruster() {
	this.mass = 1;
	this.thrustPerYear = 5;

	this.calculateMaxPayload = function(diff, years) {
		return ((this.thrustPerYear * years) - (diff * this.mass)) / diff;
	};
}
