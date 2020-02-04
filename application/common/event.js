var events = {};

const on = (name, callback) => {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.push(callback);
  } else {
    events[name] = [callback];
  }
}

const off = (name, callback) => {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    if (callback) {
      events[name] = callbacks.filter((_callback) => {
        return _callback != callback;
      });
      return;
    }
    events[name] = [];
  }
}

const emit = (name, ...data) => {
  var callbacks = events[name];
  if (Array.isArray(callbacks)) {
    callbacks.map((callback) => {
      callback.apply(null, data);
    });
  }
}

const Event = {
  on,
  emit,
  off
};
export default Event
export { Event }
