'use strict';

const Homey = require('homey');
const Flow = require('./flow');
const { v4: uuidv4 } = require('uuid');

class Driver extends Homey.Driver {
  async onInit() {
    this.flow = new Flow({ homey: this.homey, driver: this });
  }

  async onPair(session) {
    session.setHandler('get_sockets', async () => {
      const devices = this.homey.drivers.getDriver('socket').getDevices();
      return devices.map((device) => {
        // Ensure we dont accidently use the SDK serializer for a device.
        return {
          id: device.getId(),
          name: device.getName(),
        };
      });
    });

    session.setHandler('get_containers', async ({ socketId }) => {
      const device = this.homey.drivers.getDriver('socket').getDeviceById(socketId);
      const containers = await device.docker.listContainers({ all: true });

      return containers.map((container) => {
        return {
          id: container.Id,
          // All names have a leading slash for some reason.
          name: container.Names[0].substring(1),
          state: container.State,
        };
      });
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
