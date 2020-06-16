let state = {
	domain: {
		min: -5,
		max: 5
	},
	range: {
		min: -10,
		max: 10
	},
	chart: {},
	data: {},
	complex: new Complex({
			x: 1,
			y: 1
		},
		{
			x: 1,
			y: 0
		}, "addition"),
	lastPos: {
		x: 0,
		y: 0
	},
	dragging: false
};


function init() {
	let canvas = document.getElementById('graph');
	let container = document.getElementsByClassName("graph-container")[0];
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	container.width = container.clientWidth;
	container.height = container.clientHeight;

	let xcounts = state.domain.max - state.domain.min;
	let ycounts = canvas.clientHeight * xcounts / canvas.clientWidth;

	state.range = {
		max: ycounts / 2,
		min: -ycounts / 2
	};

	setInput();

	state.data = {
		Z1: {
			labelFormat: () => {
				return 'z1';
			},
			label: 'z1',
			borderColor: '#ffce2e',
			pointBackgroundColor: '#ffce2e',
			hidden: false,
			data: [state.complex.z1]
		},
		Z2: {
			labelFormat: () => {
				return 'z2';
			},
			label: 'z2',
			borderColor: '#7ab1e8',
			pointBackgroundColor: '#7ab1e8',
			hidden: false,
			data: [state.complex.z2]
		},
		RES: {
			labelFormat: () => {
				return 'result';
			},
			label: 'result',
			borderColor: '#f87089',
			pointBackgroundColor: '#f87089',
			hidden: false,
			data: [state.complex.getOperationResult()]
		}
	};
	let ctx = document.getElementById('graph').getContext('2d');

	Chart.defaults.global.elements.point.radius = 5;

	state.chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			datasets: Object.values(state.data)
		},

		// Configuration options go here
		options: {
			maintainAspectRatio: false,
			responsive: true,
			animation: {
				duration: 0 // general animation time
			},
			hover: {
				animationDuration: 0 // duration of animations when hovering an item
			},
			responsiveAnimationDuration: 0, // animation duration after a resize
			legend: {
				labels: {
					// This more specific font property overrides the global property
					fontColor: '#fff',
					fontSize: 16
				}
			},
			scales: {
				xAxes: [{
					display: true,
					type: 'linear',
					position: 'bottom',
					gridLines: {
						zeroLineColor: "#FFF",
						color: "gray"
					},
					ticks: {
						min: state.domain.min,
						stepSize: 1,
						max: state.domain.max,
						fontColor: "#FFF",
					}
				}],
				yAxes: [{
					display: true,
					type: 'linear',
					position: 'bottom',
					gridLines: {
						zeroLineColor: "#FFF",
						color: "gray"
					},
					ticks: {
						min: state.range.min,
						max: state.range.max,
						fontColor: "#FFF",
					}
				}],
			}
		}
	});
	initMousePan();
	initOpsList();
	setTimeout(tick, 1000);
}

function tick() {
	requestAnimFrame(tick);
	updateInput();
}

function updateChart(index) {
	if (index === "all") {
		Object.keys(state.data).forEach(k => {
			state.data[k].data = [state.complex.getVar(k)];
			state.data[k].label = state.data[k].labelFormat();
		})
	} else {
		state.data[index].data = [state.complex.getVar(index)];
		state.data[index].label = state.data[index].labelFormat();
	}
	state.chart.update();
}

function switchMode(mode) {
	state.complex.mode = mode;
	setInput();
	state.data.Z2.hidden = mode === "inverse" || mode === "conjugate";
	updateChart("all");
}


init();