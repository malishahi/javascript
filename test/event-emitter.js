const EventEmitter = require('events');
let chai = require('chai');

describe('EventEmitter', function () {
    it('register a listener, and raise several events', function () {
        const emitter = new EventEmitter();
        let events = 0;

        //Raise an event, but listener is not defined yet, so this emit has no effect
        emitter.emit('newDataEvent');
        
        //Register a listener
        emitter.on('newDataEvent', () => {
            events++
        });

        chai.expect(events).equal(0);
        emitter.emit('newDataEvent');
        chai.expect(events).equal(1);
        emitter.emit('newDataEvent');
        chai.expect(events).equal(2);
        emitter.emit('newDataEvent');
        chai.expect(events).equal(3);
        emitter.emit('newDataEvent2');
        chai.expect(events).equal(3);

    });

    it('register a listener with arguments, and raise several events', function () {
        const emitter = new EventEmitter();
        let events = 0;
        const input = [];

        //Raise an event, but listener is not defined yet, so this emit has no effect
        emitter.emit('newDataEvent', 1, 2);
        
        //Register a listener
        emitter.on('newDataEvent', (a, b) => {
            input.push(a);
            input.push(b);
            events++
        });

        chai.expect(events).equal(0);
        chai.expect(input).to.have.members([]);
        emitter.emit('newDataEvent', 3, 4);
        chai.expect(input).to.have.members([3, 4]);
        chai.expect(events).equal(1);
        emitter.emit('newDataEvent', 5, 6);
        chai.expect(input).to.have.members([3, 4, 5, 6]);
        chai.expect(events).equal(2);
        emitter.emit('newDataEvent', 7, 8);
        chai.expect(input).to.have.members([3, 7, 8, 4, 5, 6]);
        chai.expect(events).equal(3);
        emitter.emit('newDataEvent2', 9, 10);
        chai.expect(input).to.have.members([3, 7, 8, 4, 5, 6]);
        chai.expect(events).equal(3);
    });
});