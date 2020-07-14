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
			y: 0.5
		}, "addition"),
	lastPos: {
		x: 0,
		y: 0
	},
	dragging: false,
	radialView: false
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
		RES: {
			labelFormat: () => {
				return 'result';
			},
			label: 'result',
			borderColor: '#f87089',
			pointBackgroundColor: '#f87089',
			pointRadius: [0, 5],
			hidden: false,
			data: state.complex.getChartData("RES")
		},
		Z1: {
			labelFormat: () => {
				return 'z1';
			},
			label: 'z1',
			borderColor: '#ffce2e',
			pointBackgroundColor: '#ffce2e',
			pointRadius: [0, 5],
			hidden: false,
			data: state.complex.getChartData("Z1")
		},
		Z2: {
			labelFormat: () => {
				return 'z2';
			},
			label: 'z2',
			borderColor: '#7ab1e8',
			pointBackgroundColor: '#7ab1e8',
			pointRadius: [0, 5],
			hidden: false,
			data: state.complex.getChartData("Z2")
		},
		HELP1: {
			labelFormat: () => {
				return '';
			},
			label: '',
			borderColor: '#ffce2e',
			pointRadius: 0,
			hidden: false,
			borderDash: [10, 10],
			data: state.complex.getHelpLine(1)
		},
		HELP2: {
			labelFormat: () => {
				return '';
			},
			label: '',
			borderColor: '#7ab1e8',
			pointRadius: 0,
			hidden: false,
			borderDash: [10, 10],
			data: state.complex.getHelpLine(2)
		},
		RGRID: {
			labelFormat: () => {
				return '';
			},
			label: '',
			borderColor: 'gray',
			pointRadius: 0,
			borderWidth: 1,
			lineTension: 0,
			data: state.complex.getChartData("RGRID")
		},
		RUNITCIRCLE: {
			labelFormat: () => {
				return '';
			},
			label: '',
			borderColor: 'white',
			pointRadius: 0,
			borderWidth: 1,
			spanGaps: false,
			data: state.complex.getChartData("RUNITCIRCLE")
		},
		RCIRCLES: {
			labelFormat: () => {
				return '';
			},
			label: '',
			borderColor: 'gray',
			pointRadius: 0,
			borderWidth: 1,
			spanGaps: false,
			data: state.complex.getChartData("RCIRCLES")
		},
	};
	let ctx = document.getElementById('graph').getContext('2d');

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
			onClick: (event) => {
				console.log(event);
			},
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
					fontSize: 16,
					filter: (item, data) => {
						return item.text !== '';
					}
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
			state.data[k].data = state.complex.getChartData(k);
			state.data[k].label = state.data[k].labelFormat();
		})
	} else {
		state.data[index].data = state.complex.getChartData(index);
		state.data[index].label = state.data[index].labelFormat();
	}
	state.chart.options.scales.xAxes[0].gridLines.lineWidth = state.radialView? 0 : 1;
	state.chart.options.scales.yAxes[0].gridLines.lineWidth = state.radialView? 0 : 1;
	state.chart.update();
}

function switchMode(mode) {
	state.complex.mode = mode;
	setInput();
	state.data.Z2.hidden = mode === "inverse" || mode === "conjugate";
	switchGrid(state.complex.isInRadialMode());
}


init();