class Complex {
	constructor(z1, z2, mode) {
		this.z1 = z1;
		this.z2 = z2;
		this.mode = mode;
	}

	setVar(name, val) {
		switch(name) {
			case "a": this.z1.x = val; break;
			case "b": this.z1.y = val; break;
			case "c": this.z2.x = val; break;
			case "d": this.z2.y = val; break;
		}
	}

	getVar(name) {
		switch(name) {
			case "a": return this.z1.x;
			case "b": return this.z1.y;
			case "c": return this.z2.x;
			case "d": return this.z2.y;
			case "Z1": return this.z1;
			case "Z2": return this.z2;
			case "RES": return this.getOperationResult();
		}
	}

	getOperationResult() {
		switch(this.mode) {
			case "addition": return this.doAddition();
			case "subtraction": return this.doSubtraction();
			case "multiplication": return this.doMultiplication();
			case "division": return this.doDivision();
			case "inverse": return this.doInverse();
			case "conjugate": return this.doConjugate();
		}
	}

	doAddition() {
		return {
			x: this.z1.x + this.z2.x,
			y: this.z1.y + this.z2.y,
		};
	}

	doSubtraction() {
		return {
			x: this.z1.x - this.z2.x,
			y: this.z1.y - this.z2.y,
		};
	}

	doMultiplication() {
		//(a + bi)(c + di) =
		//ac + adi + bci - bd =
		//(ac - bd) + (ad + bc)i
		return {
			x: this.z1.x*this.z2.x - this.z1.y*this.z2.y,
			y: this.z1.x*this.z2.y + this.z1.y*this.z2.x,
		};
	}

	doDivision() {
		//(a + bi)/(c + di) =
		//(a + bi)(c - di)/(c^2 + d^2)
		//((ac + bd) + (bc - ad)i)/(c^2 + d^2)
		let denom = this.z2.x*this.z2.x + this.z2.y*this.z2.y;
		return {
			x: (this.z1.x*this.z2.x + this.z1.y*this.z2.y)/denom,
			y: (this.z1.y*this.z2.x - this.z1.x*this.z2.y)/denom
		};
	}

	doInverse() {
		//1/(a + bi) =
		//(a - bi)/(a^2 + b^2)
		let denom = this.z1.x*this.z1.x + this.z1.y*this.z1.y;
		return {
			x: this.z1.x/denom,
			y: -this.z1.y/denom
		};
	}

	doConjugate() {
		return {
			x: this.z1.x,
			y: -this.z1.y
		};
	}
}