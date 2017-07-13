const Service = require('./Service')
const uuid = require('node-uuid')
const EventStream = require('../libs/event-stream/eventStream')
const { Map } = require('immutable')

class StatsService extends Service {
  constructor (ctx) {
    super(ctx)
    this.__streams = Map()
  }

  createStream (eventStreamOpts) {
    let stream = new EventStream(eventStreamOpts)
    let id = uuid.v4()

    this.__streams = this.__streams.set(id, stream)
    return {id, stream}
  }

  getStreams () {
    return this.__streams
  }

  stopStream (id) {
    let stream = this.__streams.get(id)
    if (stream === undefined) {
      return true
    }

    stream.stop()
    this.__streams = this.__streams.delete(id)
    return true
  }
}

module.exports = StatsService
