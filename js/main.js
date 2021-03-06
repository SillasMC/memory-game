$(document).ready(function() {
	// Global variables
	var $powerButton	= $("#power-button-id");
	var isGameTurnedOn	= getPowerButtonStatus();
	var $strictButton	= $("#strict-button-id");
	var isStrict		= getStrictButtonStatus();
	var $displayDiv		= $("#display-div-id");
	var $startButton	= $("#start-button-id");
	var isGameStart		= isGameTurnedOn;
	var isPlayerTurn	= false;

	var gameOver			= false;
	var moveTime			= 800;
	var afterMoveTime		= 150;
	var positions			= [];
	var playerPositions		= [];
	var speedUpNumbers		= [5, 9, 13];
	var winScore			= 20;

	var timeOutPlayerMove;
	var timeOutSequence;
	var timeOutGameStart;

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
			if (isGameTurnedOn && isGameStart && isPlayerTurn) {
				playerPositions.push(index);
				clearTimeout(timeOutPlayerMove);

				if (checkPlayerSequence()) {
					clickColorButtons(index);
				}
				else {
					playerError();
					isPlayerTurn = false;
				}
			}
		});

		// Release mouse ends animation and sound
		element.selector.on("mouseup", function () {
			if (isGameTurnedOn && isGameStart && isPlayerTurn) {
				var timeOut = setTimeout(function () { releaseColorButtons(index); }, 200);
				if (playerPositions.length === positions.length) {
					if (positions.length === winScore) {
						gameOver = true;
						setTimeout(endGame, 500);
					} else {
						isPlayerTurn = false;
						setTimeout(function () { showSequence(Math.floor(Math.random() * 4)); }, 500);
					}
				}
				else {
					timeOutPlayerMove = setTimeout(playerError, 5000);
				}
			}
		});
	});

	// Turn off button and clear future actions
	function turnOffLights () {
		_buttons.forEach(function (element, index) {
			releaseColorButtons(index);
			element.selector.clearQueue();
		});
	}

	function turnOnLights () {
		_buttons.forEach(function (element, index) {
			clickColorButtons(index);
		});
	}

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
		turnOffLights();
		isGameStart = false;
		clearTimeout(timeOutPlayerMove);
		clearTimeout(timeOutSequence);
		clearTimeout(timeOutGameStart);
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
		component.delay(delay).show(1, function () { component.html(showTxt); });
	}

	function turnOffDisplay () {
		$displayDiv.clearQueue();
		$displayDiv.text("");
	}

	// Start button action
	$startButton.on("click", function () {

		isGameStart = false;

		if (isGameTurnedOn) {

			delayAndShow($displayDiv, 150, "00");
			gameStart();
		}
	});

	// Show victory and start game again
	function endGame () {
		turnOnLights();
		var times = 20;

		for (var i = 0; i < times; i++) {
			delayAndShow($displayDiv, 150, "");
			delayAndShow($displayDiv, 150, formatNumber(winScore));
		}

		timeOutGameStart = setTimeout(gameStart, times * 300);
	}

	// Start a new game
	function gameStart () {

		turnOffDisplay();
		turnOffLights();

		clearTimeout(timeOutPlayerMove);
		clearTimeout(timeOutSequence);
		clearTimeout(timeOutGameStart);

		isGameStart			= true;
		isPlayerTurn		= false;
		gameOver			= false;
		positions			= [];
		playerPositions		= [];
		moveTime			= 800;
		afterMoveTime		= 150;

		timeOutGameStart = setTimeout(function () { showSequence(Math.floor(Math.random() * 4)); }, 500);
	}

	// Generate a random move for the player to mimic
	function showSequence (randMove) {
		if (isGameTurnedOn) {
			if (randMove >= 0) {
				positions.push(randMove);
			}
			delayAndShow($displayDiv, 10, formatNumber(positions.length));

			// Speed up the game
			if (speedUpNumbers.indexOf(positions.length) >= 0) {
				moveTime -= 200;
			}

			playSequenceButton(positions, moveTime, afterMoveTime)

		}
	}

	// Kind of recursive function to play the game sequence
	function playSequenceButton (arrayPos, delayPress, delayInner) {
		var index = arrayPos[0];

		_buttons[index].sound.play();
		_buttons[index].selector.removeClass(_buttons[index].classOff).addClass(_buttons[index].classOn)
			.delay(delayPress).queue(function (next) {
				$(this).removeClass(_buttons[index].classOn).addClass(_buttons[index].classOff);
				next();
			});

		var newArray = arrayPos.slice(1, arrayPos.length);
		if (newArray instanceof Array && newArray.length > 0) {
			timeOutSequence = setTimeout(function () { playSequenceButton(newArray, delayPress, delayInner) }, delayPress + delayInner);
		}
		else {
			isPlayerTurn = true;
			playerPositions = [];

			timeOutPlayerMove = setTimeout(playerError, 5000);
		}
	}

	function formatNumber (number) {
		return ("0" + number).slice(-2);
	}

	// Player made error in sequence or forgot to press buttons
	function playerError () {
		for (var i = 0; i < 3; i++) {
			delayAndShow($displayDiv, 150, "");
			delayAndShow($displayDiv, 150, "XX");
		}

		if (isStrict){
			delayAndShow($displayDiv, 150, "00");
			setTimeout(gameStart, 1500);
		}
		else {
			setTimeout(function () { showSequence(-1); }, 1250);
		}
	}

	function checkPlayerSequence () {
		var result = true;

		playerPositions.forEach(function (value, index) {
			if (value != positions[index]) {
				result = false;
			}
		});

		return result;
	}
});
