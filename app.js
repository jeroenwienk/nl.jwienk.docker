'use strict';

const Homey = require('homey');
// const Docker = require('dockerode');

class MyApp extends Homey.App {
  async onInit() {
    // const docker = new Docker({ host: 'http://192.168.178.123', port: 2375 });
    // const result = await docker.info();
    // this.log(result);
  }
}

module.exports = MyApp;
