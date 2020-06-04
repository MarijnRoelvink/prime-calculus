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
	data: {}
};


function init() {
	let canvas = document.getElementById('graph');
	let container = document.getElementsByClassName("graph-container")[0];
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	container.width = container.clientWidth;
	container.height = container.clientHeight;

	state.functions = new Functions({
		fa: parseFloat(getUrlQuery("fa", 0)),
		fb: parseFloat(getUrlQuery("fb", 1)),
		fc: parseFloat(getUrlQuery("fc", 1)),
		fd: parseFloat(getUrlQuery("fd", 3)),
		fe: parseFloat(getUrlQuery("fe", 2)),
		a: 1,
		b: 1,
		x1: 1,
		x2: 2
	}, state.domain, state.range);
	setInput();

	let v = state.functions.vars;
	let formAdd = (el, plusSign = true, x = '') => {
		if(!el) {
			return '';
		}
		if(plusSign) {
			return (el > 0? '+ ': '- ') + Math.abs(el) + x;
		} else {
			return (el < 0? '+ ': '- ') + Math.abs(el) + x;
		}
	};
	state.data = {
		A_PLUS_B: {
			labelFormat: () => {
				return 'g(x)';
			},
			label: 'g(x) = A/(x - x1) + B/(x - x2)',
			borderColor: '#308167',
			data: state.functions.getAPlusBFractionPoints()
		},
		COMPOSED: {
			labelFormat: () => {
				return 'f(x)';
			},
			label: 'f(x) = 1/((x + 1)(x + 2))',
			borderColor: 'rgb(255, 99, 132)',
			data: state.functions.getComposedFractionPoints()
		},
		A: {
			labelFormat: () => {
				return v.a + '/(x ' + formAdd(v.x1, false) + ')';
			},
			label: 'A/(x - x1)',
			borderColor: '#ffce2e',
			data: state.functions.getAFractionPoints()
		},
		B: {
			labelFormat: () => {
				return v.b + '/(x ' + formAdd(v.x2, false)+ ')';
			},
			label: 'B/(x - x2)',
			borderColor: '#7ab1e8',
			data: state.functions.getBFractionPoints()
		},
		ASYMP_A: {
			labelFormat: () => {
				return 'Asymptote x1';
			},
			label: 'Asymptote x1',
			borderColor: '#ffce2e',
			borderDash: [10, 10],
			hidden: true,
			data: state.functions.getAsymptote(state.functions.vars.x1)
		},
		ASYMP_B: {
			labelFormat: () => {
				return 'Asymptote x2';
			},
			label: 'Asymptote x2',
			borderColor: '#7ab1e8',
			borderDash: [10, 10],
			hidden: true,
			data: state.functions.getAsymptote(state.functions.vars.x2)
		}
	};
	Object.values(state.data).forEach(x =>{
		x.label = x.labelFormat();
	});

	let ctx = document.getElementById('graph').getContext('2d');
	Chart.defaults.global.elements.point.radius = 0;
	Chart.defaults.global.spanGaps = false;

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
	setTimeout(tick, 1000);
}

function tick() {
	requestAnimFrame(tick);
	updateInput();
}

function updateChart(index) {
	if(index === "all") {
		Object.keys(state.data).forEach(k => {
			state.data[k].data = state.functions.getIndexFunctionPoints(k);
			state.data[k].label = state.data[k].labelFormat();
		})
	} else {
		state.data[index].data = state.functions.getIndexFunctionPoints(index);
		state.data[index].label = state.data[index].labelFormat();
	}
	state.chart.update();
}

function getUrlQuery(q, defaultV = "") {
	let query = {};
	let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		query[key] = value;
	});
	if (typeof (query[q]) === "undefined") {
		query[q] = defaultV;
	}
	return query[q];
}

init();