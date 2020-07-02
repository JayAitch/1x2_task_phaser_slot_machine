# Task #

Given a set of symbol assets and dummy responses create your own very simple slot machine.

Your simple slot machine should do the following:

* Load & display all the symbols in the /assets folder
* Display the players balance & stake amount (starting balance can be whatever you decide)
* Display a button which simulates a 'spin' such that it does the following:
	* Deducts players stake from the current balance
	* Randomly selectes a dummy JSON response from the responses I have provided
	* From the response calculate if there was a win, if so add that to the players balance, play the 'win' animations for the correct winning symbols and display the win amount
	* The button must remain disabled until all this has been completed.

* have setup a basic Phaser game setup for you which contains the SpinePlugin needed to handle the assets.