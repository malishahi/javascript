const assert = require('assert');


describe('Assert', function () {
  it('strictEqual', function () {
    // Generate an AssertionError to compare the error message later:
    const { message } = new assert.AssertionError({
      actual: 1,
      expected: 2,
      operator: '==='
    });

    // Verify error output:
    try {
      assert.strictEqual(1, 2);
    } catch (err) {
      assert(err instanceof assert.AssertionError);
      //assert.strictEqual(err.message, message);
      assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]');
      assert.strictEqual(err.actual, 1);
      assert.strictEqual(err.expected, 2);
      assert.strictEqual(err.code, 'ERR_ASSERTION');
      assert.strictEqual(err.operator, 'strictEqual');
      assert.strictEqual(err.generatedMessage, true);
    }
  });

  it('equal', function () {
    // Generate an AssertionError to compare the error message later:
    const { message } = new assert.AssertionError({
      actual: 1,
      expected: 2,
      operator: '=='
    });

    // Verify error output:
    try {
      assert.equal(1, 2);
    } catch (err) {
      assert(err instanceof assert.AssertionError);
      assert.strictEqual(err.message, message);
      assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]');
      assert.strictEqual(err.actual, 1);
      assert.strictEqual(err.expected, 2);
      assert.strictEqual(err.code, 'ERR_ASSERTION');
      assert.strictEqual(err.operator, '==');
      assert.strictEqual(err.generatedMessage, true);
    }
  });

  it('fail', function () {
    // Generate an AssertionError to compare the error message later:
    const { message } = new assert.AssertionError({
      message: 'boom'
    });

    // Verify error output:
    try {
      assert.fail('boom');
    } catch (err) {
      assert(err instanceof assert.AssertionError);
      assert.strictEqual(err.message, message);
      assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]');
      assert.strictEqual(err.code, 'ERR_ASSERTION');
      assert.strictEqual(err.generatedMessage, false);
    }
  });

  it('ifError(0)', function () {
    assert.ifError(null);
    //assert.ifError(0);

    // OK
    try {
      assert.ifError(0);
    } catch (err) {
      assert(err instanceof assert.AssertionError);
    }
  });

  it('ifError error', function () {
    try {
      assert.ifError('error');
      // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
    } catch (err) {
      assert.equal(err.message, "ifError got unwanted exception: 'error'");
    }
  });

  it('ifError(new Error())', function () {
    try {
      assert.ifError(new Error());
      // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error
    } catch (err) {
      assert(err instanceof Error);
    }
  });

  it('ifError error frames', function () {
    try {
      // Create some random error frames.
      let err;
      (function errorFrame() {
        err = new Error('test error');
      })();

      (function ifErrorFrame() {
        assert.ifError(err);
      })();
    } catch (err) {
      // AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
      //     at ifErrorFrame
      //     at errorFrame
      assert(err instanceof Error);
      assert.equal(err.message, 'ifError got unwanted exception: test error');
    }
  });

  it('ifError', function () {
    assert.ifError(null);
    // OK
    try {
      assert.ifError(0);
    } catch (err) {
      assert(err instanceof assert.AssertionError);
    }
  });

});