/* global Log, Module, moment */

/* Magic Mirror
 * Module: Compliments
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("compliments",{

	// Module config defaults.
	defaults: {
		compliments: {
			morning: [
				"Good morning, handsome!",
				"Enjoy your day!",
				"How was your sleep?"
			],
			afternoon: [
				"Hello, beauty!",
				"You look sexy!",
				"Looking good today!"
			],
			evening: [
				"Wow, you look hot!",
				"You look nice!",
				"Hi, sexy!"
			]
		},
		updateInterval: 30000,
		fadeSpeed: 4000
	},




	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},
	getStyles: function() {
	    return [
	        'script.css', // will try to load it from the vendor folder, otherwise it will load is from the module folder.
	    ]
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);

		this.lastComplimentIndex = -1;

		// Schedule update timer.
		var self = this;
		setInterval(function() {
			self.updateDom(self.config.fadeSpeed);
		}, this.config.updateInterval);
	},

	/* randomIndex(compliments)
	 * Generate a random index for a list of compliments.
	 *
	 * argument compliments Array<String> - Array with compliments.
	 *
	 * return Number - Random index.
	 */
	randomIndex: function(compliments) {
		if (compliments.length === 1) {
			return 0;
		}

		var generate = function() {
			return Math.floor(Math.random() * compliments.length);
		};

		var complimentIndex = generate();

		while (complimentIndex === this.lastComplimentIndex) {
			complimentIndex = generate();
		}

		this.lastComplimentIndex = complimentIndex;

		return complimentIndex;
	},

	/* complimentArray()
	 * Retrieve an array of compliments for the time of the day.
	 *
	 * return compliments Array<String> - Array with compliments for the time of the day.
	 */
	complimentArray: function() {
		var hour = moment().hour();

		if (hour >= 3 && hour < 12) {
			return this.config.compliments.morning;
		} else if (hour >= 12 && hour < 17) {
			return this.config.compliments.afternoon;
		} else {
			return this.config.compliments.evening;
		}
	},

	/* complimentArray()
	 * Retrieve a random compliment.
	 *
	 * return compliment string - A compliment.
	 */
	randomCompliment: function() {
		var compliments = this.complimentArray();
		var index = this.randomIndex(compliments);

		return compliments[index];
	},

	// Override dom generator.
	getDom: function() {
		//var complimentText = this.randomCompliment();
		//var complimentText = "Hi NUS GOD Puay Hiang ";

		//var compliment = document.createTextNode(complimentText);
		var wrapper = document.createElement("div");
		wrapper.className = "thin xlarge bright";


		wrapper.innerHTML='<div class="video-background"> <div class="video-foreground"><iframe src="https://www.youtube.com/embed/5kIe6UZHSXw?controls=0&showinfo=0&rel=0&autoplay=1" allowscriptaccess="always" name="my-video" frameborder="0" enablejsapi=1&version=3&playerapiid=ytplayer" type="application/x-shockwave-flash"> allowfullscreen></iframe></div></div>';

		function playthevideo(){

		var myPlayer = document.getElementById('my-video');
		myPlayer.playVideo();

		}
		function stopthevideo(){

		var myPlayer = document.getElementById('my-video');
		myPlayer.stopVideo();

		}

		function pausethevideo(){
		var myPlayer = document.getElementById('my-video'); 
		myPlayer.pauseVideo();

		}


			
		//wrapper.appendChild(compliment);

		return wrapper;
	}

});

//enablejsapi=1&version=3&playerapiid=ytplayer" type="application/x-shockwave-flash">
//https://www.youtube.com/embed/W0LHTWG-UmQ?controls=0&showinfo=0&rel=0&autoplay=1&loop=1&playlist=W0LHTWG-UmQ
//<iframe width="560" height="315" src="https://www.youtube.com/embed/5kIe6UZHSXw" frameborder="0" allowfullscreen></iframe>
