
function setInput() {
	$(".slider").each(function () {
		let id = this.id.split("-")[0];
		$(this).val(state.functions.vars[id]);
		$("#" + id + "-value").html(state.functions.vars[id]);
	});
	$("#fx input").each(function () {
		$(this).val(state.functions.vars[this.id]);
	});
}
function updateInput() {

	$(".slider").each(function () {
		let id = this.id.split("-")[0];
		$("#" + id + "-value").html($(this).val());
		if(parseFloat($(this).val()) !== state.functions.vars[id]) {
			state.functions.updateVar(id, parseFloat($(this).val()));
			switch (id) {
				case "a":
				case "x1":
					updateChart("A");
					updateChart("A_PLUS_B");
					updateChart("ASYMP_A");
					break;
				case "b":
				case "x2":
					updateChart("B");
					updateChart("A_PLUS_B");
					updateChart("ASYMP_B");
			}
		}
	});
	$("#fx input").each(function () {
		if(parseFloat($(this).val()) !== state.functions.vars[this.id]) {
			state.functions.updateVar(this.id, parseFloat($(this).val()));
			updateChart("COMPOSED");
		}
	});
}