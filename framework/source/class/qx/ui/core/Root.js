define(['qx/Class', 'qx/ui/Widget', 'qx/ui/layout/VBox'], function(Dep0,Dep1,Dep2) {
var qx = {
  "Class": Dep0,
  "ui": {
    "Widget": Dep1,
    "layout": {
      "VBox": Dep2
    },
    "core": {
      "Root": null
    }
  }
};

"use strict";
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
     * Tino Butz (tbtz)

************************************************************************ */


/**
 * Root widget for the mobile application.
 */
var clazz = qx.Class.define("qx.ui.core.Root",
{
  extend : qx.ui.Widget,


  /**
   * @param root {Element?null} Optional. The root DOM element of the widget. Default is the body of the document.
   * @param layout {qx.ui.layout.Abstract ? qx.ui.layout.VBox} The layout of the root widget.
   */
  construct : function(root, layout)
  {
    this.__root = root || document.body;
    this.super("construct", this.__root);
    this.layout = layout || new qx.ui.layout.VBox();
  },


  properties :
  {
    // overridden
    defaultCssClass :
    {
      init : "root"
    },


    /**
     * Whether the native scrollbar should be shown or not.
     */
    showScrollbarY :
    {
      check : "Boolean",
      init : true,
      apply : "_applyShowScrollbarY"
    }
  },


  members :
  {
    __root : null,

    // overridden
    _createContainerElement : function() {
      return this.__root;
    },


    // property apply
    _applyShowScrollbarY : function(value) {
      this.setStyle("overflow-y", value ? "auto" : "hidden");
    },


    _preventDefault : function(evt) {
      evt.preventDefault();
    },


    dispose : function() {
      this.super("dispose");
      this.off("touchmove", this._preventDefault);
    }
  }
});

 qx.ui.core.Root = clazz;
return clazz;
});
