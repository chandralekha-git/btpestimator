/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zsapui5/btpestimator/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
