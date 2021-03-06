addSample('.toAtom', {
  html: '<div id="atom-example"></div>',
  javascript: function () {
    q('#atom-example').toAtom("qooxdoo desktop", "http://qooxdoo.org/_media/desktop.png");
  },
  executable: true,
  showMarkup: true
});

addSample('.toAtom', {
  javascript: function () {
    var atom = new qx.ui.Atom("qooxdoo desktop", "http://qooxdoo.org/_media/desktop.png");
    atom.iconPosition = 'bottom';
    q(document.body).append(atom);
  },
  executable: true,
  showMarkup: true
});