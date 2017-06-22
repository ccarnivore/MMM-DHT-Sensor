'use strict';

/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const RpiDht = require('rpi-dht-sensor');
const GPIO = require('pi-gpio');

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting helper: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        const self = this;
        this.config = payload;

        if (this.config.sensorType === 11) {
            this.dht = new RpiDht.DHT11(this.config.sensorPIN);
        } else if (this.config.sensorType === 22) {
            this.dht = new RpiDht.DHT22(this.config.sensorPIN);
        } else {
            console.log("Error in " + this.name + " sensorType unsupported.");
        }

        setInterval(function() {
            self.checkTemperature();
        }, this.config.updateInterval);
    },

    checkTemperature: function() {
        const self = this;

        GPIO.open(17, "output", function() {
            GPIO.write(17, 1, function() {
                GPIO.close(17);
            })
        });

        var readout = this.dht.read();
        var temp = readout.temperature.toFixed(1);
        var hum = readout.humidity.toFixed(1);


        if (hum > 0) {
            self.sendSocketNotification('DHT_TEMPERATURE', temp);
            self.sendSocketNotification('DHT_HUMIDITY', hum);
        }
    }
});
