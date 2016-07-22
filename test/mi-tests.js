// $Header: svn+ssh://srcctl.devel.nandomedia.com/nm/devel/subversion/support/js-libs/tags/js-libs_1.3/MI/test/mi-tests.js 38 2013-11-21 19:29:34Z jwhetzel $
// Test mi.cloneObject()
QUnit.test("cloneObject method", function ( assert ) {
	var a = {"foo":"bar", "jack":"jill"};
	var b = mi.cloneObject(a);
	b.foo = "barr";
	assert.ok((a.foo != b.foo && a.jack == b.jack), "An object is cloned without a reference to the original object.");
});

// Test mi.fixConsole()
QUnit.test("fixConsole method", function ( assert ) {
	assert.ok((console.log), "console.log method exists");
	assert.ok((console.debug), "console.debug method exists");
	assert.ok((console.info), "console.info method exists");
	assert.ok((console.warn), "console.warn method exists");
	assert.ok((console.error), "console.error method exists");
	assert.ok((console.assert), "console.assert method exists");
	assert.ok((console.dir), "console.dir method exists");
	assert.ok((console.dirxml), "console.dirxml method exists");
	assert.ok((console.trace), "console.trace method exists");
	assert.ok((console.group), "console.group method exists");
	assert.ok((console.groupEnd), "console.groupEnd method exists");
	assert.ok((console.time), "console.time method exists");
	assert.ok((console.timeEnd), "console.timeEnd method exists");
	assert.ok((console.profile), "console.profile method exists");
	assert.ok((console.profileEnd), "console.profileEnd method exists");
	assert.ok((console.count), "console.count method exists");
	// missing tests to verify functionality of retrieving log on browsers where it is not native
});

// Test mi.getArgs()
QUnit.test("getArgs method", function ( assert ) {
	// this tests any existing query string, or lack of one, but doesn't account 
	// for multiple scenarios, if we reset the location.search value it reloads 
	// the page, not exactly desirable
	var r = {};
	var p = location.search.substring(1).split("&");
	for(var i=p.length -1; i >= 0; i--) {
		var pos = p[i].indexOf('=');
		if (pos == -1) {continue;}
		r[p[i].substring(0,pos)] = unescape(p[i].substring(pos+1));
	}
	assert.deepEqual(r, mi.getArgs(), "Arguments successfully converted into object.");
});

// Test mi.getEventSrc()

// Test mi.PageInfo
QUnit.test("PageInfo object", function ( assert ) {
					 assert.ok(mi.pageInfo,"The mi.pageInfo object exists.");
					 mi.pageInfo.setConf("sectionName", "Test");
					 assert.equal(mi.pageInfo.getConf("sectionName"),mi.pageInfo.section.name,"Section name accessed via both getConf and section.name.");
					 mi.pageInfo.setConf("sectionId", 101);
					 assert.equal(mi.pageInfo.getConf("sectionId"),mi.pageInfo.section.id,"Section id accessed via both getConf and section.id.");
					 mi.pageInfo.setConf("assetId", 7000);
					 assert.equal(mi.pageInfo.getConf("assetId"),mi.pageInfo.asset.id,"Story id accessed via both getConf and asset.id.");
					 mi.pageInfo.setConf("title", "Test story");
					 assert.equal(mi.pageInfo.getConf("title"),mi.pageInfo.asset.title,"Story title accessed via both getConf and story.title.");
					 mi.pageInfo.setConf("title", "Alt Test story");
					 assert.equal(mi.pageInfo.getConf("title"),"Test story","Prevent overwritting existing data.");
					 mi.pageInfo.setConf("somethingElse", "something");
					 assert.equal(mi.pageInfo.getConf("somethingElse"),"something","Set a non-v1 configuration value.");
});

// Test mi.loadPageInfo()
QUnit.test("loadPageInfo method", function ( assert ) {
	window.pageInfo = {
		"section": {
			"id":300
		}
	};
					 mi.pageInfo = new mi.PageInfo(); // reset the mi.pageInfo object to accurately test mi.loadPageInfo
	mi.loadPageInfo();
	assert.equal(window.pageInfo, null, "window.pageInfo has been nullified.");
	assert.equal(mi.pageInfo.section.id, 300, "The mi.pageInfo object has been populated.");
	window.pageInfo = {
		"section": {
			"id":200
		},
		"asset": {
			"id":7000
		}
	};
	mi.loadPageInfo();
	assert.equal(mi.pageInfo.asset.id, 7000, "Version 1 asset.id has been appended to the mi.pageInfo object.");
	assert.equal(mi.pageInfo.section.id, 300, "Version 1 section.id was not overwritten.");
});

// Test mi.makeHash()
QUnit.test("makeHash method", function ( assert ) {
	var h={}, d = "one=1|two=2", p = d.split("|"), l;
	for(var i=p.length -1; i >= 0; i--) {
		l = p[i].indexOf('=');
		if (l == -1) {continue;}
		h[p[i].substring(0,l)] = unescape(p[i].substring(l+1));
	}
	// not sure this is working as I expected, the two logs below are not the same
	// also, docs suggest it returns a string, but it returns an object
	//console.log(mi.makeHash(d,"|","="));
	//console.log(h);
	expect(0);
});

// Test mi.templateParser()

// Test mi.wait_for_ready()
