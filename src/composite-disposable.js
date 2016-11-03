// @flow

import invariant from 'assert';

export type IDisposable = {dispose: () => mixed};

// Essential: An object that aggregates multiple {Disposable} instances together
// into a single disposable, so they can all be disposed as a group.
//
// These are very useful when subscribing to multiple events.
//
// ## Examples
//
// ```coffee
// {CompositeDisposable} = require 'atom'
//
// class Something
//   constructor: ->
//     @disposables = new CompositeDisposable
//     editor = atom.workspace.getActiveTextEditor()
//     @disposables.add editor.onDidChange ->
//     @disposables.add editor.onDidChangePath ->
//
//   destroy: ->
//     @disposables.dispose()
// ```
export default class CompositeDisposable {
  disposed: boolean;
  disposables: ?Set<IDisposable>;

  /*
  Section: Construction and Destruction
  */

  // Public: Construct an instance, optionally with one or more disposables
  constructor(...disposables: Array<IDisposable>) {
    this.disposed = false;
    this.disposables = new Set();
    for (const disposable of disposables) { this.add(disposable); }
  }

  // Public: Dispose all disposables added to this composite disposable.
  //
  // If this object has already been disposed, this method has no effect.
  dispose() {
    if (!this.disposed) {
      this.disposed = true;
      invariant(this.disposables != null);
      this.disposables.forEach(disposable => disposable.dispose());
      this.disposables = null;
    }
  }

  /*
  Section: Managing Disposables
  */

  // Public: Add disposables to be disposed when the composite is disposed.
  //
  // If this object has already been disposed, this method has no effect.
  //
  // * `...disposables` {Disposable} instances or any objects with `.dispose()`
  //   methods.
  add(...disposables: Array<IDisposable>) {
    if (!this.disposed) {
      invariant(this.disposables != null);
      for (const disposable of disposables) { this.disposables.add(disposable); }
    }
  }

  // Public: Remove a previously added disposable.
  //
  // * `disposable` {Disposable} instance or any object with a `.dispose()`
  //   method.
  remove(disposable: IDisposable) {
    invariant(this.disposables != null);
    if (!this.disposed) { this.disposables.delete(disposable); }
  }

  // Public: Clear all disposables. They will not be disposed by the next call
  // to dispose.
  clear() {
    if (!this.disposed) {
      invariant(this.disposables != null);
      this.disposables.clear();
    }
  }
}
