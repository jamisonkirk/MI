// $Header: svn+ssh://srcctl.devel.nandomedia.com/nm/devel/subversion/support/js-libs/tags/js-libs_1.3/MI/js/MI.js 38 2013-11-21 19:29:34Z jwhetzel $
/** MI.js **********************************************************************
 * @fileoverview Inclusion of this library creates an MI object within a
 * variable named <tt>mi</tt>. The MI object is intended to namespace
 * functionality developed by McClatchy Interactive. Because the MI object is
 * self-instantiating there is no constructor per se, and there should be no
 * reason to try to create any additional copies/instances, it is a generic
 * object.
 *
 * <p><strong>window.console</strong><br>In addition to automatically creating
 * the <tt>mi</tt> variable this library also will create a
 * <tt>window.console</tt> object in browsers that don't already have one. The
 * window.console object is then provided with Firebug-like methods if they do
 * not already exist. At the very least this allows you to use
 * <tt>console.log()</tt> in your code without the fear of throwing errors in
 * browsers that don't support it. <em>Note:</em> Safari natively supports
 * console.log, but not (m)any of the other Firebug console methods. With Safari
 * and Firefox/Firebug output from console methods can be viewed in the
 * browser's console window. In browsers without a console window the console's
 * log can be accessed via an alert window at page load if the page is loaded
 * with the query string <em>?viewlog=1</em>. Currently all supported Firebug
 * methods are basically aliases for the log, though the log will report what
 * method was used. Future updates may provide additional features with these
 * methods to make them more Firebug-like.</p>
 *
 * <p><strong>Extending the MI object</strong><br>
 * The MI object is an evolving piece of code and extending its functionality is
 * encouraged. However, we do ask that you follow these guidelines.</p>
 * <ul>
 * 	<li><strong>Document your code -</strong> This was specifically chosen as 
 * 		the first item. The more the better. With the aggregator's ability to strip 
 * 		comments don't be shy about putting too much documentation into your code. 
 * 		For the win, write your documentation in the format used by JSDoc so that 
 * 		your documentation can be parsed. See this file as an example. Inclusion of 
 * 		the <tt>&#64;minify true</tt> flag will allow your code to be minified, thus 
 * 		stripping whitespace and comments from code used on live sites.</li>
 * 	<li><strong>More, smaller files -</strong> Your code should be included on
 * 		pages via aggregation, so there's no need to write huge library files that
 * 		contain the kitchen sink. Organize your code into files of related 
 * 		functionality.</li>
 * 	<li><strong>Consolidate features into apps -</strong> The MI object provides
 * 		the <tt>mi.App</tt> class that facilitates easy creation of applications
 * 		for specific features.</li>
 * 	<li><strong>Stick to naming conventions -</strong>
 * 		<ul>
 * 			<li>CamelCase constructors with an initial cap</li>
 * 			<li>Start private method and variable names with an underscore</li>
 * 			<li>File names should imply scope, separated by underscores. For example
 * 			<tt>MI_Search.js</tt>.</li>
 * 		</ul>
 * 	</li>
 * 	<li><strong>Overwrite similar functionality -</strong> There's no need to 
 * 		have multiple apps or methods that do similar tasks. Instead overwrite the
 * 		existing feature with your new version. Even better, make your new version
 * 		accept input and produce output the same as the old version, but with 
 * 		additional options to facilitate your new behavior. This will preserve 
 * 		backward compatability.</li>
 * 	<li><strong>Contain dependencies -</strong> Don't rely on, or trust in 
 * 		global variables. Either pass values in during execution, or make them
 * 		configurable options.</li>
 * 	<li><strong>Generalize -</strong> Any code within the MI object should be 
 * 		considered general in that it could be utilized on any site. No 
 * 		site-specific code. Any site-specific values should be configuration 
 * 		options.</li>
 * 	<li><strong>Exit gracefully -</strong> With the console now available on all
 * 		browsers there's little or no need to use <tt>alert()</tt> and fear users
 * 		getting messages meant for developers. Test for dependencies and exit if
 * 		they don't meet your requirements after outputting a message to the 
 * 		console.</li>
 * </ul>
 * 
 * @minify true
 * @author Joe Whetzel (jwhetzel [at] mcclatchyinteractive.com)
 * @namespace mi
 * @aggpath js/MI.js
 */

