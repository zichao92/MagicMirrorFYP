/* Timetable for Paris local transport Module */
/* Magic Mirror
 * Module: MMM-Ratp
 *
 * By Louis-Guillaume MORAND
 * based on a script from Benjamin Angst http://www.beny.ch and Georg Peters (https://lane6.de)
 * MIT Licensed.
 */
const NodeHelper = require("node_helper");
const forge = require('node-forge');
const unirest = require('unirest');
const exec = require('child_process').exec;


module.exports = NodeHelper.create({

    updateTimer: "",
    start: function() {
        this.started = false;
        console.log("Chao NodeHelper started");
    },


    /* updateTimetable(transports)
     * Calls processTransports on succesfull response.
     */
    updateTimetable: function() {
        var url = this.config.apiURL;
        var self = this;
        var retry = false;
        exec("sudo python /home/pi/NicoRFID/RFID_playlist.py");// RFID


        // calling this API
        unirest.get(url).headers({'AccountKey': '8xyv+XamTAKMghArQ87bqA==',
               'UniqueUserID': '1ec0d00e-1948-4277-a1f9-3363adfd3f7d',
               'accept': 'application/json'})
            .end(function(r) {
                if (r.error) {
                    console.log(self.name + " : " + r.error);
                    retry = true;
                } else {
                    self.processTransports(r.body);

                }

                if (retry) {
                    console.log("retrying");
                    self.scheduleUpdate((self.loaded) ? -1 : this.config.retryDelay);
                }
            });
    },

   
    processTransports: function(data) {

        this.transports = [];
        var BusNo = data.Services[0].ServiceNo;
        var NextBus_raw = data.Services[0].NextBus.EstimatedArrival;
        var SubsequentBus1_raw = data.Services[0].SubsequentBus.EstimatedArrival;
        var SubsequentBus2_raw = data.Services[0].SubsequentBus3.EstimatedArrival;

        NextBus_raw.toString();
        SubsequentBus1_raw.toString();
        SubsequentBus2_raw.toString();

        NextBus = NextBus_raw.slice(11,19);
        SubsequentBus1 = SubsequentBus1_raw.slice(11,19);
        SubsequentBus2 = SubsequentBus2_raw.slice(11,19);

        this.transports.push({
            time: NextBus,
            time2: SubsequentBus1,
            time3: SubsequentBus2
            /*
            More to come
            */
        });

      
        this.loaded = true;
        this.sendSocketNotification("TRANSPORTS", {
            transports: this.transports,
            lineInfo: "179"
        });
    },


    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;

        if (typeof delay !== "undefined" && delay > 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setInterval(function() {
            self.updateTimetable();
        }, nextLoad);
    },

    socketNotificationReceived: function(notification, payload) {
        if (payload.debugging) {
            console.log("Notif received: " + notification);
            console.log(payload);
        }

        const self = this;
        if (notification === 'CONFIG' && this.started == false) {
            this.config = payload;
            this.started = true;
            self.scheduleUpdate(this.config.initialLoadDelay);
        }
    }
});
