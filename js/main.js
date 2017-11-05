$(document).ready(function() {
	// Global variables
	var $powerButton	= $("#power-button-id");
	var isGameTurnedOn	= getPowerButtonStatus();
	var $strictButton	= $("#strict-button-id");
	var isStrict		= getStrictButtonStatus();
	var $displayDiv		= $("#display-div-id");
	var $startButton	= $("#start-button-id");
	var isGameStart		= isGameTurnedOn;

	var _buttons = [
		{
			id:			"green-btn-id",
			selector:	$("#green-btn-id"),
			classOff:	"green-btn",
			classOn:	"green-btn-active",
			sound:		new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3")
		},
		{
			id:			"red-btn-id",
			selector:	$("#red-btn-id"),
			classOff:	"red-btn",
			classOn:	"red-btn-active",
			sound:		new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
		},
		{
			id:			"yellow-btn-id",
			selector:	$("#yellow-btn-id"),
			classOff:	"yellow-btn",
			classOn:	"yellow-btn-active",
			sound:		new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
		},
		{
			id:			"blue-btn-id",
			selector:	$("#blue-btn-id"),
			classOff:	"blue-btn",
			classOn:	"blue-btn-active",
			sound:		new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
		}
	];

	function clickColorButtons (index) {
		_buttons[index].sound.play();
		_buttons[index].selector.removeClass(_buttons[index].classOff);
		_buttons[index].selector.addClass(_buttons[index].classOn);
	}

	function releaseColorButtons (index) {
		_buttons[index].sound.pause();
		_buttons[index].sound.currentTime = 0;
		_buttons[index].selector.removeClass(_buttons[index].classOn);
		_buttons[index].selector.addClass(_buttons[index].classOff);
	}

	_buttons.forEach(function (element, index) {
		// Mouse click starts animation and sound
		element.selector.on("mousedown", function () {
			if (isGameTurnedOn && isGameStart) {
				clickColorButtons(index);
			}
		});

		// Release mouse ends animation and sound
		element.selector.on("mouseup", function () {
			if (isGameTurnedOn && isGameStart) {
				var timeOut = setTimeout(function () { releaseColorButtons(index); }, 200);
			}
		});
	});

	// Get Status of the power button
	function getPowerButtonStatus () {
		return $powerButton.hasClass("power-switch-active");
	}

	function turnOffGame () {
		$powerButton.removeClass("power-switch-active");
		$powerButton.addClass("power-switch");

		//Turn off other elements
		turnOffStrict();
		turnOffDisplay();
		isGameStart = false;
	}

	function turnOnGame () {
		$powerButton.removeClass("power-switch");
		$powerButton.addClass("power-switch-active");

		//Turn on other elements
		turnOnDisplay();
	}

	// Power button action
	$powerButton.on("click", function () {
		if (isGameTurnedOn) {
			turnOffGame();
		}
		else {
			turnOnGame();
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

		isStrict = true;
	}

	function turnOffStrict () {
		$strictButton.removeClass("strict-div-active");
		$strictButton.addClass("strict-div");

		isStrict = false;
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
		}
	});

	// Animate display when power on
	function turnOnDisplay () {
		delayAndShow($displayDiv, 150, "--");
		delayAndShow($displayDiv, 150, "");
		delayAndShow($displayDiv, 150, "--");
		delayAndShow($displayDiv, 150, "");
		delayAndShow($displayDiv, 150, "--");
	}

	function delayAndShow (component, delay, showTxt) {
		component.delay(delay).show(1, function () { $displayDiv.html(showTxt); });
	}

	function turnOffDisplay () {
		$displayDiv.text("");
	}

	// Start button action
	$startButton.on("click", function () {
		if (isGameTurnedOn) {
			delayAndShow($displayDiv, 150, "00");
			isGameStart = true;

		}
	});
});
