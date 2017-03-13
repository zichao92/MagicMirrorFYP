

/* Magic Mirror
 * Node Helper: Calendar
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

// var NodeHelper = require("node_helper");

// module.exports = NodeHelper.create({
// 	// Override start method.
// 	start: function() {
// 		var self = this;

// 		console.log("Starting node helper for: " + this.name);

// 		this.expressApp.get('/foobar', function (req, res) {
// 	        res.send('GET request to /foobar');
// 	    });

// 	},

// 	// Override socketNotificationReceived method.
// 	socketNotificationReceived: function(notification, payload) {
// 		if (notification === "ADD_CALENDAR") {
// 			//console.log('ADD_CALENDAR: ');
// 			//this.createFetcher(payload.url, payload.fetchInterval, payload.maximumEntries, payload.maximumNumberOfDays, payload.user, payload.pass);
// 		}
// 	},

// 	/* createFetcher(url, reloadInterval)
// 	 * Creates a fetcher for a new url if it doesn't exist yet.
// 	 * Otherwise it reuses the existing one.
// 	 *
// 	 * attribute url string - URL of the news feed.
// 	 * attribute reloadInterval number - Reload interval in milliseconds.
// 	 */
// });


'use strict';

/* Magic Mirror
 * Module: MMM-PIR-Sensor
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const Gpio = require('onoff').Gpio;
const exec = require('child_process').exec;
var csv = require('csv-parser');
var fs = require('fs');
var PythonShell = require('python-shell');
var people; 

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
    this.toggleOn = false;
    
//exec("sudo python /home/pi/NicoRFID/RFID_playlist.py"); // RFID, hk forced it here.

 PythonShell.run('../../../../../home/pi/NicoRFID/RFID_playlist.py', function (err) {
  console.log("Script started!")
  if (err) throw err;
}); 

function csvreader(){
fs.createReadStream('/home/pi/MagicMirror/rfid_log.csv')
  .pipe(csv())
  .on('data', function (data) {
    console.log('People Left: %s ', data.People_left);
    people = data.People_left;
  });
}

setInterval(csvreader,4000);





},

  activateMonitor: function () {
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOnState);
    }
    else if (this.config.relayPIN == false){
      exec("raspistill -vf -hf -o cam.jpg", null);
      console.log("CHAO 2");
      exec("sudo python3 /home/pi/MagicMirror/PrSensor_test_Working.py");

    }
  },

  deactivateMonitor: function () {
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOffState);
    }
    else if (this.config.relayPIN == false){
      exec("", null);
    }
  },






   

  // Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'CONFIG' && this.started == false) {
      const self = this;
      this.config = payload;

      //Setup pins
      this.pir = new Gpio(this.config.sensorPIN, 'in', 'both');
      // exec("echo '" + this.config.sensorPIN.toString() + "' > /sys/class/gpio/export", null);
      // exec("echo 'in' > /sys/class/gpio/gpio" + this.config.sensorPIN.toString() + "/direction", null);

      if (this.config.relayPIN) {
        this.relay = new Gpio(this.config.relayPIN, 'out');
        this.relay.writeSync(this.config.relayOnState);
        console.log("CHAO 4");
        exec("raspistill -vf -hf -o cam.jpg", null);
        console.log('CHAO 1');
      }



      //Detected movement
      this.pir.watch(function(err, value) {
        if (value == 1) {
          if (people==0){
          self.sendSocketNotification("USER_PRESENCE", true);
          if (self.config.powerSaving){
            self.activateMonitor();
          }  
        }
         }
        else if (value == 0) {
          self.sendSocketNotification("USER_PRESENCE", false);
          if (self.config.powerSaving){
            self.deactivateMonitor();
          }
        }
      });

      //add sleep

      this.started = true;

    } else if (notification === 'SCREEN_WAKEUP') {
      this.activateMonitor();
    }
    else if (notification === 'TOGGLE') {
      this.toggleOn = !this.toggleOn;
      if(this.toggleOn){
      	this.activateMonitor();
      }else{
	     this.deactivateMonitor();
      }
	exec('sudo shutdown -h now', opts, function(error, stdout, stderr){ self.checkForExecError(error, stdout, stderr, res); });

    }

  }

});
