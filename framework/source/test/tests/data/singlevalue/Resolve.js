/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * testResolve-Class for testResolveing the single value binding
 */
describe("data.singlevalue.Resolve", function() {


  it("ResolveDepth1", function() {
    var model = qx.data.marshal.Json.createModel({a: 12});
    assert.equal(12, qx.data.SingleValueBinding.resolvePropertyChain(model, "a"));
  });


  it("ResolveDepth2", function() {
    var model = qx.data.marshal.Json.createModel({a: {b:12}});
    assert.equal(12, qx.data.SingleValueBinding.resolvePropertyChain(model, "a.b"));
  });


  it("ResolveDepthHuge", function() {
    var model = qx.data.marshal.Json.createModel({a: {b: {c: {d: {e: {f: 12}}}}}});
    assert.equal(12, qx.data.SingleValueBinding.resolvePropertyChain(model, "a.b.c.d.e.f"));
  });


  it("ResolveWithArray", function() {
    var model = qx.data.marshal.Json.createModel({a: {b: [{c: 12}]}});
    assert.equal(12, qx.data.SingleValueBinding.resolvePropertyChain(model, "a.b[0].c"));
  });


  it("ResolveNotExistant", function() {
    var model = qx.data.marshal.Json.createModel({a: 12});
    assert.throw(function() {
      assert.equal(12, qx.data.SingleValueBinding.resolvePropertyChain(model, "b"));
    });
  });


  it("ResolveArrayIndex", function() {
    var arr = new qx.data.Array([23]);
    assert.equal(23, qx.data.SingleValueBinding.resolvePropertyChain(arr,"[0]"));
  });


  it("ResolveNestedArray", function() {
    var model = qx.data.marshal.Json.createModel({a: [[23]]});
    assert.equal(23, qx.data.SingleValueBinding.resolvePropertyChain(model, "a[0][0]"));
  });
});