var mi = (typeof mi == 'undefined') ? {'media_domain':''} : mi;
if (window.miAppControler) {
	mi.control = new miAppControler();
}



/** This method parses name=value argument pairs from
 * the query string of the URL. It stores the name=value pairs in 
 * properties of an object and returns that object.
 * @author Adapted from "Javascript: The Definitive Guide" by David Flanagan
 */
mi.getArgs = function() {
	if (typeof mi.args == 'undefined') {
		mi.args = {};
		var query = location.search.substring(1);
		var pairs = query.split('&');
		for(var i=pairs.length -1; i >= 0; i--) {
			var pos = pairs[i].indexOf('=');
			if (pos == -1) {continue;}
			mi.args[pairs[i].substring(0,pos)] = unescape(pairs[i].substring(pos+1));
		}
	}
	return mi.args;
};


/** A stand-in for console.log() for browsers without the functionality
 * The logged message is stored for later retreival. This function gets set as
 * console.log by mi.fixConsole if needed. Each logged message is separated by 
 * a line of hyphens.
 * @private
 */
mi._console = function(s) {
	mi._console.log = (mi._console.log && mi._console.log.length > 0) ? mi._console.log + '\n---------------------------------------------------\n' + s : s;
};



/** Use console methods even in browsers without a console.
 * Defines a console object in browsers that lack one and then populates the
 * console with any missing methods from a list based on those used by Firebug.
 * Any methods created in this manner act effectively as a self-identifying
 * alias for console.log.
 *
 * <p>This method is automatically executed as the code is loaded. With this
 * in place developers can make use of console methods without worrying about
 * causing errors on browsers with no console. This makes troubleshooting during
 * development easier, as well as allowing standing error reporting features to
 * be utilized even on live pages.</p>
 *
 * This method is based on Pluck's NYX object method of the same name.
 */
mi.fixConsole = function() {
	if (typeof window.console != "object") { window.console = {}; }
	if (window.console.is_fixed) {/*already fixed*/}
	else {
		// list of firebug method names, "log" should always be first
		// this list is used to create "stand-in" methods for the console object if needed
		var firebugMethods = ["log","debug","info","warn","error","assert","dir","dirxml",
			"trace","group","groupEnd","time","timeEnd","profile","profileEnd","count"];
		var methodCount = firebugMethods.length;
		var args = mi.getArgs();
		var view = (args.viewlog && args.viewlog == '1');
		for (var i = 0; i < methodCount; i++) {
			var methodName = firebugMethods[i];
			if (typeof window.console[methodName] != "function") {
				switch (methodName) {
					// Firebug console methods can be replicated here by adding cases
					case 'log':
						if (view) {
							window.console.log = mi._console;
							if (window.addEventListener) {
								window.addEventListener("load", function(){alert(mi._console.log);}, false);
							} else if (window.attachEvent) {
								window.attachEvent("onload", function(){alert(mi._console.log);});
							}
						} else {
							window.console.log = function(){};
						}
						break;
					default:
						eval("window.console[methodName] = function(s){window.console.log('"+methodName.toUpperCase() + ": '+ s)};");
				}
			}
		}
	}
	//add our tracking flag
	window.console.is_fixed = true;
};
mi.fixConsole();

/** handy method/constructor for cloning objects
 * by default, setting a variable equal to a pre-existing object just creates
 * a reference to the original, this allows you to create an independant copy
 * of the original with no back-reference
 * @param {Object} sourceObj The object to be cloned.
 * @return A copy of the source object, <b>not</b> a reference to the original
 * @type Object
 */
mi.cloneObject = function(sourceObj) {
	if (sourceObj == null || typeof sourceObj != 'object') {
		return sourceObj;
	}
	var temp = new sourceObj.constructor();
	for (var key in sourceObj) {
			temp[key] = mi.cloneObject(sourceObj[key]);
	}
	return temp;
};


