/** QUnit tests for MI.js **********************************************************************
These tests include tests for query strings.
For all tests to pass, it must be called with the following query string:
http://<page>?foo=bar&q=unit
 */

mi.Foo = function (val) {
    mi.App.apply(this, arguments); 
    this.val = val;
};

mi.Foo.prototype.config = function() {};
mi.foo = new mi.Foo();
        
function runTests()
{
    module('MI_tests');
    
    test("MI Class Tests", function() {
        ok( typeof (mi) !== "undefined", "mi object should be defined");

        //this test assumes that we are calling this page with a query string of ?foo=bar&q=unit
        mi.getArgs();
        ok( typeof (mi.args) !== "undefined", "getArgs: mi.args should be defined");
        if (typeof mi.args != "undefined") {
            ok( typeof (mi.args.foo) !== "undefined", "getArgs: query string parameter 'foo' should be defined");
            if (typeof mi.args.foo != "undefined") {
                deepEqual( mi.args.foo, "bar" , "getArgs: query string paramter 'foo' value should = 'bar'"  );
            }
            else{
                ok( false, "getArgs: query string paramter 'foo' value should = 'bar'" );
            }
        }
        ok( typeof (mi.args) !== "undefined", "getArgs: mi.args should be defined");
        if (typeof mi.args != "undefined") {
            ok( typeof (mi.args.q) !== "undefined", "getArgs: query string parameter 'foo' should be defined");
            if (typeof mi.args.q != "undefined") {
                deepEqual( mi.args.q, "unit" , "getArgs: query string paramter 'q' value should = 'unit'"  );
            }
            else{
                ok( false, "getArgs: query string paramter 'q' value should = 'unit'" );
            }
        }

        mi.fixConsole();
        deepEqual( window.console.is_fixed, true , "fixConsole: fix console flag should be set"  );
        
        mi.testClass = function( val ) {
            this.val1 = val;
        }
        var foo2 = new mi.testClass('testval');
        var foo3 = mi.cloneObject(foo2);
        deepEqual( foo3.val1, 'testval' , "cloneObject: object should clone successfully"  );

        ok( true, "made it this far" );
    });
    
    
    test("mi.App Tests", function() {
        
        mi.foo.setConf( "accountName", "mireference" );
        equal( mi.foo.getConf('accountName'), "mireference" , "getConf/setConf: Unable to set and retrieve mi configs" );
        
        //getEventSrc
        var clickedDiv;
        jQuery('#test1').click(function(e){
            clickedDiv = mi.getEventSrc(e);
        });
        jQuery('#test1').click();
        deepEqual( clickedDiv.id, "test1" , "getEventSrc: filled in template should have correct value"  );
       
        //templateParser
        var template = "start @foo@ end";
        var data = function () {};
        data.foo = 'bar';
        var newStr = mi.templateParser(data, template);
        deepEqual( newStr, "start bar end" , "templateParser: filled in template should have correct value"  );
                
        //makeHash
        var str = "a=1;b=2;";//note: "a=1;b=2" does not work, not sure if this is by design
        var testHash1 = mi.makeHash(str, ';', '=');
       // alert(testHash1.b);
        deepEqual( testHash1.a, "1" , "makeHash: hash should have a key value pair a=2"  );
        deepEqual( testHash1.b, "2" , "makeHash: hash should have a key value pair b=2"  );

        mi.loadPageInfo();
        deepEqual( mi.pageInfo.val1, 'x' , "loadPageInfo: pageInfo should have a key value pair val1=x"  );
        
    });
        
    var callbackFlag = 0;
    asyncTest( "asynchronous MI.js tests", function() {
        function callbackSet()
        {
            callbackFlag = 1;
            //console.log('callbackSet:');
        }
        function callbackTest()
        {
            deepEqual( callbackFlag, 1 , "wait_for_ready: callbackFlag should be set to 1"  );
            start();
            //console.log('callbackTest:');
        }
        
        mi.wait_for_ready( 1, '#test1', callbackSet );
        mi.wait_for_ready( 2, '#test1', callbackTest );
    });
}
  