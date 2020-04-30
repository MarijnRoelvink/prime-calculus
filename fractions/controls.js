

function updateSliders() {

	$(".slider").each(function () {
		let id = this.id.split("-")[0];
		$("#" + id + "-value").html($(this).val());
		if(parseFloat($(this).val()) !== state.functions.vars[id]) {
			state.functions.updateVar(id, parseFloat($(this).val()));
			switch (id) {
				case "a":
				case "x1":
					updateChart(state.dataIndex.A);
					updateChart(state.dataIndex.A_PLUS_B);
					break;
				case "b":
				case "x2":
					updateChart(state.dataIndex.B);
					updateChart(state.dataIndex.A_PLUS_B);
			}
		}
	});
}