/** A constructor for applications that come pre-loaded with useful features.
 *
 * <p>Application objects come with features that facilitate the management of
 * configuration values with a system of methods used to make setting and 
 * accessing configuration values easily while protecting those settings from 
 * accidental or malevolent corruption.</p>
 * <h2>Creating your App</h2>
 * <p>In order to properly inherit all of the private properties that keep your 
 * configuration settings safe you need to use a somewhat non-traditional manner 
 * to instantiate your App. Instead of creating an instance of mi.App you 
 * instead create a constuctor for your App and inherit from the mi.App "class",
 * making your constructor a sub-class of mi.App.</p>
 * <h4>Usage Example:</h4>
 * <pre>mi.YourApp &#61; function() {
  mi.App.apply(this, arguments);
}</pre>
 * <h2>Enforcing config values</h2>
 * <p>With the only way to set configuration values being via the 
 * {@link #setConf} method you have the ability to define rules around what 
 * kinds of values are acceptable per configurable option. This is accomplished 
 * by defining a method named <tt>_manageConf</tt> specifically to
 * apply your rules. It is up to you to develop the enforcement of your rules. 
 * Here's an example:</p>
 * <h4>Usage Example:</h4>
 * <pre>mi.YourApp &#61; function() {
  mi.App.apply(this, arguments);
  this._manageConf = function(prop, val) {  
    switch (prop) {
      case 'gender':          // each case is based on the name of the configurable option
        if (
          val != 'male' ||
          val != 'female' ||
          val != 'unknown'
        ) {
          val = 'unknown';
        }
      break;
    }
    return val;
  };
}</pre>
 * <p>This example only enforces the setting of the <i>gender</i> configuration,
 * with three possible values. If an unacceptable value is passed the config 
 * gets set to an acceptable default value. Set up a case for each configuration
 * that needs enforcement. In any case, your method needs to accept two variables,
 * the name of the config and the value, and must return the value to be used.</p>
 * @constructor
 */
mi.App = function() {
	var _configs = {};
	/**
	 * Stand in method to be used for managing configuration values. By default
	 * this method does not do anything. Individual apps have the option to overwrite
	 * this method with their own functionality.
	 * @private
	 */
	this._manageConf = function(prop, val) { return val; };
	/**
	 * Set configuration values in the app.
	 * <p>Configurations may be loaded in one of two ways:</p>
	 * <ol><li>Individually: Pass two arguments, the first being the name of the
	 * configuration value and the second being the value, or</li>
	 * <li>Batch: Pass an object with attributes named after the config name and
	 * their values being the desired config setting.</li></ol>
	 * <p>Actually, you can also use these two means of configuring your app when
	 * you instantiate it by passing arguments to the constructor.</p>
	 * <b>Usage Example:</b><br>
	 * <pre>mi.yourApp1 &#61; new mi.YourApp('gender','male');
mi.yourApp2 &#61; new mi.YourApp({'gender':'unknown','name':'Pat'});</pre>
	 * <p>If you have multiple configurations to set at one time, passing an object
	 * is probably the most efficient means of getting them set.</p>
	 * @param {Object} confs A generic object containing one or more attributes
	 * that will be used to create the configuration(s), or
	 * @param {String} name The name of the configuration value to be set, this
	 * should be a string value, and
	 * @param value The value to be used.
	 */
	this.setConf = function() {
		switch (arguments.length) {
			case 1:
				for (var prop in arguments[0]) {
					_configs[prop] = this._manageConf(prop, arguments[0][prop]);
				}
				break;
			case 2:
				_configs[arguments[0]] = this._manageConf(arguments[0],arguments[1]);
				break;
			default:
				console.warn('mi.App.setConf was passed an incorrect number of arguments, the method should be used with either a name-value pair or an object containing configuration settings.');
		}
	};
	/**
	 * Retreive a configuration value from the app.
	 *
	 * <p>Any configuration value can be retrieved using this method. Simply pass
	 * the name of the config setting as the one argument. The value of the 
	 * setting is returned.</p>
	 * <b>Usage Example:</b><br>
	 * <pre>mi.example.setConf('name','Fred');
name &#61; mi.example.getConf('name');	//name is now equal to "Fred"</pre>
	 * @param {String} prop The configuration setting name you want returned; a string.
	 * @return The value associated with the named setting.
	 */
	this.getConf = function(prop) {
		return _configs[prop];
	};
	/**
	 * Outputs all configuration settings to the console.
	 *
	 * A convenience method for troubleshooting. Calling this method will output
	 * the name and value of each configuration setting in the app.
	 */
	this.viewConfs = function() {
		console.dir(_configs);
	};
	/**
	 * Object used for storing temporary values.
	 *
	 * <p>Rather than littering your app with variables used by the app's methods
	 * this object is provided as a bucket for storing those values. There are no
	 * controls around what can be set in this object. Basically it's an 
	 * unprotected bucket, so values shouldn't necessarily be trusted, test them
	 * before relying on them.</p>
	 * <b>Usage Example:</b><br>
	 * <pre>mi.exampleApp.cache.foo = "bar";</pre>
	 */
	this.cache = {};
	/* pass any arguments on to setConf() to configure the app as it's instantiated
	 */
	switch (arguments.length) {
		case 1:
			this.setConf(arguments[0]);
			break;
		case 2:
			this.setConf(arguments[0], arguments[1]);
			break;
	}
};

