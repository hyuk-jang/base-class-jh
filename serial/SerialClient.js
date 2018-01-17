const serialport = require('serialport');
const EventEmitter = require('events');
const eventToPromise = require('event-to-promise');
/** Class Serial Port 접속 클라이언트 클래스 */
class SerialClient extends EventEmitter {
  /**
   * Serial Port 객체를 생성하기 위한 설정 정보
   * @param {{port: string, baud_rate: number, target_name: string}} config {port, baud_rate, raget_name}
   */
  constructor(config = {
    port,
    baud_rate,
    target_name
  }) {
    super();
    this.client = {};
    this.port = config.port;
    this.baud_rate = config.baud_rate;
    this.target_name = config.target_name;
  }

  _init(client) {
  }

  _onData(bufferData) {
    return this.emit('data', bufferData);
  }

  _onClose() {
    return this.emit('close');
  }

  _onError(err) {
    return this.emit('error', err);
  }

  async connect() {
    this.client = new serialport(this.port, {
      baudRate: this.baud_rate,
    });

    this.client.on('data',  bufferData => {
      this._onData(bufferData);
    });

    this.client.on('close', err => {
      this.client = {};
      this._onClose(err);
    });

    this.client.on('error', error => {
      this._onError(error);
    });

    await eventToPromise.multi(this.client, ['open'], ['error', 'close']);
    return this.client;
  }
}
module.exports = SerialClient;