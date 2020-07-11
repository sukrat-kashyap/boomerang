/*eslint-env mocha*/
/*global assert*/

describe("e2e/07-autoxhr/52-xhr-response-url", function () {
    var t = BOOMR_test;
    var tf = BOOMR.plugins.TestFramework;

    it("Should have sent beacons for each XHR/Fetch call", function (done) {
        var n = BOOMR.plugins.AutoXHR ? (t.isFetchApiSupported() ? 5 : 3) : 1;
        t.ifAutoXHR(
            done,
            function () {
                t.ensureBeaconCount(done, n);
            },
            this.skip.bind(this)
        );
    });

    it("Beacon parameter 'ru' should be present when redirection happened", function (done) {
        t.ifAutoXHR(
            done,
            function () {
                tf.beacons.filter(function (beacon) {
                    return beacon["u"].indexOf("/302?to=/blackhole/test") >= 0;
                }).forEach(beacon => {
                    assert.strictEqual(beacon["ru"], "http://boomerang-test.local:4002/blackhole/test");
                });
                done();
            },
            this.skip.bind(this)
        );
    });
});
