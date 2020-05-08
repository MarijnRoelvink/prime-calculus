

function updateSliders() {

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
					break;
				case "b":
				case "x2":
					updateChart("B");
					updateChart("A_PLUS_B");
			}
		}
	});
}