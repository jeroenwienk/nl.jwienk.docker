'use strict';

const Homey = require('homey');
const Docker = require('dockerode');

class Device extends Homey.Device {
  async onInit() {
    const store = this.getStore();
    this.docker = new Docker({
      protocol: 'https',
      host: store.host,
      port: store.port,
      ca: store.ca,
      cert: store.cert,
      key: store.key,
    });

    this.docker
      .info()
      .then((info) => {
        this.log(info);
      })
      .catch(this.error);
  }
}

module.exports = Device;
