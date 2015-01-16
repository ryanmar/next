/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

************************************************************************ */

describe("mobile.FlexCarousel", function() {

  var carousel;

  beforeEach(function() {
    carousel = new qx.ui.FlexCarousel()
      .setStyles({
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "400px",
        height: "400px"
      })
      .set({
        pageSwitchDuration: 100
      })
      .appendTo(sandbox);
  });


  afterEach(function() {
    carousel.dispose();
  });


  it("intitial active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    assert.equal(carousel.active[0], p1[0]);
    assert.equal(p1.getStyle("order"), "0");
  });


  it("order first active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    assert.equal(p1.getStyle("order"), "0");
    assert.equal(p2.getStyle("order"), "1");
    assert.equal(p3.getStyle("order"), "-1");
  });


  it("order last active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    carousel.active = p3;

    assert.equal(p3.getStyle("order"), "0");
    assert.equal(p1.getStyle("order"), "1");
    assert.equal(p2.getStyle("order"), "-1");
  });


  it("order middle active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);

    carousel.active = p2;

    assert.equal(p2.getStyle("order"), "0");
    assert.equal(p3.getStyle("order"), "1");
    assert.equal(p1.getStyle("order"), "-1");
  });

  it("remove active", function() {
    var p1 = new qx.ui.Widget();
    p1.appendTo(carousel);
    var p2 = new qx.ui.Widget();
    p2.appendTo(carousel);
    var p3 = new qx.ui.Widget();
    p3.appendTo(carousel);
    var p4 = new qx.ui.Widget();
    p4.appendTo(carousel);

    p1.remove();

    assert.equal(carousel.active[0], p2[0]);
    assert.equal(p2.getStyle("order"), "0");
    assert.equal(p3.getStyle("order"), "1");
    assert.equal(p4.getStyle("order"), "-1");
  });


  it("nextPage", function(done) {
    var p1 = new qx.ui.Widget()
      .setHtml("page1")
      .appendTo(carousel);
    var p2 = new qx.ui.Widget()
      .setHtml("page2")
      .appendTo(carousel);
    var p3 = new qx.ui.Widget()
      .setHtml("page3")
      .appendTo(carousel);

    var cb3 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p1[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p1[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 0);
      assert.equal(activeButton[0].textContent, "1");
    });

    var cb2 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p3[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p3[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 2);
      assert.equal(activeButton[0].textContent, "3");

      carousel.once("changeActive", cb3);
      carousel.nextPage();
    });

    var cb1 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p2[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p2[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 1);
      assert.equal(activeButton[0].textContent, "2");

      carousel.once("changeActive", cb2);
      carousel.nextPage();
    });

    carousel.once("changeActive", cb1);
    carousel.nextPage();

    window.setTimeout(function() {
      sinon.assert.calledOnce(cb1);
      sinon.assert.calledOnce(cb2);
      sinon.assert.calledOnce(cb3);
      done();
    }, 600);

  });


  it("previousPage", function(done) {
    var p1 = new qx.ui.Widget()
      .setHtml("page1")
      .appendTo(carousel);
    var p2 = new qx.ui.Widget()
      .setHtml("page2")
      .appendTo(carousel);
    var p3 = new qx.ui.Widget()
      .setHtml("page3")
      .appendTo(carousel);

    var cb3 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p1[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p1[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 0);
      assert.equal(activeButton[0].textContent, "1");
    });

    var cb2 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p2[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p2[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 1);
      assert.equal(activeButton[0].textContent, "2");

      carousel.once("changeActive", cb3);
      carousel.previousPage();
    });

    var cb1 = sinon.sandbox.spy(function(e) {
      assert.equal(carousel.active[0], p3[0]);
      assert.equal(carousel.active[0], e.value[0]);
      assert.equal(p3[0], e.value[0]);
      var activeButton = carousel.find(".active");
      assert.equal(carousel.find(".flexcarousel-pagination-label").indexOf(activeButton), 2);
      assert.equal(activeButton[0].textContent, "3");

      carousel.once("changeActive", cb2);
      carousel.previousPage();
    });

    carousel.once("changeActive", cb1);
    carousel.previousPage();

    window.setTimeout(function() {
      sinon.assert.calledOnce(cb1);
      sinon.assert.calledOnce(cb2);
      sinon.assert.calledOnce(cb3);
      done();
    }, 600);
  });


  it("pagination update on page remove", function() {
    var p1 = new qx.ui.Widget()
      .setHtml("page1")
      .appendTo(carousel);
    var p2 = new qx.ui.Widget()
      .setHtml("page2")
      .appendTo(carousel);
    var p3 = new qx.ui.Widget()
      .setHtml("page3")
      .appendTo(carousel);

    var labels = carousel.find(".flexcarousel-pagination-label");
    assert.equal(3, labels.length);
    assert.isTrue(labels.eq(0).is(".active"));
    assert.equal(labels.eq(0)[0].textContent, "1");

    p1.remove();
    labels = carousel.find(".flexcarousel-pagination-label");
    assert.equal(2, labels.length);
    assert.isTrue(labels.eq(0).is(".active"));
    assert.equal(labels.eq(0)[0].textContent, "1");
  });
});