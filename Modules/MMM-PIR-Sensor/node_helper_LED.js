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

module.exports = NodeHelper.create({
  start: function () {
    this.started = false;
  },

  activateMonitor: function () {
    if (this.config.relayPIN != false) {
      this.relay.writeSync(this.config.relayOnState);
    }
    else if (this.config.relayPIN == false){
      exec("sudo python3 /home/pi/MagicMirror/LED.py", null);
    /* exec("sudo python3 /home/pi/BusScript.py", null);*/     
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
          self.sendSocketNotification("USER_PRESENCE", true);
          if (self.config.powerSaving){
            self.activateMonitor();
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
  }

});
