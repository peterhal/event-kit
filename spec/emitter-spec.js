import Emitter from '../src/emitter';

describe('Emitter', () => {
  it('invokes the observer when the named event is emitted until disposed', () => {
    const emitter = new Emitter();

    const fooEvents = [];
    const barEvents = [];

    const sub1 = emitter.on('foo', value => fooEvents.push(['a', value]));
    const sub2 = emitter.on('bar', value => barEvents.push(['b', value]));
    emitter.preempt('bar', value => barEvents.push(['c', value]));

    emitter.emit('foo', 1);
    emitter.emit('foo', 2);
    emitter.emit('bar', 3);

    sub1.dispose();

    emitter.emit('foo', 4);
    emitter.emit('bar', 5);

    sub2.dispose();

    emitter.emit('bar', 6);

    expect(fooEvents).toEqual([['a', 1], ['a', 2]]);
    expect(barEvents).toEqual([['c', 3], ['b', 3], ['c', 5], ['b', 5], ['c', 6]]);
  });

  it("throws an exception when subscribing with a callback that isn't a function", () => {
    const emitter = new Emitter();
    expect(() => emitter.on('foo', null)).toThrow();
    expect(() => emitter.on('foo', 'a')).toThrow();
  });

  it('allows all subsribers to be cleared out at once', () => {
    const emitter = new Emitter();
    const events = [];

    emitter.on('foo', value => events.push(['a', value]));
    emitter.preempt('foo', value => events.push(['b', value]));
    emitter.clear();

    emitter.emit('foo', 1);
    emitter.emit('foo', 2);
    expect(events).toEqual([]);
  });
});
