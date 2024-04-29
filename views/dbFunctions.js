console.log("hi");

var id = $("#databaseTable").attr("value");
$(document).on("click", ".row_data", function (event) {
	event.preventDefault();

	if ($(this).attr("edit_type") == "button") {
		return false;
	}
	var tbl_row = $(this).closest("tr");

	tbl_row.find(".btn-save").css({ visibility: "visible" });
	tbl_row.find(".btn-cancel").css({ visibility: "visible" });
	tbl_row.find(".btn-delete").css({ visibility: "visible" });
	tbl_row.find(".row_data").attr("clicked", false);

	$(this).attr("original_entry", $(this).html());
	$(this).attr("clicked", true);

	//make div editable
	$(this).closest("div").attr("contenteditable", "true");
	//add bg css
	$(this).addClass("bg-warning").css("padding", "5px");

	$(this).focus();
});

$(document).on("click", ".btn-cancel", function (event) {
	event.preventDefault();
	var tbl_row = $(this).closest("tr");
	//	var row_id = tbl_row.attr('row_id');
	//hide save and cacel buttons
	tbl_row.find(".btn-save").css({ visibility: "hidden" });
	tbl_row.find(".btn-cancel").css({ visibility: "hidden" });
	tbl_row.find(".btn-delete").css({ visibility: "hidden" });
	tbl_row.find(".btn-add").css({ visibility: "hidden" });

	//make the whole row editable
	tbl_row
		.find(".row_data")
		.attr("edit_type", "click")
		.removeClass("bg-warning")
		.css("padding", "");

	tbl_row.find(".row_data").each(function (index, val) {
		$(this).html($(this).attr("original_entry"));
	});

	tbl_row.find(".input").val("");
});

$(document).on("click", ".btn-delete", function (event) {
	event.preventDefault();
	var tbl_row = $(this).closest("tr");
	var field = tbl_row.attr("value");
	var dataToRemove = $(".row_data[clicked=true]").html().trim();
	//  console.log(dataToRemove);
	//hide save and cacel buttons
	tbl_row.find(".btn-save").css({ visibility: "hidden" });
	tbl_row.find(".btn-cancel").css({ visibility: "hidden" });
	tbl_row.find(".btn-add").css({ visibility: "hidden" });
	tbl_row.find(".btn-delete").css({ visibility: "hidden" });

	if (field == "altName") {
		field = "properties.name";
	}
	if (field == "altCapital") {
		field = "properties.capital";
	}

	//make the whole row editable
	tbl_row
		.find(".row_data")
		.attr("edit_type", "click")
		.removeClass("bg-warning")
		.css("padding", "");

	$.ajax({
		url: "/deleteData",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({
			id: id,
			field: field,
			value: dataToRemove,
		}),
		dataType: "json",
		success: function (data) {
			console.log(data);
			console.log("Success update request");
			location.reload();
		},
	});
});

//make cancel and add button appear
$(document).on("click", ".input", function (event) {
	event.preventDefault();
	var tbl_row = $(this).closest("tr");
	//hide save and cacel buttons
	tbl_row.find(".btn-add").css({ visibility: "visible" });
	tbl_row.find(".btn-cancel").css({ visibility: "visible" });
});

//Add the data that was added
$(document).on("click", ".btn-add", function (event) {
	event.preventDefault();
	var tbl_row = $(this).closest("tr");
	var field = tbl_row.attr("value");

	var dataToAdd = tbl_row.find(".input").val();
	//hide save and cacel buttons
	tbl_row.find(".btn-save").css({ visibility: "hidden" });
	tbl_row.find(".btn-cancel").css({ visibility: "hidden" });

	//  var id = $("#databaseTable").attr('value');
	if (field == "altName") {
		field = "properties.name";
	}
	if (field == "altCapital") {
		field = "properties.capital";
	}

	$.ajax({
		url: "/addData",
		type: "POST",
		contentType: "application/json",
		data: JSON.stringify({
			id: id,
			field: field,
			value: dataToAdd,
		}),
		dataType: "json",
		success: function (data) {
			console.log(data);
			console.log("Success update request");
			location.reload();
		},
	});
});

$(document).on("focusout", ".row_data", function (event) {
	event.preventDefault();

	if ($(this).attr("edit_type") == "button") {
		return false;
	}
	var row_div = $(this)
		.removeClass("bg-warning") //add bg css
		.css("padding", "");
});

//Send Update Request
$(document).on("click", ".btn-save", function (event) {
	event.preventDefault();

	var tbl_row = $(this).closest("tr");

	//Field to update in a database
	var field = tbl_row.attr("value");
	// var id = $("#databaseTable").attr('value');
	//  console.log(typeof(id));
	//Formatting the data in an array form without empty strings.
	var newData = tbl_row.find(".row_data").text().trim().split("\n");
	newData = newData.map((s) => s.trim());
	newData = newData.filter(Boolean);
	console.log(newData);
	//send field: new array
	console.log(tbl_row.find(".row_data").text());
	console.log(field);

	//hide save and cacel buttons
	tbl_row.find(".btn-save").css({ visibility: "hidden" });
	tbl_row.find(".btn-cancel").css({ visibility: "hidden" });
	tbl_row.find(".btn-delete").css({ visibility: "hidden" });

	var name; //can be capital or name depending on what field to update
	if (field == "altCapital") {
		name = $("#capital").html();
	} else if (field == "altName") {
		name = $("#name").html();
	} else if (field == "properties.name") {
		name = $("#name").html();
		var otherNames = $("#altName").find(".row_data").text().trim().split("\n");
		otherNames = otherNames.map((s) => s.trim()).filter(Boolean);
		newData = newData.concat(otherNames);
		console.log(newData);

		//  newData.
	} else if (field == "properties.capital") {
		name = $("#capital").html();
		var otherCaps = $("#altCapital")
			.find(".row_data")
			.text()
			.trim()
			.split("\n");
		otherCaps = otherNames.map((s) => s.trim()).filter(Boolean);
		newData = newData.concat(otherCaps);
		console.log(newData);
	}
	console.log("name ---- " + name);

	$.ajax({
		url: "/update",
		type: "PUT",

		contentType: "application/json",
		data: JSON.stringify({
			id: id,
			name: name,
			field: field,
			value: newData,
		}),
		dataType: "json",
		success: function (data) {
			console.log(data);
			console.log("Success update request");
		},
	});
});
