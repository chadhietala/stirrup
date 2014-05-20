/**
 * @venus-include ../lib/bluebird.js
 * @venus-include ../lib/rsvp.js
 * @venus-include ../test-helpers.js
 */

/*
 *  core.spec.js
 *  --------------
 *  Tests the core promise-creating functionality
 *  of Stirrup instances.
 */
Stirrup.prototype.getConfig = sinon.stub().returns({
  constructor: null,
  defer: 'defer'
});
Stirrup.prototype.buildStaticFunctions = sinon.stub();
var instance;

describe('Stirrup Core', function() {

  describe('Using bluebird', function() {
    Stirrup.prototype.getConfig = sinon.stub().returns({
      constructor: null,
      defer: 'defer'
    });
    runTestsWithLibrary(Stirrup, Promise.noConflict());
  });

  describe('Using RSVP', function() {
    Stirrup.prototype.getConfig = sinon.stub().returns({
      constructor: 'Promise',
      defer: 'defer'
    });
    runTestsWithLibrary(Stirrup, RSVP);
  });
});

function runTestsWithLibrary(stirrup, Library) {
  describe('constructor', function() {
    it('should throw an error if no promise library supplied', function() {
      var error = '';
      try {
        instance = new stirrup();
      } catch (e) {
        error = e;
      }

      expect(error).to.be.ok();
    });
  });

  describe('Instance function', function() {
    it('should create a new promise with a then() function', function() {
      instance = new stirrup(Library);

      var promise = new instance(function() {});

      isPromise(promise);
    });

    it('should create a new fulfillable promise', function(done) {
      var value = {};
      instance = new stirrup(Library);

      var promise = new instance(function(f) { f(value); });

      promise.then(function(v) {
        expect(v).to.be(value);
        done();
      }).then(null, done);
    });

    it('should create a new rejectable promise', function(done) {
      var value = {};
      instance = new stirrup(Library);

      var promise = new instance(function(f, r) { r(value); });

      promise.then(null, function(v) {
        expect(v).to.be(value);
        done();
      }).then(null, done);
    });
  });

  describe('defer()', function() {
    it('should create a new deferred with a promise promise property with a then() function', function() {
      instance = new stirrup(Library);

      var deferred = instance.defer();

      isPromise(deferred.promise);
    });

    it('should create a new fulfillable deferred', function(done) {
      var value = {};
      instance = new stirrup(Library);

      var deferred = instance.defer();
      deferred.fulfill(value);

      deferred.promise.then(function(v) {
        expect(v).to.be(value);
        done();
      }).then(null, done);
    });

    it('should create a new rejectable deferred', function(done) {
      var value = {};
      instance = new stirrup(Library);

      var deferred = instance.defer();
      deferred.reject(value);

      deferred.promise.then(null, function(v) {
        expect(v).to.be(value);
        done();
      }).then(null, done);
    });
  });
}
