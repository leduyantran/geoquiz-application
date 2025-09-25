/**
 * This section of code is attempting to prevent the user from using the back button of the browser
 * by manipulating the window location hash and setting up an event listener to detect hash changes.
 */
window.location.hash = "no-back-button";

/** This line is a workaround for a Chrome issue where the first hash change isn't recorded in the history */
window.location.hash = "Again-No-back-button";
window.onhashchange = function () {
	window.location.hash = "no-back-button";
};

/** Declaration of variables to hold information about selected countries, map features, map center, zoom level, and URL. */
var selectedCountries;
var features;
var center, zoom, minzoom;
var url;

/** Retrieving the continent information from the HTML document and converting it to lowercase. */
var continent = document
	.getElementsByClassName("continent")[0]
	.innerHTML.toLowerCase()
	.trim();

/** Switch statement to set the center and zoom level of the map based on the continent. */
switch (continent) {
	case "africa":
		center = [11, -1];
		zoom = 2.5;
		minzoon = 2;
		break;

	case "asia":
		center = [93, 22];
		zoom = 2;
		minzoom = 1.3;
		break;

	case "europe":
		center = [9, 56];
		zoom = 3.3;
		minzoom = 1.3;
		break;

	case "south-america":
		center = [-58, -18];
		zoom = 2.8;
		minzoom = 1.3;
		break;

	case "north-america":
		zoom = 2.0;
		center = [-91, 58];
		minzoom = 1.3;
		break;

	case "oceania":
		zoom = 2.7;
		center = [157, -18];
		minzoom = 2;
		break;
}

/**
 * Constructing the URL to fetch country data based on the continent.
 * var urlforCountries = "https://" + window.location.host + "/quiz/" + continent;
 */
var urlforCountries = window.location.origin + "/quiz/" + continent;

console.log("entered");
console.log(urlforCountries);

/** Using XMLHttpRequest to fetch country data from the server. */
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function ReceivedCallback() {
	if (this.readyState == 4 && this.status == 200) {
		selectedCountries = JSON.parse(this.responseText);
		console.log("Response Received");
	}
};

xhttp.open("GET", urlforCountries, true);
xhttp.send(null);

/** Creating a vector layer for displaying country boundaries on the map. */
var vectorLayer = new ol.layer.Vector({
	renderMode: "image",
	source: new ol.source.Vector({
		url: "/countries/" + continent,
		format: new ol.format.GeoJSON(),
	}),
	style: function (feature) {
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: "#ffffff",
			}),
			stroke: new ol.style.Stroke({
				color: "#000000",
			}),
		});
	},
	renderer: "webgl",
});

/** Creating the map object with the vector layer. */
var map = new ol.Map({
	layers: [vectorLayer],
	target: "map",
	view: new ol.View({
		projection: "EPSG:4326",
		center: center,
		zoom: zoom,
	}),
});

/** To check if backgroundlayer style is already have been applied. If so, skip adding bbFeatures. */
var bbFeatures = [];
var bbindex = 0;
var beforeHighlight = 0;

/** Creating a vector layer to display background boundaries. */
var backgroundLayer = new ol.layer.Vector({
	source: new ol.source.Vector({
		renderMode: "image",
		url: "/background/" + continent,
		format: new ol.format.GeoJSON(),
	}),
	style: function (feature) {
		/** Styling the background boundaries differently from the regular country boundaries. */
		if (feature.get("name") == "BB") {
			console.log(feature.get("name"));
			if (beforeHighlight < 14) {
				bbFeatures[bbindex] = feature;
				bbindex++;
				beforeHighlight++;
			}
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: "rgb(149, 186, 244, 0)",
				}),
				stroke: new ol.style.Stroke({
					color: "#000000",
					width: 1,
					lineDash: [3.5],
				}),
			});
		} else {
			return new ol.style.Style({
				fill: new ol.style.Fill({
					color: "rgb(175, 184, 198)",
				}),
				stroke: new ol.style.Stroke({
					color: "rgb(79, 83, 89)",
				}),
			});
		}
	},
	renderer: "webgl",
});

/** Adding the background layer to the map. */
map.addLayer(backgroundLayer);

/** Event listener for changes in the background layer. */
backgroundLayer.on("change", function (e) {
	LoadQuiz();
});

/** Function to handle loading the quiz when the map is ready. */
function LoadQuiz() {
	if (map.getLayers().getArray()[0].getSource().getState() == "ready") {
		document.getElementById("myModal").style.display = "none";
	} else {
		map
			.getLayers()
			.getArray()[0]
			.on("change", function (e) {
				document.getElementById("myModal").style.display = "none";
			});
	}
}

/** Declaration of variables for quiz-related functionality. */
var numCountries = 10;
var features;

/** Array of colors for styling selected countries. */
var colors = [
	"rgb(66, 244, 206)",
	"rgb(175, 47, 249)",
	"rgb(237, 113, 119)",
	"rgb(197, 237, 112)",
	"rgb(95, 99, 86)",
	"rgb(242, 181, 101)",
	"rgb(51, 117, 54)",
	"rgb(84, 75, 168)",
	"rgb(247, 247, 98)",
	"rgb(237, 23, 163)",
];

/** Function to generate a random color from the colors array. */
function randomColor() {
	var color = colors[Math.floor(Math.random() * 10)];
	return color;
}

/** Array to store used colors. */
var used = [];
var usedIndex = 0;

/** Function to reset map view to default. */
function DefaultZoom() {
	map.getView().setCenter(center);
	map.getView().setZoom(zoom);
}

