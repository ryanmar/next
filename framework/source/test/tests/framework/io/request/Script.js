/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 *
 * @asset(qx/test/jsonp_primitive.php)
 * @asset(qx/test/script.js)
 * @asset(qx/test/xmlhttp/sample.txt)
 * @ignore(SCRIPT_LOADED)
 */
describe("io.request.Script", function() {

  beforeEach(function() {
    var req = this.req = new qx.io.request.Script();
    this.url = this.getUrl("qx/test/script.js");
  });


  afterEach(function() {
    this.getSandbox().restore();
    this.req.dispose();
  });

  //
  // General
  //

  it("create instance", function() {
    assert.isObject(this.req);
  });


  it("dispose() removes script from DOM", function() {
    var script;

    this.req.open();
    this.req.send();
    script = this.req._getScriptElement();
    this.req.dispose();

    assert.isFalse(this.isInDom(script));
  });


  it("isDisposed()", function() {
    assert.isFalse(this.req.isDisposed());
    this.req.dispose();
    assert.isTrue(this.req.isDisposed());
  });


  it("allow many requests with same object", function() {
    var count = 0,
      that = this;

    this.req.on("load", function() {
      count += 1;
      if (count == 2) {
        that.resume(function() {});
        return;
      }
      that.request();
    });

    this.request();
    this.wait();
  });

  //
  // Event helper
  //

  it("fire event", function() {
    var req = this.req;
    var event = this.spy();
    req.on("event", event);
    req.emit("event");
    this.assertCalled(event);
  });

  //
  // Properties
  //

  it("properties indicate success when request completed", function() {
    var that = this,
      req = this.req;

    req.on("load", function() {
      that.resume(function() {
        assert.equal(4, req.readyState);
        assert.equal(200, req.status);
        assert.equal("200", req.statusText);
      });
    });

    this.request();
    this.wait();
  });

  /**
   * @ignore(SCRIPT_LOADED)
   */

  it("status indicates success when determineSuccess returns true", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal(200, that.req.status);
      });
    });

    this.req.setDetermineSuccess(function() {
      return SCRIPT_LOADED === true;
    });

    this.request(this.getUrl("qx/test/script.js"));
    this.wait();
  });

  // Error handling

  it("properties indicate failure when request failed", function() {
    var that = this,
      req = this.req;

    req.on("error", function() {
      that.resume(function() {
        assert.equal(4, req.readyState);
        assert.equal(0, req.status);
        assert.isNull(req.statusText);
      });
    });

    this.request("http://fail.tld");
    this.wait(15000);
  });


  it("properties indicate failure when request timed out", function() {

    // Known to fail in legacy IEs
    if (this.isIeBelow(9)) {
      this.skip();
    }

    var that = this,
      req = this.req;

    req.timeout = 25;
    req.on("timeout", function() {
      that.resume(function() {
        assert.equal(4, req.readyState);
        assert.equal(0, req.status);
        assert.isNull(req.statusText);
      });
    });

    this.requestPending();
    this.wait();
  });


  it("status indicates failure when determineSuccess returns false", function() {
    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        assert.equal(500, that.req.status);
      });
    });

    this.req.setDetermineSuccess(function() {
      return false;
    });

    this.request();
    this.wait();
  });


  it("reset XHR properties when reopened", function() {
    var req = this.req,
      that = this;

    req.on("load", function() {
      that.resume(function() {
        req.open("GET", "/url");
        that.assertIdentical(1, req.readyState);
        that.assertIdentical(0, req.status);
        that.assertIdentical("", req.statusText);
      });
    });

    this.request();
    this.wait();
  });

  //
  // open()
  //

  it("open() stores URL", function() {
    this.req.open("GET", this.url);
    assert.equal(this.url, this.req._getUrl());
  });

  //
  // send()
  //

  it("send() adds script element to DOM", function() {
    var req = this.req;

    // Helper triggers send()
    this.request();

    assert(this.isInDom(req._getScriptElement()), "Script element not in DOM");
  });


  it("send() sets script src to URL", function() {
    this.request();
    assert.match(this.req._getScriptElement().src, /qx\/test\/script.js$/);
  });


  it("send() with data", function() {
    this.skip();
  });

  //
  // abort()
  //

  it("abort() removes script element", function() {
    var req = this.req;

    this.requestPending();
    req.abort();

    assert.isFalse(this.isInDom(req._getScriptElement()), "Script element in DOM");
  });


  it("abort() makes request not fire load", function() {
    var req = this.req;
    var globalStack = [];

    // test preparation
    var emitOrig = req.emit;
    this.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    if (this.isIe()) {
      this.request(this.noCache(this.url));
    } else {
      this.request();
    }

    req.abort();

    this.wait(300, function() {
      assert.isTrue(globalStack.indexOf("onload") === -1);
    }, this);
  });

  //
  // setRequestHeader()
  //

  it("setRequestHeader() throws error when other than OPENED", function() {
    var req = this.req;

    assert.throw(function() {
      req.setRequestHeader();
    }, null, "Invalid state");
  });


  it("setRequestHeader() appends to URL", function() {
    var req = this.req;

    req.open("GET", "/affe");
    req.setRequestHeader("key1", "value1");
    req.setRequestHeader("key2", "value2");

    assert.match(req._getUrl(), /key1=value1/);
    assert.match(req._getUrl(), /key2=value2/);
  });

  //
  // Event handlers
  //

  it("call onload", function() {

    // More precisely, the request completes when the browser
    // has loaded and parsed the script

    var that = this;

    this.req.on("load", function() {
      that.resume(function() {});
    });

    this.request();
    this.wait();
  });


  it("call onreadystatechange and have appropriate readyState", function() {
    var req = this.req,
      readyStates = [],
      that = this;

    req.on("readystatechange", function() {
      readyStates.push(req.readyState);

      if (req.readyState === 4) {
        that.resume(function() {
          assert.deepEqual([1, 2, 3, 4], readyStates);
        });
      }
    });

    if (this.isIe()) {
      this.request(this.noCache(this.url));
    } else {
      this.request();
    }

    this.wait();
  });

  // Error handling

  it("call onloadend on network error", function() {
    var that = this;

    this.req.on("loadend", function() {
      that.resume(function() {});
    });

    this.request("http://fail.tld");
    this.wait(15000);
  });


  it("call onloadend when request completes", function() {
    var that = this;

    this.req.on("loadend", function() {
      that.resume(function() {});
    });

    this.request();
    this.wait();
  });


  it("not call onload when loading failed because of network error", function() {

    // Known to fail in IE < 9,
    // i.e. all browsers using onreadystatechange event handlerattribute
    //
    // After a short delay, readyState progresses to "loaded" even
    // though the resource could not be loaded.
    if (this.isIeBelow(9)) {
      this.skip();
    }

    var that = this;

    this.req.on("load", function() {
      that.resume(function() {
        throw Error("Called onload");
      });
    });

    this.req.on("error", function() {
      that.resume();
    });

    this.request("http://fail.tld");
    this.wait(15000);
  });


  it("call onerror on network error", function() {

    // Known to fail in legacy IEs
    if (this.isIeBelow(9)) {
      this.skip();
    }

    var that = this;

    this.req.on("error", function() {
      that.resume(function() {});
    });

    this.request("http://fail.tld");
    this.wait(15000);
  });


  it("call onerror on invalid script", function() {

    // Known to fail in all browsers tested
    // Native "error" event not fired for script element.
    //
    // A possible work-around is to listen to the global "error"
    // event dispatched on the window.
    this.skip();

    var that = this;

    this.req.onerror = function() {
      that.resume(function() {});
    };

    // Invalid JavaScript
    this.request(this.getUrl("qx/test/xmlhttp/sample.txt"));

    this.wait();
  });


  it("not call onerror when request exceeds timeout limit", function() {
    var req = this.req;
    var globalStack = [];

    // test preparation
    var emitOrig = req.emit;
    this.stub(req, "emit", function(evt) {
      globalStack.push(evt);
      emitOrig.call(this, evt);
    });

    // Known to fail in browsers not supporting the error event
    // because timeouts are used to fake the "error"
    if (!this.supportsErrorHandler()) {
      this.skip();
    }

    req.timeout = 25;
    this.requestPending();

    this.wait(20, function() {
      assert.isTrue(globalStack.indexOf("onload") === -1);
    }, this);
  });


  it("call ontimeout when request exceeds timeout limit", function() {
    var that = this;

    this.req.timeout = 25;
    this.req.on("timeout", function() {
      that.resume(function() {});
    });

    this.requestPending();
    this.wait();
  });


  it("not call ontimeout when request is within timeout limit", function() {
    var req = this.req,
      that = this;

    this.spy(req, "emit");

    req.on("load", function() {
      that.resume(function() {

        // Assert that timeout is canceled
        that.wait(350, function() {
          assert.isNull(req.__timeoutId);
        });

      });
    });

    req.timeout = 300;
    this.request();
    this.wait();
  });


  it("call onabort when request was aborted", function() {
    var req = this.req;

    this.spy(req, "emit");
    this.request();
    req.abort();

    this.assertCalledWith(req.emit, "abort");
  });

  //
  // Clean-Up
  //

  it("remove script from DOM when request completed", function() {
    var script,
      that = this;

    this.req.on("load", function() {
      that.resume(function() {
        script = this.req._getScriptElement();
        assert.isFalse(that.isInDom(script));
      });
    });

    this.request();
    this.wait();
  });


  it("remove script from DOM when request failed", function() {
    var script,
      that = this;

    // In IE < 9, "load" is fired instead of "error"
    this.req.on("error", function() {
      that.resume(function() {
        script = this.req._getScriptElement();
        assert.isFalse(that.isInDom(script));
      });
    });

    this.request("http://fail.tld");
    this.wait(15000);
  });


  it("remove script from DOM when request timed out", function() {

    // Known to fail in legacy IEs
    if (this.isIeBelow(9)) {
      this.skip();
    }

    var script,
      that = this;

    this.req.timeout = 25;
    this.req.on("timeout", function() {
      that.resume(function() {
        script = that.req._getScriptElement();
        assert.isFalse(that.isInDom(script));
      });
    });

    this.requestPending();
    this.wait();
  });


  function request(customUrl) {
    this.req.open("GET", customUrl || this.url, true);
    this.req.send();
  }


  function requestPending(sleep) {
    this.require(["php"]);
    var url = this.noCache(this.getUrl("qx/test/jsonp_primitive.php"));

    // In legacy browser, a long running script request blocks subsequent requests
    // even if the script element is removed. Keep duration very low to work around.
    //
    // Sleep 50ms
    url += "&sleep=" + (sleep || 50);
    this.request(url);
  }


  function isInDom(elem) {
    return elem.parentNode ? true : false;
  }


  function isIe(version) {
    return (qx.core.Environment.get("engine.name") === "mshtml");
  }


  function isIeBelow(version) {
    return qx.core.Environment.get("engine.name") === "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < version;
  }


  function supportsErrorHandler() {
    var isLegacyIe = qx.core.Environment.get("engine.name") === "mshtml" &&
      qx.core.Environment.get("browser.documentmode") < 9;

    return !(isLegacyIe);
  }


  function noCache(url) {
    return url + "?nocache=" + (new Date()).valueOf();
  }


  function skip(msg) {
    throw new qx.dev.unit.RequirementError(null, msg);
  }

});