class Functions {
	/**
	 * f(x) = fa*x + fb/(fc*x^2 + fd*x + fe)
	 * g(x) = a/(x + x1) + b/(x + x2)
	 */
	constructor({fa, fb, fc, fd, fe, a, b, x1, x2}, domain, range) {
		this.vars = {
			fa: fa,
			fb: fb,
			fc: fc,
			fd: fd,
			fe: fe,
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
		let numPoints = (this.domain.max - this.domain.min) * this.sampleRate;
		let vertices = [];
		let oldIndex = 0;
		for (let i = 0; i < (numPoints); i++) {
			let index = i / this.sampleRate + this.domain.min;
			index = parseFloat(index.toFixed(6));
			if (!isFinite(f(index))) {
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
				if (Math.abs(f(index) - f(oldIndex)) > 10
					&& ((f(index) > 0 && f(oldIndex) < 0) || (f(index) < 0 && f(oldIndex) > 0))) {
					vertices.push({
						x: (index + oldIndex) / 2.0,
						y: NaN
					})
				}
				vertices.push({
					x: index,
					y: f(index)
				});
			}
			oldIndex = index;
		}
		return vertices;
	}

	getAsymptote(x) {
		return [
			{
				x: x,
				y: this.range.min
			},
			{
				x: x,
				y: this.range.max
			}
		]
	}

	convergeToRange(f, index) {
		let scale = 10;
		let i = index - 1 / (this.sampleRate * scale);
		let dif = 1;
		while (dif !== 0 && isFinite(f(i)) && !(f(i) > this.range.max || f(i) < this.range.min)) {
			let oldI = i;
			scale = scale * scale;
			i = index - 1 / (this.sampleRate * scale);
			dif = f(oldI) - f(i);
		}
		return 1 / (this.sampleRate * scale);
	}


	getIndexFunctionPoints(f) {
		switch (f) {
			case "COMPOSED":
				return this.getComposedFractionPoints();
			case "A":
				return this.getAFractionPoints();
			case "B":
				return this.getBFractionPoints();
			case "A_PLUS_B":
				return this.getAPlusBFractionPoints();
			case "ASYMP_A":
				return this.getAsymptote(this.vars.x1);
			case "ASYMP_B":
				return this.getAsymptote(this.vars.x2);
		}
	}

	getComposedFractionPoints() {
		let v = this.vars;
		return this.getFunctionPoints((index) => {
			return (v.fa * index + v.fb) / (v.fc * (index ** 2) + v.fd * index + v.fe);
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
