define(['qx/Class', 'qxWeb'], function(Dep0,Dep1) {
var qx = {
  "Class": Dep0
};
var qxWeb = Dep1;
var q = null;

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

/* eslint no-undef:0 */

/**
 * Compatibility class for {@link qxWeb}.
 */
var clazz = qx.Class.define("q", {
  extend : qxWeb
});
// make sure it's the same
q = qxWeb;

 q = clazz;
return clazz;
});
