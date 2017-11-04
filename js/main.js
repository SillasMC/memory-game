$(document).ready(function() {
	// Global variables
	var $powerButton	= $("#power-button-id");
	var isGameTurnedOn	= getPowerButtonStatus();
	var $strictButton	= $("#strict-button-id");
	var isStrict		= getStrictButtonStatus();

	// Get Status of the power button
	function getPowerButtonStatus () {
		return $powerButton.hasClass("power-switch-active");
	}

	function turnOffGame () {
		$powerButton.removeClass("power-switch-active");
		$powerButton.addClass("power-switch");

		//Turn off other elements
		turnOffStrict();
	}

	// Power button action
	$powerButton.on("click", function () {
		if (isGameTurnedOn) {
			turnOffGame();
		}
		else {
			$powerButton.removeClass("power-switch");
			$powerButton.addClass("power-switch-active");
		}

		isGameTurnedOn = !isGameTurnedOn;
	});

	// Get Status of the strict button
	function getStrictButtonStatus () {
		return $strictButton.hasClass("strict-div-active");
	}

	function turnOnStrict () {
		$strictButton.removeClass("strict-div");
		$strictButton.addClass("strict-div-active");
	}

	function turnOffStrict () {
		$strictButton.removeClass("strict-div-active");
		$strictButton.addClass("strict-div");
	}

	// Strict button action
	$strictButton.on("click", function () {
		if (isGameTurnedOn) {
			if (isStrict) {
				turnOffStrict();
			}
			else {
				turnOnStrict();
			}

			isStrict = !isStrict;
		}
	});
});
