let state = {
	domain: {
		min: -5,
		max: 5
	},
	range: {
		min: -10,
		max: 10
	},
	functions: {},
	chart: {},
	dataIndex: {
		COMPOSED: 1,
		A: 2,
		B: 3,
		A_PLUS_B: 0
	}
};


function init() {
	let canvas = document.getElementById('graph');
	let container = document.getElementsByClassName("graph-container")[0];
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	container.width = container.clientWidth;
	container.height = container.clientHeight;

	state.functions = new Functions({
		w1: 1,
		w2: 2,
		a: 1,
		b: 1,
		x1: 1,
		x2: 2
	}, state.domain, state.range);

	let ctx = document.getElementById('graph').getContext('2d');
	Chart.defaults.global.elements.point.radius = 0;
	Chart.defaults.global.spanGaps = false;

	state.chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			datasets: [{
				label: 'g(x) = A/(x - x1) + B/(x - x2)',
				borderColor: '#308167',
				data: state.functions.getAPlusBFractionPoints()
			},
				{
					label: 'f(x) = 1/((x + 1)(x + 2))',
					borderColor: 'rgb(255, 99, 132)',
					data: state.functions.getComposedFractionPoints()
				},
				{
					label: 'A/(x - x1)',
					borderColor: '#ffce2e',
					data: state.functions.getAFractionPoints()
				},
				{
					label: 'B/(x - x2)',
					borderColor: '#7ab1e8',
					data: state.functions.getBFractionPoints()
				}
			]
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
					fontColor: '#fff'
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
	setTimeout(tick, 1000);
}

function tick() {
	requestAnimFrame(tick);
	updateSliders();
}

function updateChart(index) {
	state.chart.data.datasets[state.dataIndex[index]].data = state.functions.getIndexFunctionPoints(index);
	state.chart.update();
}

init();