/** An object of the mi.App class used to store data about the current page.
 *
 * <p>The mi.pageInfo object makes use of the config functioinality provided
 * by mi.App for storing variables that pertain to the current page. These
 * values are generally provided by the backend system for javascript apps
 * to make use of.</p>
 * <p>This object is backwards compatible with the v1 mi.pageInfo object in
 * that it accommodates the creation of:</p>
 * <ul>
 *	<li>section.name: for "sectionName" conf</li>
 *	<li>section.id: for "sectionId" conf</li>
 *	<li>asset.id: for "storyId" or "galleryId" confs</li>
 *	<li>asset.title: for "storyTitle" or "galleryTitle" confs</li>
 * </ul>
 * <p>Existing configurations cannot be overwritten.</p>
 * <p>Note: Version 1 attributes are not protected from being overwritten directly.</p>
 */
mi.PageInfo = function() {
	mi.App.apply(this, arguments);
	/**
	 * Enforces the creation of object attributes for the creation of version 1 
	 * attributes such as asset.id, asset.title, section.id, and section.name.
	 * @private
	 */
	this._manageConf = function(prop, val) {
		if(this.getConf(prop) == undefined) {
			if(prop.indexOf("section") == 0 && !this.section) {
				this.section = {};
			} else if ((prop.indexOf("asset") == 0) && !this.asset) {
				this.asset = {};
			}
			switch(prop){
				case "sectionName":
					this.section.name = val;
					break;
				case "sectionId":
					this.section.id = val;
					break;
				case "assetId":
					this.asset.id = val;
					break;
				case "title":
					this.asset.title = val;
					break;
				default:
					break;
			};
		} else {
			val = this.getConf(prop);
		};
		return val;
	};
	this.version = 2;
};
mi.pageInfo = new mi.PageInfo();


/** A Method for discovering the object/node that kicked off the current event.
 *
 * <p>This can be a very handy method to make determining what element kicked
 * off an even a snap. It can also be frustrating without proper documentation.
 * Basically, when called correctly this will return the source element of the
 * current event.</p>
 * <b>Usage Example:</b><br>
 * <pre>jQuery(window).click(function(e){
	console.log(mi.getEventSrc(e));
});</pre>
 * <p>In this case the object that was clicked on will be output to the console.
 * Due to event bubbling it is the object clicked, not the object with the
 * listener that is reported. That's what makes this so useful. So if in this
 * example you clicked on a paragraph object it would be that paragraph that
 * would be returned not the window object.</p>
 * <p><i>Note:</i> it is key that an argument representing the event object is 
 * passed to the handler for browsers that do not support IE's <tt>window.event</tt>
 * object.</p>
 */
mi.getEventSrc = function (e) {
	if (!e) {e = window.event;}
	if (e.target) {
		return e.target;
	} else if (e.srcElement) {
		return e.srcElement;
	}
};


/**
 * Pattern used by {@link #templateParser} to find variables.
 * @type RegEx
 */
