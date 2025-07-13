'use strict';

const Homey = require('homey');
// const { Writable } = require('node:stream');

const eventBlacklist = new Set([
  'exec_create',
  'exec_detach',
  'exec_start',
  'exec_die',
  'attach',
  'commit',
  'copy',
  'detach',
  'export',
  'top',
]);

class Device extends Homey.Device {
  async onInit() {
    const data = this.getData();
    const driver = this.homey.drivers.getDriver('socket');
    await driver.ready();
    /** @type {import('../socket/device')} */
    let socket = null;

    try {
      socket = driver.getDeviceById(data.socketId);
    } catch (error) {
      this.error(error);
      throw new Error('Socket Not Found');
    }

    await socket.ready();
    const containers = await socket.docker.listContainers({
      all: true,
      filters: { name: [`^/${data.name}$`] },
    });
    this.container = socket.docker.getContainer(containers[0].Id);

    const setupEventStream = async () => {
      try {
        this.log('Setting up Docker event stream for', data.name);
        if (this.eventStream != null) {
          this.eventStream.destroy();
          this.eventStream = null;
        }

        const stream = await socket.docker.getEvents({
          filters: { container: [data.name] },
        });
        const inspect = await this.container.inspect();
        this.setCapabilityValue('status', inspect.State.Status).catch(this.error);
        this.eventStream = stream;

        stream.on('data', async (chunk) => {
          let event;
          try {
            event = JSON.parse(chunk.toString());
          } catch (err) {
            this.error('Failed to parse Docker event:', err);
            return;
          }

          if (!eventBlacklist.has(event.status)) {
            try {
              const inspect = await this.container.inspect();
              this.setCapabilityValue('status', inspect.State.Status).catch(this.error);
            } catch (err) {
              this.error('Failed to inspect container on event:', err);
            }
          }

          this.homey.emit('__log', event);
        });

        stream.on('error', (error) => {
          this.homey.emit('__error', 'stream error', error);
          this.retryEventStream(setupEventStream);
        });

        stream.on('end', () => {
          this.homey.emit('__log', 'stream ended, reconnecting...');
          this.retryEventStream(setupEventStream);
        });
      } catch (err) {
        if (err.statusCode === 404) {
          this.error(err);
          return;
        }
        this.error('Failed to set up Docker event stream:', err);
        this.retryEventStream(setupEventStream);
      }
    };

    this.retryEventStream = (reconnectFn, delay = 5000) => {
      if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
      this._reconnectTimer = setTimeout(() => {
        reconnectFn().catch(this.error);
      }, delay);
    };

    setupEventStream().catch(this.error);

    this.registerCapabilityListener('button.start', async (value, opts) => {
      this.log(value);
      this.log(opts);
      try {
        await this.container.start();
      } catch (error) {
        if (error.statusCode === 304) {
          // throw new Error(error.message);
          return;
        }

        throw error;
      }
    });

    this.registerCapabilityListener('button.stop', async (value, opts) => {
      this.log(value);
      this.log(opts);
      try {
        await this.container.stop();
      } catch (error) {
        if (error.statusCode === 304) {
          // throw new Error(error.message);
          return;
        }

        throw error;
      }
    });

    this.registerCapabilityListener('button.pause', async (value, opts) => {
      this.log(value);
      this.log(opts);
      await this.container.pause();
    });

    this.registerCapabilityListener('button.unpause', async (value, opts) => {
      this.log(value);
      this.log(opts);
      await this.container.unpause();
    });

    this.registerCapabilityListener('button.restart', async (value, opts) => {
      this.log(value);
      this.log(opts);
      await this.container.restart();
    });

    this.registerCapabilityListener('button.kill', async (value, opts) => {
      this.log(value);
      this.log(opts);
      await this.container.kill();
    });

    // var options = {
    //   Cmd: ['bash', '-c', 'echo test $VAR'],
    //   Env: ['VAR=ttslkfjsdalkfj'],
    //   AttachStdout: true,
    //   AttachStderr: true,
    // };

    // const stdout = new Writable({
    //   write: (chunk, encoding, next) => {
    //     this.homey.emit('__log', chunk.toString());
    //     next();
    //   },
    // });

    // const stderr = new Writable({
    //   write: (chunk, encoding, next) => {
    //     this.homey.emit('__error', chunk.toString());
    //     next();
    //   },
    // });

    // (async () => {
    //   const exec = await this.container.exec(options);
    //   const stream = await exec.start();
    //   this.container.modem.demuxStream(stream, stdout, stderr);

    //   stream.on('error', (err) => {
    //     this.homey.emit('__error', 'stream error', err);
    //   });

    //   stream.on('end', () => {
    //     this.homey.emit('__log', 'stream end');
    //   });

    //   const data = await exec.inspect();
    //   this.log(data);
    // })().catch(this.error);
  }

  onDeleted() {
    this.log('onDeleted');
    this.eventStream?.destroy();
  }

  onUninit() {
    this.log('onUninit');
    this.eventStream?.destroy();
  }
}

module.exports = Device;
