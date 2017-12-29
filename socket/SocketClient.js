const net = require('net');
const EventEmitter = require('events');
const eventToPromise = require('event-to-promise');
const classModule = require('../classModule')

class BaseSocketClient extends EventEmitter {
  constructor(port, host) {
    super();
    this.port = port;
    this.host = host;

    this.client = {};
  }

  _initSocket(client) {
  }

  /**
   * Buffer 데이터 돌려줌
   * @param {Buffer} bufferData
   * @return {EventEmitter} Buffer
   */
  _onData(bufferData) {
    return this.emit('data', bufferData);
  }

  _onUsefulData(err, data) {
  }

  _onClose(err) {
    return this.emit('close', err);
  }


  async connect(port, host) {
    // BU.CLI(port, host)
    // BU.CLI('@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    if (port !== 0 && port != null) {
      this.port = port;
    }

    if (host !== '' && host != null) {
      this.host = host ? host : 'localhost';
    }
    this.host = this.host || 'localhost';
    

    this.client = net.createConnection(this.port, this.host);
    this._initSocket(this.client);

    this.client.on('data', bufferData => {
      // BU.CLI('@@@@@@@@@@@@@@', data.toString());
      this._onData(bufferData);
    });

    this.client.on('close', error => {
      this.client = {};
      this._onClose(error);
    })

    this.client.on('end', () => {
      console.log('Client disconnected');
      this.client = {};
      this._onClose('err');
    });

    this.client.on('error', error => {
      this.client = {};
      this._onClose(error);
    })
    await eventToPromise.multi(this.client, ['connect', 'connection', 'open'], ['close, error'])
    return this.client;
  }
}

module.exports = BaseSocketClient;