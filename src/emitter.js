import Disposable from './disposable';

// Essential: Utility class to be used when implementing event-based APIs that
// allows for handlers registered via `::on` to be invoked with calls to
// `::emit`. Instances of this class are intended to be used internally by
// classes that expose an event-based API.
//
// For example:
//
// ```coffee
// class User
//   constructor: ->
//     @emitter = new Emitter
//
//   onDidChangeName: (callback) ->
//     @emitter.on 'did-change-name', callback
//
//   setName: (name) ->
//     if name isnt @name
//       @name = name
//       @emitter.emit 'did-change-name', name
//     @name
// ```
export default class Emitter {
  static initClass() {
    this.prototype.disposed = false;
  }

  /*
  Section: Construction and Destruction
  */

  // Public: Construct an emitter.
  //
  // ```coffee
  // @emitter = new Emitter()
  // ```
  constructor() {
    this.clear();
  }

  // Public: Clear out any existing subscribers.
  clear() {
    this.handlersByEventName = {};
    return this.handlersByEventName;
  }

  // Public: Unsubscribe all handlers.
  dispose() {
    this.handlersByEventName = null;
    this.disposed = true;
    return this.disposed;
  }

  /*
  Section: Event Subscription
  */

  // Public: Register the given handler function to be invoked whenever events by
  // the given name are emitted via {::emit}.
  //
  // * `eventName` {String} naming the event that you want to invoke the handler
  //   when emitted.
  // * `handler` {Function} to invoke when {::emit} is called with the given
  //   event name.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  on(eventName, handler, unshift = false) {
    if (this.disposed) {
      throw new Error('Emitter has been disposed');
    }

    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }

    const currentHandlers = this.handlersByEventName[eventName];
    if (currentHandlers) {
      if (unshift) {
        this.handlersByEventName[eventName] = [handler].concat(currentHandlers);
      } else {
        this.handlersByEventName[eventName] = currentHandlers.concat(handler);
      }
    } else {
      this.handlersByEventName[eventName] = [handler];
    }

    return new Disposable(this.off.bind(this, eventName, handler));
  }

  // Public: Register the given handler function to be invoked *before* all
  // other handlers existing at the time of subscription whenever events by the
  // given name are emitted via {::emit}.
  //
  // Use this method when you need to be the first to handle a given event. This
  // could be required when a data structure in a parent object needs to be
  // updated before third-party event handlers registered on a child object via a
  // public API are invoked. Your handler could itself be preempted via
  // subsequent calls to this method, but this can be controlled by keeping
  // methods based on `::preempt` private.
  //
  // * `eventName` {String} naming the event that you want to invoke the handler
  //   when emitted.
  // * `handler` {Function} to invoke when {::emit} is called with the given
  //   event name.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  preempt(eventName, handler) {
    return this.on(eventName, handler, true);
  }

  // Private: Used by the disposable.
  off(eventName, handlerToRemove) {
    if (this.disposed) { return; }

    const oldHandlers = this.handlersByEventName[eventName];
    if (oldHandlers) {
      const newHandlers = [];
      for (const handler of oldHandlers) {
        if (handler !== handlerToRemove) {
          newHandlers.push(handler);
        }
      }
      this.handlersByEventName[eventName] = newHandlers;
    }
  }

  /*
  Section: Event Emission
  */

  // Public: Invoke handlers registered via {::on} for the given event name.
  //
  // * `eventName` The name of the event to emit. Handlers registered with {::on}
  //   for the same name will be invoked.
  // * `value` Callbacks will be invoked with this value as an argument.
  emit(eventName, value) {
    const handlers = this.handlersByEventName[eventName];
    if (handlers != null) {
      for (const handler of handlers) { handler(value); }
    }
  }
}
Emitter.initClass();
