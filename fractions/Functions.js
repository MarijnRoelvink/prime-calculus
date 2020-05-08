
class Functions {
	/**
	 * f(x) = 1/((x + w1)(x + w2))
	 * g(x) = a/(x + x1) + b/(x + x2)
	 */
	constructor({w1, w2, a, b, x1, x2}, domain, range) {
		this.vars = {
			w1: w1,
			w2: w2,
			a: a,
			b: b,
			x1: x1,
			x2: x2
		};
		this.domain = domain;
		this.range = range;
		this.sampleRate = 20;
	}

	updateVar(id, val) {
		this.vars[id] = val;
	}

	getFunctionPoints(f) {
		let numPoints = (this.domain.max - this.domain.min)*this.sampleRate;
		let vertices = [];
		for (let i = 0; i < (numPoints); i++) {
			let index = i * (this.domain.max - this.domain.min) / numPoints + this.domain.min;
			if(!isFinite(f(index))) {
				let step = this.convergeToRange(f, index);
				let before = index - step;
				vertices.push({
					x: before,
					y: f(before)
				});
				vertices.push({
					x: index,
					y: f(index)
				});
				let next = index + step;
				vertices.push({
					x: next,
					y: f(next)
				});
			} else {
				vertices.push({
					x: index,
					y: f(index)
				});
			}
		}
		return vertices;
	}

	convergeToRange(f, index) {
		let scale = 10;
		let i = index - 1/(this.sampleRate*scale);
		let dif = 1;
		while(dif !== 0 && isFinite(f(i)) && !(f(i) > this.range.max || f(i) < this.range.min)) {
			let oldI = i;
			scale = scale*scale;
			i = index - 1/(this.sampleRate*scale);
			dif = f(oldI) - f(i);
		}
		return 1/(this.sampleRate*scale);
	}


	getIndexFunctionPoints(f) {
		switch(f) {
			case "COMPOSED": return this.getComposedFractionPoints();
			case "A": return this.getAFractionPoints();
			case "B": return this.getBFractionPoints();
			case "A_PLUS_B": return this.getAPlusBFractionPoints();
		}
	}

	getComposedFractionPoints() {
		return this.getFunctionPoints((index) => {
			return 1 / ((index + this.vars.w1)*(index + this.vars.w2));
		})
	}

	getAFractionPoints() {
		return this.getFunctionPoints((index) => {
			return this.vars.a / (index - this.vars.x1);
		});
	}

	getBFractionPoints() {
		return this.getFunctionPoints((index) => {
			return this.vars.b / (index - this.vars.x2);
		});
	}

	getAPlusBFractionPoints() {
		return this.getFunctionPoints((index) => {
			return this.vars.a / (index - this.vars.x1) + this.vars.b / (index - this.vars.x2);
		});
	}
}
