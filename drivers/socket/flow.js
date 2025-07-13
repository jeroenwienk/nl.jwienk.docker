class Flow {
  /**
   * @param {object} options
   * @param {import('@types/homey/lib/Homey')} options.homey
   * @param {import('./driver')} options.driver
   */
  constructor({ homey, driver }) {
    this.homey = homey;
    this.driver = driver;

    this.homey.flow.getActionCard('socket_info').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const result = await args.device.docker.info();

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_version').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const result = await args.device.docker.version();

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_containers_list').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const result = await args.device.docker.listContainers({ all: true });

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_containers_list_running').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const result = await args.device.docker.listContainers();

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_images_list').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const result = await args.device.docker.listImages();

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_container_create').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const options = JSON.parse(args.options);

        const result = await args.device.docker.createContainer({
          name: args.name,
          ...options,
        });

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_container_start').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const container = args.device.docker.getContainer(args.name);
        const result = await container.start();

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_container_stop').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const container = args.device.docker.getContainer(args.name);
        const result = await container.stop({ t: args.t });

        if (state.manual === true) {
          return {
            response: JSON.stringify(result, null, 2),
          };
        }

        return {
          response: JSON.stringify(result),
        };
      }
    );

    this.homey.flow.getActionCard('socket_image_create').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const options = JSON.parse(args.options);

        const result = await args.device.docker.createImage({
          ...options,
        });

        const stream = result;
        stream.pipe(process.stdout);

        if (state.manual === true) {
          return {
            response: JSON.stringify({}, null, 2),
          };
        }

        return {
          response: JSON.stringify({}),
        };
      }
    );

    // list images, containers, volumes, networks

    // {
    //   "id": "df",
    //   "title": {
    //     "en": "Get data usage information"
    //   },
    //   "titleFormatted": {
    //     "en": "Get data usage information"
    //   },
    //   "tokens": [
    //     {
    //       "name": "response",
    //       "type": "string",
    //       "title": {
    //         "en": "Response"
    //       }
    //     }
    //   ]
    // }
    // this.homey.flow.getActionCard('df').registerRunListener(
    //   /**
    //    * @param {object} args
    //    * @param {import('./device')} args.device
    //    * @param {object} state
    //    * @param {boolean} [state.manual]
    //    * @returns {Promise<{ response: string }>}
    //    */
    //   async (args, state) => {
    //     const result = await args.device.docker.df();

    //     if (state.manual === true) {
    //       return {
    //         response: JSON.stringify(result, null, 2),
    //       };
    //     }

    //     return {
    //       response: JSON.stringify(result),
    //     };
    //   }
    // );
  }
}

module.exports = Flow;
