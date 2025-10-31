# Docker

## Docker

- [x] docker.createContainer(options) — Docker API Endpoint
- [x] docker.createImage([auth], options) — Docker API Endpoint
- [ ] docker.loadImage(file, options) — Docker API Endpoint
- [ ] docker.importImage(file, options) — Docker API Endpoint
- [ ] docker.buildImage(file, options) — Docker API Endpoint
- [ ] docker.checkAuth(options) — Docker API Endpoint
- [ ] docker.getContainer(id) — Returns a Container object
- [ ] docker.getImage(name) — Returns an Image object
- [ ] docker.getVolume(name) — Returns a Volume object
- [ ] docker.getPlugin(name) — Returns a Plugin object
- [ ] docker.getService(id) — Returns a Service object
- [ ] docker.getTask(id) — Returns a Task object
- [ ] docker.getNode(id) — Returns a Node object
- [ ] docker.getNetwork(id) — Returns a Network object
- [ ] docker.getSecret(id) — Returns a Secret object
- [ ] docker.getConfig(id) — Returns a Config object
- [ ] docker.getExec(id) — Returns an Exec object
- [x] docker.listContainers(options) — Docker API Endpoint
- [x] docker.listImages(options) — Docker API Endpoint
- [ ] docker.listServices(options) — Docker API Endpoint
- [ ] docker.listNodes(options) — Docker API Endpoint
- [ ] docker.listTasks(options) — Docker API Endpoint
- [ ] docker.listSecrets(options) — Docker API Endpoint
- [ ] docker.listConfigs(options) — Docker API Endpoint
- [ ] docker.listPlugins(options) — Docker API Endpoint
- [ ] docker.listVolumes(options) — Docker API Endpoint
- [ ] docker.listNetworks(options) — Docker API Endpoint
- [ ] docker.createSecret(options) — Docker API Endpoint
- [ ] docker.createConfig(options) — Docker API Endpoint
- [ ] docker.createPlugin(options) — Docker API Endpoint
- [ ] docker.createVolume(options) — Docker API Endpoint
- [ ] docker.createService(options) — Docker API Endpoint
- [ ] docker.createNetwork(options) — Docker API Endpoint
- [ ] docker.pruneImages(options) — Docker API Endpoint
- [ ] docker.pruneBuilder() — Docker API Endpoint
- [ ] docker.pruneContainers(options) — Docker API Endpoint
- [ ] docker.pruneVolumes(options) — Docker API Endpoint
- [ ] docker.pruneNetworks(options) — Docker API Endpoint
- [ ] docker.searchImages(options) — Docker API Endpoint
- [x] docker.info() — Docker API Endpoint
- [x] docker.version() — Docker API Endpoint
- [ ] docker.ping() — Docker API Endpoint
- [ ] docker.df() — Docker API Endpoint
- [ ] docker.getEvents(options) — Docker API Endpoint
- [ ] docker.swarmInit(options) — Docker API Endpoint
- [ ] docker.swarmJoin(options) — Docker API Endpoint
- [ ] docker.swarmLeave(options) — Docker API Endpoint
- [ ] docker.swarmUpdate(options) — Docker API Endpoint
- [ ] docker.swarmInspect() — Docker API Endpoint
- [ ] docker.pull(repoTag, options, callback, auth) — Like Docker’s CLI pull
- [ ] docker.pullAll(repoTag, options, callback, auth) — Like Docker’s CLI pull with "-a"
- [ ] docker.run(image, cmd, stream, createOptions, startOptions) — Like Docker’s CLI run

## Container

- [x] container.inspect(options) — Docker API Endpoint
- [x] container.rename(options) — Docker API Endpoint
- [x] container.update(options) — Docker API Endpoint
- [x] container.top(options) — Docker API Endpoint
- [x] container.changes() — Docker API Endpoint
- [ ] container.export() — Docker API Endpoint
- [x] container.start(options) — Docker API Endpoint
- [x] container.stop(options) — Docker API Endpoint
- [x] container.pause(options) — Docker API Endpoint
- [x] container.unpause(options) — Docker API Endpoint
- [ ] container.exec(options) — Docker API Endpoint
- [ ] container.commit(options) — Docker API Endpoint
- [x] container.restart(options) — Docker API Endpoint
- [x] container.kill(options) — Docker API Endpoint
- [ ] container.resize(options) — Docker API Endpoint
- [ ] container.attach(options) — Docker API Endpoint
- [x] container.wait(options) — Docker API Endpoint
- [x] container.remove(options) — Docker API Endpoint
- [ ] container.getArchive(options) — Docker API Endpoint
- [ ] container.infoArchive(options) — Docker API Endpoint
- [ ] container.putArchive(file, options) — Docker API Endpoint
- [x] container.logs(options) — Docker API Endpoint
- [x] container.stats(options) — Docker API Endpoint

## Exec

- [ ] exec.start(options) — Docker API Endpoint
- [ ] exec.resize(options) — Docker API Endpoint
- [ ] exec.inspect() — Docker API Endpoint

## Image

- [ ] image.inspect(options) — Docker API Endpoint
- [ ] image.history() — Docker API Endpoint
- [ ] image.push(options, callback, auth) — Docker API Endpoint
- [ ] image.tag(options) — Docker API Endpoint
- [ ] image.remove(options) — Docker API Endpoint
- [ ] image.get() — Docker API Endpoint

## Network

- [ ] network.inspect() — Docker API Endpoint
- [ ] network.remove(options) — Docker API Endpoint
- [ ] network.connect(options) — Docker API Endpoint
- [ ] network.disconnect(options) — Docker API Endpoint

## Node

- [ ] node.inspect() — Docker API Endpoint
- [ ] node.remove(options) — Docker API Endpoint
- [ ] node.update(options) — Docker API Endpoint

## Plugin

- [ ] plugin.privileges() — Docker API Endpoint
- [ ] plugin.pull(options) — Docker API Endpoint
- [ ] plugin.inspect() — Docker API Endpoint
- [ ] plugin.remove(options) — Docker API Endpoint
- [ ] plugin.enable(options) — Docker API Endpoint
- [ ] plugin.disable(options) — Docker API Endpoint
- [ ] plugin.update([auth], options) — Docker API Endpoint
- [ ] plugin.push(options) — Docker API Endpoint
- [ ] plugin.configure(options) — Docker API Endpoint

## Secret

- [ ] secret.inspect() — Docker API Endpoint
- [ ] secret.remove() — Docker API Endpoint
- [ ] secret.update(options) — Docker API Endpoint

## Service

- [ ] service.inspect() — Docker API Endpoint
- [ ] service.remove(options) — Docker API Endpoint
- [ ] service.update(options) — Docker API Endpoint
- [ ] service.logs(options) — Docker API Endpoint

## Task

- [ ] task.inspect() — Docker API Endpoint
- [ ] task.logs(options) — Docker API Endpoint

## Volume

- [ ] volume.inspect() — Docker API Endpoint
- [ ] volume.remove(options) — Docker API Endpoint