mi.templateVarPattern = /\@([^\@]+)\@/g;
/** method for parsing a template and replacing a pattern with the equivalent
 * attributes from an object
 *
 * <pre>var data object to get values from
 *var template string containing placeholders</pre>
 *
 * <p>Placeholders in the template should be given the name of the attribute to be 
 * used as the substitute surrounded by "@" symbols, i.e. @name@</p>
 *
 * <p>The pattern is defined outside of the method to avoid instantiating the 
 * pattern every time the method is used.</p>
 *
 * @param {Object} data Attributes should be the name of the variable to be searched for
 * and value is what will be put into the template.
 * @param {String} template The template string used to format the output.
 * @return The template with each variable replaced with the corresponding value from
 * the <i>data</i> argument.
 * @type String
 */
mi.templateParser = function(data, template) {
	return template.replace(mi.templateVarPattern, function() {
			return data[arguments[1]];
		}
	)
};


/** method for parsing name/value data into name/value pairs
 *
 * @param {Object} sourceData Each attribute will be made into part of the resulting string.
 * @param {String} firstDelimiter Delimiter to be used between attributes.
 * @param {String} secondDelimiter Delimiter to be used between the name and the value.
 * @author Jamie Kirk
 * @type String
 */
mi.makeHash = function (sourceData, firstDelimiter, secondDelimiter) {
	if (sourceData && firstDelimiter && secondDelimiter) {
		var hash = {};
		var pairs = sourceData.split(firstDelimiter);
		var pos; 
		for(var i=pairs.length -1; i >= 0; i--) {
			if (typeof(pairs[i + 1]) != 'undefined') {
				pos = pairs[i].indexOf(secondDelimiter);
				if (pos == -1) {continue;}
				hash[pairs[i].substring(0,pos)] = pairs[i].substring(pos+1);
			}
		}
		return hash;
	}
	else {
		console.log('sourceData, firstDelimiter, & secondDelimiter must be defined. There are no default values.');
	}
};

/**
 * Checks for a pageInfo object in the global namespace and loads any data, that
 * doesn't already exist, into the mi.pageInfo object.
 * <p>Any objects will be cloned, not referenced, and pre-existing values will 
 * not be overwritten.</p>
 * <p> This method only officially supports one nested object, 
 * i.e. pageInfo.asset.id. A second-level nested object may be created,
 * i.e., pageInfo.asset.foo.bar; however, pageInfo.asset.foo cannot then
 * accept additional attributes, nor can pageInfo.asset.foo.bar be overwritten.</p>
 * <p>The global object is nullified after loading is complete to encourage
 * accessing data in the mi object.</p>
 */
mi.loadPageInfo = function() {
	if (window.pageInfo) {
		var pi = window.pageInfo;
		if (this.pageInfo == undefined) {
			this.pageInfo = new this.PageInfo(); // this shouldn't ever be the case, but just in case
		}
		for (var key in pi) {
			switch (key) {
				case "version":
					this.pageInfo.version = pi[key];
					break;
				case "section":
					if (pi[key].id) mi.pageInfo.setConf("sectionId",pi[key].id)
					if (pi[key].name) mi.pageInfo.setConf("sectionName",pi[key].name)
					break;
				case "asset":
					if (pi[key].id) mi.pageInfo.setConf("assetId",pi[key].id)
					if (pi[key].name) mi.pageInfo.setConf("title",pi[key].name)
					break;
			}
		}
		window.pageInfo = null;
	}
};
/*
 
 

 */

/** method for ensuring that js executes only after the document is ready
 *
 * @param {Integer} time How long (in seconds) to wait for the document to render
 * @param {String} target A JQuery-type selector
 * @param {Object} callback The function to execute when the document is ready
 * @author Scot Billman
 */
mi.wait_for_ready = function( time, target, callback ){
	var checker, time_spent = 0, interval = 3000;

	_check_document = function(){
		if( null !== $(target) ){
			clearInterval( checker );
			callback();
		} else {
			time_spent += interval/1000;
			if( time_spent >= time ){
				clearInterval( checker );
			}
		}
	};

	$(document).ready( function() {
		checker = setInterval( _check_document, interval );
	});
};

/** MI.js ^ ***************************************************************** */

