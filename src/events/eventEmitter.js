// utils/emitter.js
import EventEmitter from 'events';

class AppEmitter extends EventEmitter {}

const emitter = new AppEmitter();
export default emitter;
