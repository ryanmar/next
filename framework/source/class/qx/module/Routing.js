"use strict";
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/**
 * Routing module forwarding a singleton of the application routing.
 */
qx.Class.define("qx.module.Routing", {
  classDefined : function() {
    qxWeb.$attachStatic({
      getRouting : function() {
        if (!this.$$routingInstance || this.$$routingInstance.$$disposed) {
          this.$$routingInstance = new qx.application.Routing();
        }
        return this.$$routingInstance;
      }
    });
  }
});
