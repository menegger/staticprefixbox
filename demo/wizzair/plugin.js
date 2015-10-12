
function renderResult(response)
{
	var tableElement = document.getElementById("resultTable");

	// delete the prev suggestions
	tableElement.innerHTML = '';

	try
	{
		var responseJson = JSON.parse(response);
		var sl = responseJson.Results;

		var trElement = document.createElement('tr');
		
		var thElement = document.createElement('th');
		thElement.innerHTML = 'Departure city';
		trElement.appendChild(thElement);
		
		thElement = document.createElement('th');
		thElement.innerHTML = 'Arrival city';
		trElement.appendChild(thElement);
		
		thElement = document.createElement('th');
		thElement.innerHTML = 'Departure time';
		trElement.appendChild(thElement);
		
		thElement = document.createElement('th');
		thElement.innerHTML = 'Arrival time';
		trElement.appendChild(thElement);
		
		thElement = document.createElement('th');
		thElement.innerHTML = 'Price';
		trElement.appendChild(thElement);
		
		tableElement.appendChild(trElement);
		// render suggestions
		
		var renderedNumber = 0;
		for (var i = 0; i < sl.length && renderedNumber < 8; i++) {
			var sug = sl[i];
			var sugJson = JSON.parse(sug.Payload.substring(0, sug.Payload.length - 1));
			if(sugJson.Price > $("#ex1").val())
			{
				continue;
			}
			renderedNumber++;
			
			trElement = document.createElement('tr');
			var tdElement = document.createElement('td');
			
			
			
			tdElement.innerHTML = sugJson.DepartureCity;
			trElement.appendChild(tdElement);
			
			tdElement = document.createElement('td');
			tdElement.innerHTML = sugJson.ArrivalCity;
			trElement.appendChild(tdElement);
			
			tdElement = document.createElement('td');
			tdElement.innerHTML = sugJson.DepartureTime;
			trElement.appendChild(tdElement);
			
			tdElement = document.createElement('td');
			tdElement.innerHTML = sugJson.ArrivalTime;
			trElement.appendChild(tdElement);
			
			tdElement = document.createElement('td');
			tdElement.innerHTML = sugJson.Price + " EUR";
			trElement.appendChild(tdElement);
			
			tableElement.appendChild(trElement);
		}
	}
	catch(e)
	{
		
	}
}

