function setInput() {
	$(".val").each(function () {
		let index = this.classList.item(1).split("-")[1];
		$(this).val(state.complex.getVar(index).toFixed(2));
	});
	let res = state.complex.getVar("RES");
	$("#" + state.complex.mode + "-view .res").first().html(res.x + " + " + res.y + "i");
}

function updateInput() {
	$("#" + state.complex.mode + "-view .val").each(function () {
		let index = this.classList.item(1).split("-")[1];
		if (parseFloat($(this).val()) !== state.complex.getVar(index)) {
			state.complex.setVar(index, parseFloat($(this).val()));
			let res = state.complex.getVar("RES");
			$("#" + state.complex.mode + "-view .res").first().html(res.x + " + " + res.y + "i");
			updateChart("all");
		}
	});
}


function initOpsList() {
	$("#complex-ops li").each(function () {
		let self = this;
		self.onclick = () => {
			let mode = self.id.split("-")[1];
			if (mode !== state.complex.mode) {
				$("#choose-" + state.complex.mode).removeClass("active");
				$(".op-view").each(function () {
					$(this).css("display", "none");
				});
				$("#" + mode + "-view").css("display", "flex");
				self.classList.add("active");
				switchMode(mode);
			}
		};
	});
}

function initMousePan() {
	let canvas = document.getElementById("graph");

	let start = (ev, x, y) => {
		state.lastPos = {
			x: x,
			y: y
		};
		state.dragging = true;
		let el = state.chart.getElementAtEvent(ev);
		state.dragPoint = el.length > 0 ? Object.keys(state.data)[el[0]._datasetIndex] : "";

	};
	let move = (x, y) => {
		if (state.dragging) {
			let dx = -(x - state.lastPos.x) / canvas.offsetWidth * (state.domain.max - state.domain.min);
			let dy = (y - state.lastPos.y) / canvas.offsetHeight * (state.range.max - state.range.min);

			if (state.dragPoint !== "") {
				state.complex.getVar(state.dragPoint).x -= dx;
				state.complex.getVar(state.dragPoint).y -= dy;
				setInput();
				updateChart("all");
			} else {
				pan(dx, dy);
			}
			state.lastPos = {
				x: x,
				y: y
			};
		}
	};

	let end = () => {
		state.dragging = false;
	};

	canvas.onmousedown = function (event) {
		start(event, event.offsetX, event.offsetY);
	};
	canvas.ontouchstart = function (event) {
		start(event, event.touches[0].clientX, event.touches[0].clientY);
	};
	canvas.onmousemove = function (event) {
		move(event.offsetX, event.offsetY);
	};
	canvas.ontouchmove = function (event) {
		move(event.touches[0].clientX, event.touches[0].clientY);
	};
	canvas.onmouseup = end;
	canvas.ontouchend = end;
}

function switchGrid(radialView) {
	state.radialView = radialView;
	$("#choose-grid button").each(function () {
		this.classList.remove("btn-primary");
		this.classList.remove("btn-secondary");
	});
	$("#grid-button").addClass(!radialView ? "btn-primary" : "btn-secondary");
	$("#radial-button").addClass(radialView ? "btn-primary" : "btn-secondary");
	updateChart("all");
}

function zoom(delta) {
	let dx = delta;
	let canvas = document.getElementById("graph");
	let dy = delta * canvas.offsetHeight / canvas.offsetWidth;
	state.domain.min -= dx;
	state.domain.max += dx;
	state.range.min -= dy;
	state.range.max += dy;
	state.chart.config.options.scales.xAxes[0].ticks.min = state.domain.min;
	state.chart.config.options.scales.xAxes[0].ticks.max = state.domain.max;
	state.chart.config.options.scales.yAxes[0].ticks.min = state.range.min;
	state.chart.config.options.scales.yAxes[0].ticks.max = state.range.max;
	updateChart("all");
}

function pan(dx, dy) {
	state.domain.min += dx;
	state.domain.max += dx;
	state.range.min += dy;
	state.range.max += dy;
	state.chart.config.options.scales.xAxes[0].ticks.min = state.domain.min;
	state.chart.config.options.scales.xAxes[0].ticks.max = state.domain.max;
	state.chart.config.options.scales.yAxes[0].ticks.min = state.range.min;
	state.chart.config.options.scales.yAxes[0].ticks.max = state.range.max;
	updateChart("all");
}