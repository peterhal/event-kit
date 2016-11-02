import Grim from 'grim';

// Essential: A handle to a resource that can be disposed. For example,
// {Emitter::on} returns disposables representing subscriptions.
export class Disposable {
  static initClass() {
    this.prototype.disposed = false;
  }

  // Public: Ensure that `object` correctly implements the `Disposable`
  // contract.
  //
  // * `object` An {Object} you want to perform the check against.
  //
  // Returns a {Boolean} indicating whether `object` is a valid `Disposable`.
  static isDisposable(object) {
    return typeof __guard__(object, x => x.dispose) === "function";
  }

  /*
  Section: Construction and Destruction
  */

  // Public: Construct a Disposable
  //
  // * `disposalAction` A {Function} to call when {::dispose} is called for the
  //   first time.
  constructor(disposalAction) {
    this.disposalAction = disposalAction;
  }

  // Public: Perform the disposal action, indicating that the resource associated
  // with this disposable is no longer needed.
  //
  // You can call this method more than once, but the disposal action will only
  // be performed the first time.
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      __guardMethod__(this, 'disposalAction', o => o.disposalAction());
      this.disposalAction = null;
    }
  }
};
Disposable.initClass();

if (Grim.includeDeprecatedAPIs) {
  Disposable.prototype.off = function() {
    Grim.deprecate("Use ::dispose to cancel subscriptions instead of ::off");
    return this.dispose();
  };
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}
