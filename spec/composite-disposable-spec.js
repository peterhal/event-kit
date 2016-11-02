import CompositeDisposable from '../src/composite-disposable';
import Disposable from '../src/disposable';

describe('CompositeDisposable', () => {
  let [disposable1, disposable2, disposable3] = [];

  beforeEach(() => {
    disposable1 = new Disposable();
    disposable2 = new Disposable();
    disposable3 = new Disposable();
  });

  it('can be constructed with multiple disposables', () => {
    const composite = new CompositeDisposable(disposable1, disposable2);
    composite.dispose();

    expect(composite.disposed).toBe(true);
    expect(disposable1.disposed).toBe(true);
    expect(disposable2.disposed).toBe(true);
  });

  it('allows disposables to be added and removed', () => {
    const composite = new CompositeDisposable();
    composite.add(disposable1);
    composite.add(disposable2, disposable3);
    composite.remove(disposable2);

    composite.dispose();

    expect(composite.disposed).toBe(true);
    expect(disposable1.disposed).toBe(true);
    expect(disposable2.disposed).toBe(false);
    expect(disposable3.disposed).toBe(true);
  });
});
