/*eslint-env mocha*/
/*eslint-disable no-loop-func*/
/*global BOOMR_test,assert*/

describe("e2e/11-restiming/06-iframes", function() {
	var t = BOOMR_test;
	var tf = BOOMR.plugins.TestFramework;

	it("Should pass basic beacon validation", function(done) {
		t.validateBeaconWasSent(done);
	});

	it("Should have a restiming parameter on the beacon (if ResourceTiming is supported)", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();
			assert.isDefined(b.restiming);
		}
	});

	it("Should have all of the resouces on the page", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();

			var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));
			var pageResources = window.performance.getEntriesByType("resource");

			for (var i = 0; i < pageResources.length; i++) {
				var url = pageResources[i].name;

				// skip beacon URL
				if (url.indexOf("blackhole") !== -1) {
					continue;
				}

				assert.isDefined(resources.find(function(r) {
					return r.name === url;
				}), "Finding " + url);
			}
		}
	});

	it("Should have the same-origin IFRAME", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();

			var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));

			assert.isDefined(resources.find(function(r) {
				return r.name.indexOf("support/iframe.html?same-origin") !== -1;
			}), "Finding support/iframe.html?same-origin");
		}
	});

	it("Should have the IMG from the same-origin IFRAME", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();

			var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));

			assert.isDefined(resources.find(function(r) {
				return r.name.indexOf("/assets/img.jpg?iframe") !== -1;
			}), "Finding /assets/img.jpg?iframe in the IFRAME");
		}
	});

	it("Should have the cross-origin IFRAME", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();

			var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));

			assert.isDefined(resources.find(function(r) {
				return r.name.indexOf("support/iframe.html?cross-origin") !== -1;
			}), "Finding support/iframe.html?cross-origin");
		}
	});

	it("Should not have the IMG from the cross-origin IFRAME", function() {
		if (t.isResourceTimingSupported()) {
			var b = tf.lastBeacon();

			var resources = ResourceTimingDecompression.decompressResources(JSON.parse(b.restiming));

			assert.isUndefined(resources.find(function(r) {
				return r.name.indexOf("/assets/img.jpg?afteriframe") !== -1 &&
				       r.name.indexOf(":" + window.crossOriginPort) !== -1;
			}), "Not finding /assets/img.jpg?afteriframe from cross-origin iframe");
		}
	});
});