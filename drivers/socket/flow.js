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

    this.homey.flow.getActionCard('socket_container_action').registerRunListener(
      /**
       * @param {object} args
       * @param {import('./device')} args.device
       * @param {string} args.name
       * @param {string} args.action
       * @param {object} args.options
       * @param {object} state
       * @param {boolean} [state.manual]
       * @returns {Promise<{ response: string }>}
       */
      async (args, state) => {
        const container = args.device.docker.getContainer(args.name);
        let result;
        if (args.options == null || args.options.trim() === '') {
          args.options = '{}';
        }
        const options = JSON.parse(args.options);

        switch (args.action) {
          case 'inspect':
            result = await container.inspect(options);
            break;
          case 'start':
            result = await container.start(options);
            break;
          case 'stop':
            result = await container.stop(options);
            break;
          case 'restart':
            result = await container.restart(options);
            break;
          case 'kill':
            result = await container.kill(options);
            break;
          case 'pause':
            result = await container.pause(options);
            break;
          case 'unpause':
            result = await container.unpause(options);
            break;
          case 'rename':
            result = await container.rename(options);
            break;
          case 'update':
            result = await container.update(options);
            break;
          case 'top':
            result = await container.top(options);
            break;
          case 'changes':
            result = await container.changes(options);
            break;
          // case 'export':
          //   result = await container.export(options);
          //   break;
          case 'wait':
            result = await container.wait(options);
            break;
          case 'remove':
            result = await container.remove(options);
            break;
          case 'logs':
            function decodeDockerStream(buf) {
              let i = 0;
              let stdout = '';
              let stderr = '';

              while (i + 8 <= buf.length) {
                const streamType = buf[i];
                const payloadLength = buf.readUInt32BE(i + 4);
                const start = i + 8;
                const end = start + payloadLength;
                if (end > buf.length) break;

                const chunk = buf.toString('utf8', start, end);
                if (streamType === 1) stdout += chunk;
                else if (streamType === 2) stderr += chunk;

                i = end;
              }

              return { stdout, stderr };
            }

            result = await container.logs(options);
            // If the result is a buffer, convert it to a string.
            if (Buffer.isBuffer(result)) {
              result = decodeDockerStream(result);
            }
            break;
          case 'stats':
            if (options.stream === undefined) {
              options.stream = false;
            }

            result = await container.stats(options);
            break;
          default:
            this.driver.log('Unknown action', args.action);
            throw new Error('Unknown action');
        }

        if (result == null) {
          result = {};
        }

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