/*
 * sitesearch.plugin.js
 * Copyright by Prefixbox
 */
 
 var departure = "";
 var departurebtr = "00df98be-07b0-463e-8221-c260cd3fbd3b";
 
 var arrival = "ANY";
 var arrivalbtr = "4bf29ce3-4bf5-4fef-b615-197c47aa651a";
 
 var resultbtr = "fab2882c-f985-4d60-ab32-c3a4573d5957"
 
    "use strict";
    if (typeof Prefixbox !== 'function') {

        var Prefixbox = function (options) {
            //Construct
            if (this) {
                this.options = options;
                this.selectorAttributeName = typeof options.selectorAttributeName != "undefined" ? options.selectorAttributeName : "data-prefixbox";
                this.selectorAttributeValue = typeof options.selectorAttributeValue != "undefined" ? options.selectorAttributeValue : "";
                this.inputAttributeName = "data-prefixbox";
                Prefixbox.siteTracker = typeof options.siteTracker != "undefined" ? options.siteTracker : null;
                Prefixbox.env = typeof options.env != "undefined" ? options.env : "live";
                Prefixbox.version = typeof options.version != "undefined" ? options.version : null;
                Prefixbox.hasCookie = typeof options.hasCookie != "undefined" ? options.hasCookie : 1;

                Prefixbox.eventUrl = options.eventUrl;

                this.init();
            } else {
                new Prefixbox(options);
            }
        }

        Prefixbox.generateGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        Prefixbox.env = null;
        Prefixbox.siteTracker = null;
        Prefixbox.boxes = [];
        Prefixbox.eventUrl = "";
        Prefixbox.pfbpvid = null;
        Prefixbox.hasCookie = null;
        Prefixbox.prototype = {
            init: function () {
                if (Prefixbox.pfbpvid === null) {
                    Prefixbox.pfbpvid = Prefixbox.generateGuid();
                }
                var inputs = [];

                if (this.selectorAttributeName == "id") {
                    inputs.push(document.getElementById(this.selectorAttributeValue));
                }
                else if (this.selectorAttributeName == "class" || this.selectorAttributeName == "name") {
                    if (this.selectorAttributeName == "class") {
                        inputs = document.getElementsByClassName(this.selectorAttributeValue);
                    }
                    else if (this.selectorAttributeName == "name") {
                        inputs = document.getElementsByName(this.selectorAttributeValue);
                    }
                }
                else {
                    var inputElements = document.getElementsByTagName("input");
                    for (var i = 0; i < inputElements.length; ++i) {
                        if (Prefixbox.attr(inputElements[i], this.inputAttributeName) == "true") {
                            inputs.push(inputElements[i]);
                        }
                    }
                }
                if (inputs.length > 0) {
                    for (var j = 0; j < 1; j++) {
                        Prefixbox.boxes.push(new PrefixboxInput(inputs[j], this.options));
                    }
                }
                else {
                    // log error if can't find input
                    console.log("ERROR: can't find the INPUT element.")
                }
            }
        }

        Prefixbox.noResultFound = function (query) {
            Prefixbox.sendEvent(query, new PfbEvent('Page.NoResultFound', {}));
        };

        Prefixbox.resultFound = function (query, count) {
            Prefixbox.sendEvent(query, new PfbEvent('Page.ResultFound', {
                "count": count
            }));
        };

        Prefixbox.resultClicked = function (query, position, title, url) {
            Prefixbox.sendEvent(query, new PfbEvent('Page.ResultClicked', {
                "position": position,
                "title": title,
                "url": url
            }));
        };

        Prefixbox.ajax = function (url, method, queryParams, callback, timeout, ontimeoutCallback) {
            var body;

            if (method.match(/^GET$/i)) {
                url += "?" + queryParams;
                body = queryParams;
            } else {
                body = null;
            }

            var request = Prefixbox.createXHR();
            request.ontimeout = ontimeoutCallback;
            request.open(method, url, true);
            request.timeout = timeout;
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            request.onreadystatechange = callback;

            request.send(queryParams);		// request.send(body); //Eventlogger bugfix 2015-05-28
        };

        Prefixbox.sendEvent = function (query, event, callback) {
            var btrList = [];

            for (var i in Prefixbox.boxes) {
                btrList.push(Prefixbox.boxes[i].btr);
            }

            var queryParams = "pageEvent=1";
            queryParams += "&event=" + event.getQueryParams();
            queryParams += "&sid=" + Prefixbox.siteTracker;
            queryParams += "&time=" + new Date().getTime();
            queryParams += "&env=" + Prefixbox.env;
            queryParams += "&v=" + Prefixbox.version;
            queryParams += "&pfbpvid=" + Prefixbox.pfbpvid;
            queryParams += "&pfbuid=" + Prefixbox.getGuid();
            queryParams += "&btrList=" + btrList.join();
            queryParams += "&pattern=" + query;
            queryParams += "&cookie=" + Prefixbox.hasCookie;
            queryParams += "&clientComponent=JsBrowserPlugin";

            Prefixbox.ajax(Prefixbox.eventUrl, 'POST', queryParams, callback, 1000, function () {
            });
        };

        Prefixbox.getGuid = function () {
            function readCookie(name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            }

            function createCookie(name, value, days) {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toGMTString();
                }
                else var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            }

            // some clients may not want us to write cookies
            // but we don't care for now
            var cookieName = '_pfbuid',
                cookieGuid = readCookie(cookieName);

            //        navigator.cookieEnabled

            var pfbuid;
            if (!pfbuid) {
                if (!cookieGuid || cookieGuid == "undefined") {
                    pfbuid = Prefixbox.generateGuid();
                    createCookie(cookieName, pfbuid);
                }
                else if (cookieGuid) {
                    pfbuid = cookieGuid;
                }
                else {
                    pfbuid = Prefixbox.generateGuid();
                }
            }

            return pfbuid;
        };

        Prefixbox.createXHR = function () {
            try {
                return new XMLHttpRequest();
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
            return null; // no XHR support
        };

        Prefixbox.attr = function (item, attrs) {
            if (typeof attrs == "string") {
                return item.getAttribute(attrs);
            }

            for (var key in attrs) {
                item.setAttribute(key, attrs[key]);
            }

            return true;
        };

        var PrefixboxInput = function (inputElement, options) {
            //Construct
            if (this) {
                this.input = inputElement;
                this.btr = options.btr;
                this.containerId = "pf-" + this.btr;
                this.hl = typeof options.hl != "undefined" ? options.hl : true;
                this.version = options.version;
                this.url = options.url;
                this.eventUrl = options.eventUrl;
                this.alwaysOpen = typeof options.alwaysOpen != "undefined" ? options.alwaysOpen : false;
                var scCss = "";
                if (this.alwaysOpen) {
                    scCss = "margin:0;padding:0;display:block;background:#fff;width:100%;box-sizing:border-box;z-index:10000;";
                } else {
                    scCss = "margin:0;padding:0;display:none;position:absolute;background:#fff;border:1px solid #eee;width:100%;box-sizing:border-box;z-index:10000;";
                }
                this.resultContainerCss = typeof options.resultContainerCss != "undefined" ? options.resultContainerCss : "";
                this.cssStyle = options.cssStyle
                    ? options.cssStyle
                    : "#" + this.containerId + ".pf-suggestion-container{"
                    + scCss
                    + this.resultContainerCss + "}#" + this.containerId + ".pf-suggestion-container.open{display:block}#" + this.containerId + ".pf-suggestion-container div.pf-branding{display:none;font-size:10px;color:#ccc;text-align:right;padding:5px;}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list{list-style:none;margin:0;padding:0}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion{padding:5px;margin:0;color:#666;cursor:default;overflow:hidden;zoom:1}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion b{color:#000}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion.pf-selected{background:#dedede}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-body,#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-left,#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-right{display:table-cell;vertical-align:middle}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-body{width:10000px; font-weight: 400}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-body span.pf-highlight{font-weight:700; color: #000}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-left,#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion > .pull-left{padding-right:10px}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-left img{max-width:inherit;max-height:inherit}#" + this.containerId + ".pf-suggestion-container ul.pf-suggestion-list li.pf-suggestion .pf-suggestion-right{white-space:nowrap;}";
                this.eventEnabled = typeof options.eventEnabled != "undefined" ? options.eventEnabled : true;
                this.eventKeypressEnabled = typeof options.eventKeypressEnabled != "undefined" ? options.eventKeypressEnabled : true;
                this.boxType = typeof options.boxType != "undefined" ? options.boxType : "prefixbox";
                this.env = typeof options.env != "undefined" ? options.env : "live";
                this.boxSettings = typeof options.boxSettings != "undefined" ? options.boxSettings : "[]";
                this.removeEvents = typeof options.removeEvents != "undefined" ? options.removeEvents : true;
                this.fillOnClick = typeof options.fillOnClick != "undefined" ? options.fillOnClick : false;
                this.overrideFormSubmit = typeof options.overrideFormSubmit != "undefined" ? options.overrideFormSubmit : false;
                this.showBranding = typeof options.showBranding != "undefined" ? options.showBranding : false;
                this.siteTracker = typeof options.siteTracker != "undefined" ? options.siteTracker : "";

                this.format = 'json';
                this.callback = '';
                this.queryName = 'pattern';
                this.cup = 0;
                this.pquery = '';
                this.hasCookie = 1;
                this.method = 'GET';
                this.slPos = 0;
                this.lastQuery = null;
                this.sl = [];
                this.resultOpen = false;
                this.requestTimeout = 1000;
                this.eventRequestTimeout = 1000;
                this.requestDelay = 50;
                this.requestTimer = null;
                this.form = null;
                this.prevRequest = null;

                this.init();
            } else {
                new Prefixbox(options);
            }
        };

        PrefixboxInput.prototype = {
            init: function () {
                var self = this;
                // generate GUID for user and save it in cookie
                this.pfbuid = this._getGuid();
                this.generateNewPfbiid();

                // load CSS
                this.loadCss();

                this.form = this.closest(this.input, "form");

                var inputParent = this.input.parentNode;
                inputParent.style.position = 'relative';

                this.input.autocomplete = "off";
                this.input.className = this.input.className + " pf-input";

                this.result = document.createElement('ul');
                this.result.className = 'pf-suggestion-list';
                this.resultContainer = document.createElement('section');
                this.resultContainer.id = this.containerId;
                this.resultContainer.className = "pf-suggestion-container";
                if ((this.resultContainerCss == '' || this.env == "prefixboxportal") && !this.alwaysOpen) {
                    this.resultContainer.style.top = parseInt(this.input.offsetTop + this.input.offsetHeight) + 'px';
                    this.resultContainer.style.left = '1px';
                }
                this.resultContainer.appendChild(this.result);
                this.brandingDiv = null;
                if (this.showBranding) {
                    this.brandingDiv = document.createElement('div');
                    this.brandingDiv.className = "pf-branding";
                    this.brandingDiv.innerHTML = "Powered by Prefixbox";
                    this.resultContainer.appendChild(this.brandingDiv);
                }
                inputParent.appendChild(this.resultContainer);

                // get prev query
                if (typeof QueryString.pquery != 'undefined') {
                    this.pquery = QueryString.pquery;
                }

                // bind input field
                this.bindInput();

                // post event
                this.sendEvent(new PfbEvent('Box.Loaded'), "", function () {
                    if (self.inputFocused()) {
                        self.sendRequest();
                    }
                });
            },

            bindInput: function () {
                if (this.input) {
                    var self = this;

                    Prefixbox.attr(this.input, {"autocomplete": "off"});

                    this._addEventListener(this.input, "focus", function (e) {
                        // post event
                        self.sendEvent(new PfbEvent('Focus.In', {}));

                        self.sendRequest();
                    });

                    this._addEventListener(this.input, "blur", function (e) {
                        if (self.isOpen()) {
                            // post event
                            self.sendEvent(new PfbEvent('Focus.Out', {}));
                            self.close();
                        }
                    });

                    this._addEventListener(this.input, "keyup", function (e) {
                        var prevSlPos = self._getSlPos(),
                            doRequest = false,
                            pos = 0;

                        switch (self._getCharCode(e)) {
                            case 38: // up
                                if (self.isClosed()) {
                                    doRequest = true;
                                } else {
                                    pos = (self._getSlPos() > 0) ? self._getSlPos() - 1 : self.sl.length;
                                    self._selectCurrent(pos, prevSlPos, true);
                                }
                                break;

                                // commented out for now
                                //                    case 39: // right
                                //                        //if suggestion position is 0
                                //                        if (self._getSlPos() == 0) {
                                //                            self._setSuggestion(0);
                                //                            doRequest = true;
                                //                        }
                                //                        break;

                            case 40: // down
                                if (self.isClosed()) {
                                    doRequest = true;
                                } else {
                                    pos = (self._getSlPos() < self.sl.length) ? parseInt(self._getSlPos()) + 1 : 0;
                                    self._selectCurrent(pos, prevSlPos, true);
                                }
                                break;

                            case 27: // escape
                                self.close();
                                break;

                            default :
                                if (!self._isUselessKey(e)) {
                                    doRequest = true;
                                }
                                break;
                        }

                        if (doRequest) {
                            self.sendRequest();
                        }

                    });

                    this._addEventListener(this.input, "keydown", function (e) {
                        switch (self._getCharCode(e)) {
                            case 9: // tab
                                // post event
                                self.sendEvent(new PfbEvent('Focus.Out', {}));
                                self.close();
                                break;
                            default:
                                break;
                        }
                    });

                    this._addEventListener(this.input, "keypress", function (e) {
                        switch (self._getCharCode(e)) {
                            case 13: // enter
                                // if overrideFormSubmit OR doesn't have parent form, selectSuggestion when press enter
                                if (self.overrideFormSubmit ||
                                    (!self.overrideFormSubmit && (self._getSlPos() > 0 || (!self.hasParentForm() && !self.isStandalone())))) {
                                    e.preventDefault();

									if(self.btr == departurebtr)
									{
										departure = (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Tag : '');
									}
									else if(self.btr == arrivalbtr)
									{
										arrival = (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Tag : '');
									}
									Prefixbox.boxes[2].sendRequest();
									
                                    // post event
                                    self.sendEvent(new PfbEvent('QueryExecuted.Enter', {
                                        "clickThroughUrl": self._getClickThroughUrl(),
                                        "selectedIndex": self._getSlPos(),
                                        "selectedSuggestion": (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Text : '')
                                    }), self._getSuggestionListQueryParams(), function () {
                                        self.selectSuggestion();
                                        self.close();
                                        self.generateNewPfbiid();
                                    });
                                }
                                break;

                            default:
                                if (self.eventKeypressEnabled) {
                                    self.sendEvent(new PfbEvent('Key.Press', {"keycode": self._getCharCode(e)}));
                                }
                                break;
                        }
                    });

                    // find parent form, bind submit event
                    if (this.isPrefixbox() && (this.hasParentForm())) {
                        this._addEventListener(this.form, "submit", function (e) {
                            e.preventDefault();
                            //if (self.overrideFormSubmit || self._getSlPos() > 0) {
                            //    e.preventDefault();
                            //}

                            // post event
                            self.sendEvent(new PfbEvent('QueryExecuted.Submit', {
                                "clickThroughUrl": self._getClickThroughUrl(),
                                "selectedIndex": self._getSlPos(),
                                "selectedSuggestion": (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Text : '')
                            }), self._getSuggestionListQueryParams(), function () {
                                self.selectSuggestion();
                                self.close();
                                self.generateNewPfbiid();
                                if (!(self.overrideFormSubmit || self._getSlPos()) > 0) {
                                    self.form.submit();
                                }
                            });
                        });
                    }
                }
            },

            _getQueryParams: function () {
                this.cup = this.getCaretPosition(this.input);
                var queryParams = "";
                if (this.method == 'GET') {
                    queryParams += "btr=" + encodeURIComponent(this.btr) + "&";
					if(this.btr==arrivalbtr)
					{
						queryParams += this.queryName + "=" + departure+"||" + encodeURIComponent(this._getInputValue()) + "&";
						if(this._getInputValue() == "")
						{
							arrival = "ANY";
							Prefixbox.boxes[2].sendRequest();
						}
					}
					else if(this.btr == resultbtr)
					{
						
						queryParams += this.queryName + "=" + departure + "||" + arrival + "||";
						var date = $("#datetimepicker").data("DateTimePicker").date();
						if(date==null)
						{
							queryParams+="ANY&";
						}
						else
						{
							queryParams+=encodeURIComponent($("#datetimepicker").data("DateTimePicker").date().format("M/D/YYYY")) + "&";
						}
					}
					else
					{
						queryParams += this.queryName + "=" + encodeURIComponent(this._getInputValue()) + "&";
                    }
					queryParams += "v=" + this.version + "&";
                    queryParams += "cup=" + this.cup + "&";
                    queryParams += "pfbpvid=" + Prefixbox.pfbpvid + "&";
                    queryParams += "pfbuid=" + this.pfbuid + "&";
                    queryParams += "pfbiid=" + this.pfbiid + "&";
                    queryParams += "pquery=" + encodeURIComponent(this.pquery) + "&";
                    queryParams += "time=" + new Date().getTime() + "&";
                    queryParams += "format=" + this.format + "&";
                    queryParams += "callback=" + this.callback + "&";
                    queryParams += "env=" + this.env + "&";
                    queryParams += "boxType=" + this.boxType + "&";
                    queryParams += "clientComponent=JsBrowserPlugin&";
                    queryParams += "hl=" + this.hl + "&";
                    queryParams += "sid=" + this.siteTracker;

                }

                return queryParams;
            },

            _getEventQueryParams: function () {
                this.cup = this.getCaretPosition(this.input);
                var queryParams = "";
                if (this.method == 'GET') {
                    queryParams += "btr=" + encodeURIComponent(this.btr) + "&";
                    queryParams += this.queryName + "=" + encodeURIComponent(this._getInputValue()) + "&";
                    queryParams += "v=" + this.version + "&";
                    queryParams += "cup=" + this.cup + "&";
                    queryParams += "pfbpvid=" + Prefixbox.pfbpvid + "&";
                    queryParams += "pfbuid=" + this.pfbuid + "&";
                    queryParams += "pfbiid=" + this.pfbiid + "&";
                    queryParams += "pquery=" + encodeURIComponent(this.pquery) + "&";
                    queryParams += "time=" + new Date().getTime() + "&";
                    queryParams += "env=" + this.env + "&";
                    queryParams += "boxType=" + this.boxType + "&";
                    queryParams += "clientComponent=JsBrowserPlugin&";
                    queryParams += "cookie=" + this.hasCookie + "&";
                    queryParams += "sid=" + this.siteTracker;
                }

                return queryParams;
            },

            _getCharCode: function (e) {
                return (typeof e.which == "number") ? e.which : e.keyCode;
            },

            _isUselessKey: function (e) {
                var c = this._getCharCode(e);
                return c == 37   // left arrow
                    || c == 39    // right arrow
                    || c == 9    // tab
                    || c == 16   // shift
                    || c == 17   // ctrl
                    || c == 18   // alt
                    || c == 19   // pause/break
                    || c == 20   // caps lock
                    || c == 33   // pg up
                    || c == 34   // pg down
                    || c == 91   // l win key
                    || c == 92   // r win key
                    || c == 13   // enter
                ;
            },

            _getSuggestionListQueryParams: function () {
                return encodeURIComponent(JSON.stringify(this.sl));
            },

            _getSlPos: function () {
                return parseInt(this.slPos);
            },

            _getGuid: function () {
                return Prefixbox.getGuid();
            },

            sendRequest: function () {
                var self = this;

                // if has req timer, clear
                if (self.requestTimer) {
                    clearTimeout(self.requestTimer);
                }

                self.requestTimer = setTimeout(function () {
                    self.ajax(self.url, self.method, self._getQueryParams(), function () {
                        if (this.readyState == 4 && this.status == 200) { 			// IE Bugfix (in IE req is only set after this function has been completed)
                            // clear timeout, req success
                            //                    clearTimeout(requestTimeoutTimer);
                            self.prevRequest = null;
							if(self.btr!=resultbtr)
							{
								self.renderSuggestions(this.response);
							}
							else
							{
								renderResult(this.response);
							}
                        }
                    }, self.requestTimeout, function () {
                        self.close();

                        // post event
                        self.sendEvent(new PfbEvent('Request.Timeout', {}));
                    }, true);
                }, self.requestDelay);
            },

            sendEvent: function (event, content, callback) {
                if (this.eventEnabled) {
                    var queryParams = this._getEventQueryParams(event) + "&event=" + event.getQueryParams();

                    if (typeof content != 'undefined' && content != "") {
                        queryParams += "&content=" + content;
                    }

                    this.ajax(this.eventUrl, 'POST', queryParams, callback, this.eventRequestTimeout, function () {
                    }, false);
                } else if (typeof callback != 'undefined') {
                    callback();
                }
            },

            ajax: function (url, method, queryParams, callback, timeout, ontimeoutCallback, abortPrevRequest) {
                var body;

                // if we have not finished previous request, abort it
                if (abortPrevRequest && this.prevRequest && this.prevRequest.readyState < 4) {
                    this.prevRequest.abort();
                    this.prevRequest = null;
                }

                if (method.match(/^GET$/i)) {
                    url += "?" + queryParams;
                    body = queryParams;
                } else {
                    body = null;
                }

                var request = Prefixbox.createXHR();
                if (abortPrevRequest) {
                    this.prevRequest = request;
                }
                request.ontimeout = ontimeoutCallback;
                request.open(method, url, true);
                request.timeout = timeout;
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                request.onreadystatechange = callback;

                request.send(queryParams);		// request.send(body); //Eventlogger bugfix 2015-05-28
            },

            _selectCurrent: function (pos, prevSlPos, fillInput) {
                this.slPos = pos;

                this._hoverSuggestion(this._getSlPos(), prevSlPos);

                if (fillInput) {
                    if (this._getSlPos() != 0) {
                        // save the last query
                        if (this.lastQuery === null) {
                            this.lastQuery = this._getInputValue();
                        }
                        this._setCurrentValue();

                        // post event
                        this.sendEvent(new PfbEvent('Suggestion.Selected', {"selectedIndex": this._getSlPos(), "selectedSuggestion": this._getInputValue()}));

                    } else {
                        this._setInputValue(this.lastQuery);
                        this.lastQuery = null;
                    }
                }
            },

            _getInputValue: function () {
                return this.input.value;
            },

            _setCurrentValue: function () {
                //this._setInputValue(this.sl[this._getSlPos() - 1]);
				this._setInputValue(this.sl[this._getSlPos() - 1 ].DisplayText.replace("<b>","").replace("</b>",""));
            },

            _setInputValue: function (val) {
                this.input.value = val;
            },

            _hoverSuggestion: function (pos, prevSlPos) {
                if (prevSlPos > 0) {
                    this.result.childNodes[prevSlPos - 1].className = "pf-suggestion";
                }

                if (pos > 0) {
                    this.result.childNodes[pos - 1].className = "pf-suggestion pf-selected";
                }
            },

            _setSuggestion: function (pos) {
                if (pos >= 0 && pos < this.sl.length) {
                    this._setInputValue(this.sl[pos].Text);
                }
            },

            renderSuggestions: function (response) {
                var self = this;
                this.slPos = 0;

                // delete the prev suggestions
                this.result.innerHTML = '';

                try {
                    var responseJson = JSON.parse(response);
                    this.sl = responseJson.Results;

                    // render suggestions
                    for (var i = 0; i < this.sl.length; i++) {
                        var sug = this.sl[i];
                        this._renderSuggestion(i + 1, sug);
                    }

                    // post event
                    self.sendEvent(new PfbEvent('Content.Rendered', {}), self._getSuggestionListQueryParams());

                } catch (e) {
                    this.result.innerHTML = response;
                }

                if (this.sl.length > 0 && self.inputFocused()) {
                    this.open();
                    this._openBrandingDiv();
                }
                else {
                    this.close();
                    this._closeBrandingDiv();
                }
            },

            _openSuggestionContainer: function () {
                this.resultContainer.className = "pf-suggestion-container open";
            },

            _closeSuggestionContainer: function () {
                this.resultContainer.className = "pf-suggestion-container";
            },

            _renderSuggestion: function (i, sug) {
                var self = this;
                var newLi = document.createElement('li');
                if (sug.IconURL) {
                    var iconImg = document.createElement('img');
                    iconImg.src = sug.IconURL;
                    var iconDiv = document.createElement('span');
                    iconDiv.className = 'pf-suggestion-left';
                    iconDiv.appendChild(iconImg);
                    newLi.appendChild(iconDiv);
                }

                var textDiv = document.createElement('span');
                textDiv.className = 'pf-suggestion-body';
                textDiv.innerHTML = sug.DisplayText;
                newLi.appendChild(textDiv);

                if (sug.Tag) {
                    var tagDiv = document.createElement('span');
                    tagDiv.className = 'pf-suggestion-right';
                    tagDiv.innerHTML = sug.Tag;
                    newLi.appendChild(tagDiv);
                }

                newLi.className = 'pf-suggestion';
                Prefixbox.attr(newLi, {"data-index": i});

                // bind suggestion item mousedown event te prevent input blur
                this._addEventListener(newLi, "mousedown", function (e) {
                    if (self.isOpen()) {
                        e.preventDefault();
                    }
                });
                // bind suggestion item click event
                this._addEventListener(newLi, "click", function (e) {
                    var index = Prefixbox.attr(this, "data-index");

                    // if it's a prefixbox, selectSuggestion
                    if ((self.isPrefixbox() || self.isStandalone()) && !self.fillOnClick) {
                        // post event
                        self.sendEvent(new PfbEvent(
                            'QueryExecuted.Selected', {
                                "clickThroughUrl": self._getClickThroughUrl(index),
                                "selectedIndex": index,
                                "selectedSuggestion": self.sl[index - 1].Text,
                                "lookupMode": self.sl[index - 1].LookupMode,
                                "dsTracker": self.sl[index - 1].DsTracker
                            }), self._getSuggestionListQueryParams(), function () {
                                self.selectSuggestion(index);
                                self.generateNewPfbiid();
                                self.close();
                            });

                    }
                        // if dropdown, fill the input with selected value
                    else if (self.isDropdown() || self.fillOnClick) {
                        // post event
                        self.sendEvent(new PfbEvent(
                            'BoxFilled.Selected', {
                                "clickThroughUrl": self._getClickThroughUrl(index),
                                "selectedIndex": index,
                                "selectedSuggestion": self.sl[index - 1].Text
                            }), self._getSuggestionListQueryParams());

                        self.selectSuggestion(index);
                        self.generateNewPfbiid();
                        self.close();
						
						Prefixbox.boxes[2].sendRequest();
						
						if(self.btr == departurebtr)
						{
							departure = (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Tag : '');
						}
						else if(self.btr == arrivalbtr)
						{
							arrival = (self._getSlPos() > 0 ? self.sl[self._getSlPos() - 1].Tag : '');
						}
                    }

                });
                newLi.addEventListener("mouseenter", function (e) {
                    var prevSlPos = self._getSlPos();
                    var pos = Prefixbox.attr(e.target, "data-index");
                    self._selectCurrent(pos, prevSlPos, false);
                });
                newLi.addEventListener("mouseleave", function (e) {
                    var prevSlPos = self._getSlPos();
                    self._selectCurrent(0, prevSlPos, false);
                });

                this.result.appendChild(newLi);
            },

            selectSuggestion: function (pos) {
                if (typeof pos == 'undefined') {
                    pos = this._getSlPos();
                }

                if (this.isPrefixbox() || this.isStandalone()) {
                    this.goToUrl(pos);
                } else if (this.isDropdown()) {
                    if (this._getDisplayText(pos)) {
                        this._setInputValue(this._getDisplayText(pos));
                    }
                }
            },

            goToUrl: function (pos) {
                var url = this._getClickThroughUrl(pos);
                if (url) {
                    window.location.href = url;
                }
            },

            _getClickThroughUrl: function (pos) {
                var url;
                // we specify the cur position
                if (pos && pos > 0) {
                    url = this.sl[pos - 1].ClickThroughUrl + this._getQuerySeparator(this.sl[pos - 1].ClickThroughUrl) + "pquery=" + encodeURIComponent(this.sl[pos - 1].Text);
                }
                    // no suggestion selected, use the BoxSettings' url
                else if (this._getSlPos() == 0 && this.boxSettings && this.boxSettings.ClickThroughUrl && this._getInputValue()) {
                    var cltUrl = this.boxSettings.ClickThroughUrl
                        .replace(/%suggestion%/g, encodeURIComponent(this._getInputValue()))
                        .replace(/%pattern%/g, encodeURIComponent(this._getInputValue()));
                    url = cltUrl + this._getQuerySeparator(this.boxSettings.ClickThroughUrl) + "pquery=" + encodeURIComponent(this._getInputValue());
                } else if (this.sl[this._getSlPos() - 1]) {
                    url = this.sl[this._getSlPos() - 1].ClickThroughUrl + this._getQuerySeparator(this.sl[this._getSlPos() - 1].ClickThroughUrl) + "pquery=" + encodeURIComponent(this.sl[this._getSlPos() - 1].Text);
                }

                return url;
            },
			
			_getDisplayText: function (pos) {
                if (pos && pos > 0) {
                    return this.sl[pos - 1].DisplayText.replace("<b>","").replace("</b>","");
                }
                return "";
            },
			
            _getSuggestionText: function (pos) {
                if (pos && pos > 0) {
                    return this.sl[pos - 1].Text;
                }
                return "";
            },

            generateNewPfbiid: function () {
                this.pfbiid = Prefixbox.generateGuid();
            },

            isPrefixbox: function () {
                return this.boxType == "prefixbox";
            },

            isDropdown: function () {
                return this.boxType == "dropdown";
            },

            isStandalone: function () {
                return this.boxType == "standalone";
            },

            loadCss: function () {
                var css = document.createElement("style");
                css.type = "text/css";
                css.innerHTML = this.cssStyle;
                document.body.appendChild(css);
            },

            open: function () {
                if (this.alwaysOpen) {
                    return false;
                }
                if (this.sl.length > 0) {
                    this._openSuggestionContainer();
                    this.resultOpen = true;
                }
                return true;
            },

            isOpen: function () {
                if (this.alwaysOpen)
                    return true;
                return this.resultOpen;
            },

            close: function () {
                if (this.alwaysOpen)
                    return false;
                this._closeSuggestionContainer();
                this.resultOpen = false;
                return true;
            },

            isClosed: function () {
                return !this.isOpen();
            },

            _getQuerySeparator: function (url) {
                return (url.match(/\?/)) ? '&' : '?';
            },

            _addEventListener: function (element, event, handler) {
                // remove other events, keep prefixbos's events only
                if (!this.removeEvents) {
                    element.addEventListener(event, handler);
                } else {
                    eval("arguments[0]." + "on" + event + " = arguments[2];");
                    // original: eval("element." + "on" + event + " = handler;");
                    // had to be changed because of minification
                }
            },

            inputFocused: function () {
                return this.input == document.activeElement;
            },

            hasParentForm: function () {
                return this.form;
            },
            closest: function (element, tagName) {
                var parent = element.parentNode;

                while (parent != document.body) {
                    if ((parent) && parent.nodeName.toLowerCase() == tagName.toLowerCase())
                        return parent;
                    else
                        parent = parent.parentNode;
                }
                return null;
            },
            getCaretPosition: function (oField) {

                // Initialize
                var iCaretPos = 0;

                //    // IE Support
                //    if (document.selection) {
                //
                //        // Set focus on the element
                //        oField.focus();
                //
                //        // To get cursor position, get empty selection range
                //        var oSel = document.selection.createRange();
                //
                //        // Move selection start to 0 position
                //        oSel.moveStart('character', -oField.value.length);
                //
                //        // The caret position is selection length
                //        iCaretPos = oSel.text.length;
                //    }
                //    // Firefox support
                //    else if (oField.selectionStart || oField.selectionStart == '0') {
                //        iCaretPos = oField.selectionStart;
                //    }

                // Return results
                return (iCaretPos);
            },

            _openBrandingDiv: function () {
                if (this.brandingDiv) {
                    this.brandingDiv.style.display = "block";
                }
            },

            _closeBrandingDiv: function () {
                if (this.brandingDiv) {
                    this.brandingDiv.style.display = "none";
                }
            }
        }

        var PfbEvent = function (name, params) {
            //Construct
            if (this) {
                this.name = name;
                this.params = params;
            } else {
                new PfbEvent(name, params);
            }
        };

        PfbEvent.prototype = {
            getQueryParams: function () {
                var args = {"Name": this.name, "Params": this.params};

                return encodeURIComponent(JSON.stringify(args));
            },
            getParams: function () {
                return this.params;
            }
        }

        var QueryString = function () {
            // This function is anonymous, is executed immediately and
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]], pair[1] ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        }();

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function loadPrefixBoxes ()
    {
            
        var pb_0 = new Prefixbox({
            'btr': '00df98be-07b0-463e-8221-c260cd3fbd3b',
            'hl': true,
            'version': '2.0',
            'url': 'http://serving.prefixbox.com/',
            'eventUrl': 'http://logging.prefixbox.com/',
            'eventEnabled': true,
            'eventKeypressEnabled': false,
            'overrideFormSubmit': false,
            'boxType': 'dropdown',
            'alwaysOpen' : false,
            'siteTracker' : '4cb4f267-3fee-4db1-ba92-b5173b4ed57e',
            'showBranding' : false,
                'env': 'prefixboxportal',
                            
            'selectorAttributeName': 'id',
            'selectorAttributeValue': 'departure',
            
                        'boxSettings' : {'ClickThroughUrl' : ''}
        });
    
		var pb_1 = new Prefixbox({
            'btr': '4bf29ce3-4bf5-4fef-b615-197c47aa651a',
            'hl': true,
            'version': '2.0',
            'url': 'http://serving.prefixbox.com/',
            'eventUrl': 'http://logging.prefixbox.com/',
            'eventEnabled': true,
            'eventKeypressEnabled': false,
            'overrideFormSubmit': false,
            'boxType': 'dropdown',
            'alwaysOpen' : false,
            'siteTracker' : '4cb4f267-3fee-4db1-ba92-b5173b4ed57e',
            'showBranding' : false,
                'env': 'prefixboxportal',
                            
            'selectorAttributeName': 'id',
            'selectorAttributeValue': 'arrival',
            
                        'boxSettings' : {'ClickThroughUrl' : ''}
        });
		
		var pb_2 = new Prefixbox({
            'btr': 'fab2882c-f985-4d60-ab32-c3a4573d5957',
            'hl': true,
            'version': '2.0',
            'url': 'http://serving.prefixbox.com/',
            'eventUrl': 'http://logging.prefixbox.com/',
            'eventEnabled': true,
            'eventKeypressEnabled': false,
            'overrideFormSubmit': false,
            'boxType': 'dropdown',
            'alwaysOpen' : false,
            'siteTracker' : '4cb4f267-3fee-4db1-ba92-b5173b4ed57e',
            'showBranding' : false,
                'env': 'prefixboxportal',
                            
            'selectorAttributeName': 'id',
            'selectorAttributeValue': 'result',
            
                        'boxSettings' : {'ClickThroughUrl' : ''}
        });
    }

    window.addEventListener('load', loadPrefixBoxes);