/** Function called when the quiz starts. */
function Start() {
	/** Submitting a comment form with the ID "sentcomment". */
	$("#sentcomment").submit();
	/** Checking if the quiz is restarting. */
	if ($("#start")[0].innerHTML == "Restart") {
		/** Reloading the page if restarting. */
		window.location.reload();
	} else {
		/** Disabling the start button or changing its text to "Restart". */
		if ($("#start")[0].innerHTML == "Start the Quiz") {
			$("#start")[0].disabled = true;
		} else {
			$("#start")[0].innerHTML = "Restart";
		}

		/** Displaying the quiz interface. */
		document.getElementById("takeQuiz").style.display = "block";

		/** Getting features from the map's vector layer. */
		features = map.getLayers().getArray()[0].getSource().getFeatures();

		/** Setting IDs for quiz answers based on selected countries. */
		for (var i = 1; i < 11; i++) {
			document.getElementById(i).value = selectedCountries[i - 1].id;
		}

		/** Coloring selected countries on the map. */
		features.forEach(function (f) {
			f.setStyle(styleFunction(f));
		});

		/** Event listener for clicking on quiz numbers to zoom to countries. */
		$(".quizNumber").click(function () {
			zoomCountry();
		});
	}
}

/** Layer for highlighting countries when hovered over. */
var featureOverlay = new ol.layer.Vector({
	source: new ol.source.Vector(),
	map: map,
	style: function (feature) {
		var highlightStyle;
		highlightStyle = new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: "#f48c42",
				width: 1,
			}),
			fill: new ol.style.Fill({
				color: "#fcf094",
			}),
			zIndex: 2,
		});
		return highlightStyle;
	},
});

var highlight;

/** Function to display country information when hovering over it. */
var displayFeatureInfo = function (pixel) {
	var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
		return feature;
	});
	/** Highlight countries when selected */
	if (feature != undefined && feature.get("name") != "BB") {
		if (feature !== highlight) {
			if (highlight) {
				featureOverlay.getSource().removeFeature(highlight);
			}
			if (feature) {
				featureOverlay.getSource().addFeature(feature);
			}
			highlight = feature;
		}
	}
};

/** Event listener for pointer movement on the map. */
map.on("pointermove", function (evt) {
	if (evt.dragging) {
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	displayFeatureInfo(pixel);
});

// Function for styling countries on the map.
function styleFunction(feature) {
	var color, text;
	var customStyle;

	for (var i = 0; i < numCountries; i++) {
		if (feature.id_ == selectedCountries[i].id) {
			temp = randomColor();
			while (used.indexOf(temp) != -1) {
				temp = randomColor();
			}
			color = temp;
			used[usedIndex] = color;
			usedIndex++;
			text = (i + 1).toString();

			/** Adjusting style for countries in Oceania with bounding boxes. */
			if (continent == "oceania") {
				for (var j = 0; j < bbFeatures.length; j++) {
					if (
						selectedCountries[i].properties.code == bbFeatures[j].get("code")
					) {
						var myColor = ol.color.asArray(color);
						myColor = myColor.slice();
						myColor[3] = 0.3;
						customStyle = new ol.style.Style({
							fill: new ol.style.Fill({
								color: myColor,
							}),
							stroke: new ol.style.Stroke({
								color: "#000000",
								width: 1,
								lineDash: [3.5],
							}),
							text: new ol.style.Text({
								font: "12px Calibri,sans-serif",
								text: text,
								fill: new ol.style.Fill({
									color: "#000000",
								}),
								stroke: new ol.style.Stroke({
									color: "#ffffff",
									width: 2,
								}),
							}),
						});
						bbFeatures[j].setStyle(customStyle);
					}
				}
			}
			break;
		} else {
			color = "rgb(255, 255, 255)";
		}
	}

	/** Default style for countries. */
	customStyle = new ol.style.Style({
		fill: new ol.style.Fill({
			color: color,
		}),
		stroke: new ol.style.Stroke({
			color: "#000000",
		}),
		text: new ol.style.Text({
			font: "12px Calibri,sans-serif",
			text: text,
			fill: new ol.style.Fill({
				color: "#000000",
			}),
			stroke: new ol.style.Stroke({
				color: "#ffffff",
				width: 2,
			}),
		}),
	});
	return customStyle;
}

// Function for zooming to countries when their number is clicked or hovered over.
function zoomCountry() {
	var text = $(event.target).text();
	var number;
	if (text == "10") {
		number = 9;
	} else {
		number = parseInt(text.charAt(0)) - 1;
	}

	/** Custom code for zooming to countries that cross the 180 line (dateline) */
	if (selectedCountries[number].properties.center != 0) {
		var center = selectedCountries[number].properties.center;
		if (center[0] == 0) {
			DefaultZoom();
		} else {
			var zoom = 4.5;
			/** Zoom adjustment for Kiribati. */
			if (center[0] == 191.95312499999997) {
				zoom = 3;
			}
			map.getView().setCenter(center);
			map.getView().setZoom(zoom);
		}
	} else {
		// var extent =   map.getLayers().getArray()[0].getSource().getFeatureById(selectedCountries[number].id).getGeometry().getBounds();
		var extent = map
			.getLayers()
			.getArray()[0]
			.getSource()
			.getFeatureById(selectedCountries[number].id)
			.getGeometry()
			.getExtent();
		//map.ZoomToExtent(extent);
		map.getView().fit(extent, map.getSize());
	}
}

// Functionality for downloading the map image. - capture what is currently showing
document.getElementById("export-png").addEventListener("click", function () {
	map.once("postcompose", function (event) {
		var canvas = event.context.canvas;
		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(canvas.msToBlob(), "map.png");
		} else {
			canvas.toBlob(function (blob) {
				saveAs(blob, "map.png");
			});
		}
	});
	map.renderSync();
});
