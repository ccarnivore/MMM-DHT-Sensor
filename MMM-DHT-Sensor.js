/* global Module */
/* Magic Mirror
 * Module: MMM-DHT-Sensor
 * MIT Licensed.
 */
Module.register('MMM-DHT-Sensor', {

    defaults: {
        sensorPIN: 4,
        sensorType: 11, // 11 OR 22
        fanPIN: 11,
        fanTemperature: 30.0,
        updateInterval: 2000, // in milliseconds
        animationSpeed: 0, // in milliseconds
        titleText: "Sensor",
        units: config.units
    },

    start: function() {
        this.humidity = this.temperature = '...';
        this.fan = false;
        this.sendSocketNotification('CONFIG', this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'DHT_TEMPERATURE') {
            this.temperature = payload;
            this.updateDom(this.config.animationSpeed);
        }
        if (notification === 'DHT_HUMIDITY') {
            this.humidity = payload;
            this.updateDom(this.config.animationSpeed);
        }
        if (notification === 'DHT_FAN') {
            this.fan = payload;
            this.updateDom(this.config.animationSpeed);
        }
    },

    getStyles: function() {
        return ['MMM-DHT-Sensor.css', 'font-awesome.css'];
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = 'dhtContainer';

        wrapper.appendChild(document.createTextNode(this.config.titleText));

        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(this.getValueElem(1, this.temperature));

        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(this.getValueElem(2, this.humidity));

        wrapper.appendChild(document.createElement('br'));
        wrapper.appendChild(this.getValueElem(3, this.fan));

        return wrapper;
    },

    getValueElem: function(type, value) {
        var icon = document.createElement("i");
        icon.className = 'fa fa-' + (type == 1 ? 'thermometer-1' : type == 2 ? 'tint' : 'spinner') + ' dht-icon';

        var metric = this.config.units === 'metric';
        var val = ((type == 1) ? (metric ? value : (value * 9 / 5 + 32.0)) : type == 2 ? value : value == true ? 'On' : 'Off');
        var sufix = type == 1 ? (metric ? "°C" : "°F") : type == 2 ? " %" : "";

        var text = document.createTextNode(" " + val + sufix);
        text.className = 'dht-text';

        var div = document.createElement("div");
        div.appendChild(icon);
        div.appendChild(text);
        div.className = "dht";

        return div;
    }
});
