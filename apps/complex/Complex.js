class Complex {
	constructor(z1, z2, mode) {
		this.z1 = z1;
		this.z2 = z2;
		this.mode = mode;
	}

	setVar(name, val) {
		switch (name) {
			case "a":
				this.z1.x = val;
				break;
			case "b":
				this.z1.y = val;
				break;
			case "c":
				this.z2.x = val;
				break;
			case "d":
				this.z2.y = val;
				break;
		}
	}

	getChartData(name) {
		switch (name) {
			case "HELP1":
				return this.getHelpLine(1);
			case "HELP2":
				return this.getHelpLine(2);
			case "RGRID":
				return this.getGrid();
			case "RUNITCIRCLE":
				return this.getUnitCircle();
			case "RCIRCLES":
				return this.getCircles();
			default:
				return [
					{x: 0, y: 0},
					this.getVar(name)
				];
		}
	}

	getVar(name) {
		switch (name) {
			case "a":
				return this.z1.x;
			case "b":
				return this.z1.y;
			case "c":
				return this.z2.x;
			case "d":
				return this.z2.y;
			case "Z1":
				return this.z1;
			case "Z2":
				return this.z2;
			case "RES":
				return this.getOperationResult();
		}
	}

	getOperationResult() {
		let res;
		switch (this.mode) {
			case "addition":
				res = this.doAddition();
				break;
			case "subtraction":
				res = this.doSubtraction();
				break;
			case "multiplication":
				res = this.doMultiplication();
				break;
			case "division":
				res = this.doDivision();
				break;
			case "inverse":
				res = this.doInverse();
				break;
			case "conjugate":
				res = this.doConjugate();
				break;
		}
		res.x = Math.round(res.x*100)/100;
		res.y = Math.round(res.y*100)/100;
		return res;
	}

	getHelpLine(index) {
		switch (this.mode) {
			case "addition":
				return [index === 1 ? this.z2 : this.z1, this.getOperationResult()];
			case "subtraction":
				return index === 2 ? [this.z1, this.getOperationResult()] : [];
			case "multiplication":
				return this.getArcHelpLines(index);
			case "division":
				return this.getArcHelpLines(index);
			case "inverse":
				return this.getArcHelpLines(index);
			case "conjugate":
				return [];
		}
	}

	getGrid() {
		if (state.radialView) {
			let res = [];
			let numLines = 24;
			for (let i = 0; i < numLines; i++) {
				let a = i * 2 / numLines * Math.PI;
				if (i % (numLines / 4) !== 0) {
					let length = this.getMaxViewSize() * this.getMaxViewSize();
					res.push({
						x: length * Math.cos(a),
						y: length * Math.sin(a)
					}, {
						x: 0,
						y: 0
					})
				}
			}
			return res;
		} else {
			return [];
		}
	}

	getCircles() {
		if (state.radialView) {
			let res = [];
			let numPoints = 24;
			for (let i = 1; i < this.getMaxViewSize() + 1; i++) {
				for (let j = 0; j <= numPoints; j++) {
					let a = j * 2 / numPoints * Math.PI;
					res.push({
						x: i * Math.cos(a),
						y: i * Math.sin(a)
					})
				}
				res.push({
					x: NaN,
					y: NaN
				})
			}
			return res;
		} else {
			return [];
		}
	}


	getUnitCircle() {
		if (state.radialView) {
			let res = [];
			let numPoints = 24;
			for (let j = 0; j <= numPoints; j++) {
				let a = j * 2 / numPoints * Math.PI;
				res.push({
					x: Math.cos(a),
					y: Math.sin(a)
				})
			}
			return res;
		} else {
			return [];
		}
	}

	getArcHelpLines(index) {
		if (this.mode === "division" && index === 1) {
			return [];
		}
		let from1, from2, to1, to2, radius1, radius2;
		switch (this.mode) {
			case "division":
				if (index === 1) {
					return [];
				}
			case "multiplication":
				from1 = {x: 0, y: 0};
				to1 = index === 1 ? this.z1 : this.z2;
				from2 = index === 1 ? this.z2 : this.z1;
				to2 = this.getVar("RES");
				radius1 = index === 1 ? 0.9 : 1.1;
				radius2 = 2 - radius1;
				break;
			case "inverse":
				if (index === 2) {
					return [];
				}
				from1 = {x: 0, y: 0};
				to1 = this.z1;
				from2 = from1;
				to2 = this.getVar("RES");
				radius1 = 0.9;
				radius2 = this.getAbsValue(to2);
				break;
		}

		let res = [];
		res = res.concat(this.getArc(from1,
			to1,
			radius1));
		res.push({x: NaN, y: NaN});
		res = res.concat(this.getArc(from2,
			to2,
			radius2));
		return res;
	}

	getArc(from, to, radius) {
		let base = Math.atan2(from.y, from.x);
		let angle = Math.atan2(to.y, to.x) - base;
		let res = [];
		for (let i = 0; i <= 12; i++) {
			let subangle = base + angle * i / 12;
			res.push(
				{
					x: radius * Math.cos(subangle),
					y: radius * Math.sin(subangle)
				}
			)
		}
		return res;
	}

	isInRadialMode() {
		return this.mode === "multiplication"
			|| this.mode === "division"
			|| this.mode === "inverse"
			|| this.mode === "conjugate";
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
			x: this.z1.x * this.z2.x - this.z1.y * this.z2.y,
			y: this.z1.x * this.z2.y + this.z1.y * this.z2.x,
		};
	}

	doDivision() {
		//(a + bi)/(c + di) =
		//(a + bi)(c - di)/(c^2 + d^2)
		//((ac + bd) + (bc - ad)i)/(c^2 + d^2)
		let denom = this.z2.x * this.z2.x + this.z2.y * this.z2.y;
		return {
			x: (this.z1.x * this.z2.x + this.z1.y * this.z2.y) / denom,
			y: (this.z1.y * this.z2.x - this.z1.x * this.z2.y) / denom
		};
	}

	doInverse() {
		//1/(a + bi) =
		//(a - bi)/(a^2 + b^2)
		let denom = this.z1.x * this.z1.x + this.z1.y * this.z1.y;
		return {
			x: this.z1.x / denom,
			y: -this.z1.y / denom
		};
	}

	doConjugate() {
		return {
			x: this.z1.x,
			y: -this.z1.y
		};
	}

	/**
	 * Returns the absolute value of a complex number x + yi.
	 * @param x real part
	 * @param y imaginary part
	 * @return sqrt(a^2 + b^2)
	 */
	getAbsValue({x, y}) {
		return Math.sqrt(
			Math.pow(x, 2)
			+ Math.pow(y, 2));
	}

	normalizeVec(vec) {
		let l = this.getAbsValue(vec);
		return {
			x: vec.x / l,
			y: vec.y / l
		}
	}

	getMaxViewSize() {
		let vals = [this.getAbsValue(this.getVar("RES")),
			this.getAbsValue(this.z1),
			this.getAbsValue(this.z2),
			state.range.max,
			Math.abs(state.range.min),
			state.domain.max,
			Math.abs(state.domain.min)];
		return vals.reduce((prev, curr, index) => {
			return Math.max(prev, curr);
		});
	}
}