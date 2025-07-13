'use strict';

const Homey = require('homey');
const Docker = require('dockerode');
const { v4: uuidv4 } = require('uuid');

const Flow = require('./flow');

class Driver extends Homey.Driver {
  async onInit() {
    this.flow = new Flow({ homey: this.homey, driver: this });
  }

  async onPair(session) {
    session.setHandler('test_connection', async (data) => {
      const docker = new Docker({
        host: data.host,
        port: data.port,
        ca: data.ca,
        cert: data.cert,
        key: data.key,
      });
      const result = await docker.ping();
      return result.toString();
    });

    session.setHandler('get_id', () => {
      return uuidv4();
    });

    session.setHandler('showView', async (viewId) => {
      this.log('showView', viewId);
    });
  }
}

module.exports = Driver;
