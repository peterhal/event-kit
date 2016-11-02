import Disposable from '../src/disposable';

describe("Disposable", function() {
  it("does not try to execute disposalAction when it is not a function", function() {
    let disposalAction = {};
    let disposable = new Disposable(disposalAction);
    expect(disposable.disposalAction).toBe(disposalAction);

    disposable.dispose();
    return expect(disposable.disposalAction).toBe(null);
  });

  it("dereferences the disposalAction once dispose() is invoked", function() {
    let disposalAction = jasmine.createSpy("dummy");
    let disposable = new Disposable(disposalAction);
    expect(disposable.disposalAction).toBe(disposalAction);

    disposable.dispose();
    expect(disposalAction.calls.count()).toBe(1);
    expect(disposable.disposalAction).toBe(null);

    disposable.dispose();
    return expect(disposalAction.calls.count()).toBe(1);
  });

  describe(".isDisposable(object)", () =>
    it("returns true if the object implements the ::dispose function", function() {
      expect(Disposable.isDisposable(new Disposable(function() {}))).toBe(true);
      expect(Disposable.isDisposable({dispose() {}})).toBe(true);

      expect(Disposable.isDisposable(null)).toBe(false);
      expect(Disposable.isDisposable(undefined)).toBe(false);
      expect(Disposable.isDisposable({foo() {}})).toBe(false);
      return expect(Disposable.isDisposable({dispose: 1})).toBe(false);
    })
  );
});
