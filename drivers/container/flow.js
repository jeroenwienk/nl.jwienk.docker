class Flow {
  constructor({ homey, driver }) {
    this.homey = homey;
    this.driver = driver;

    this.homey.flow.getActionCard('container_button').registerRunListener(async (args, state) => {
      switch (args.button) {
        case 'start':
          await args.device.container.start();
          break;
        case 'stop':
          await args.device.container.stop();
          break;
        case 'restart':
          await args.device.container.restart();
          break;
        case 'kill':
          await args.device.container.kill();
          break;
        case 'pause':
          await args.device.container.pause();
          break;
        case 'unpause':
          await args.device.container.unpause();
          break;
        default:
          this.driver.log('Unknown button', args.button);
          break;
      }

      return true;
    });

    this.homey.flow.getActionCard('container_inspect').registerRunListener(async (args, state) => {
      const result = await args.device.container.inspect();

      if (state.manual === true) {
        return {
          response: JSON.stringify(result, null, 2),
        };
      }

      return {
        response: JSON.stringify(result),
      };
    });

    this.homey.flow.getActionCard('container_stats').registerRunListener(async (args, state) => {
      const result = await args.device.container.stats({ stream: false });

      if (state.manual === true) {
        return {
          response: JSON.stringify(result, null, 2),
        };
      }

      return {
        response: JSON.stringify(result),
      };
    });

    this.homey.flow.getActionCard('container_top').registerRunListener(async (args, state) => {
      const result = await args.device.container.top();

      if (state.manual === true) {
        return {
          response: JSON.stringify(result, null, 2),
        };
      }

      return {
        response: JSON.stringify(result),
      };
    });
  }
}

module.exports = Flow;
