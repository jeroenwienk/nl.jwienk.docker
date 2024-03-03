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
    let socket = null;

    try {
      socket = driver.getDeviceById(data.socketId);
    } catch (error) {
      this.error(error);
      throw new Error('Socket not found.');
    }

    await socket.ready();
    const containers = await socket.docker.listContainers({
      all: true,
      filters: { name: [data.name] },
    });
    this.container = socket.docker.getContainer(containers[0].Id);

    const inspect = await this.container.inspect();
    // this.log(inspect);
    this.setCapabilityValue('status', inspect.State.Status).catch(this.error);

    const stream = await socket.docker.getEvents({
      filters: { container: [data.name] },
    });
    this.log('onInit', data.name);
    this.eventStream = stream;

    stream.on('data', (chunk) => {
      const event = JSON.parse(chunk.toString());

      if (eventBlacklist.has(event.status) === false) {
        this.container
          .inspect()
          .then((inspect) => {
            // this.log(inspect);
            this.setCapabilityValue('status', inspect.State.Status).catch(this.error);
          })
          .catch(this.error);
      }

      this.homey.emit('__log', JSON.parse(chunk.toString()));
    });

    stream.on('error', (error) => {
      this.homey.emit('__error', 'stream error', error);
    });

    stream.on('end', () => {
      this.homey.emit('__log', 'stream end');
    });

    // end the stream

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
    //   const exec = await container.exec(options);
    //   const stream = await exec.start();
    //   container.modem.demuxStream(stream, stdout, stderr);

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
