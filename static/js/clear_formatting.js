'use strict';

// Attributes Etherpad keeps on the line marker for bookkeeping rather than as
// formatting. Everything else on a line (align, heading, line spacing, list,
// …) is formatting and has to go. Mirrors core's
// AttributeManager.DEFAULT_LINE_ATTRIBUTES.
const DEFAULT_LINE_ATTRIBUTES = ['author', 'lmkr', 'insertorder', 'start'];

// `ace_setAttributeOnSelection()` only touches character attributes, so line
// attributes such as ep_align's `align` survived "Clear Formatting"
// (ether/ether-plugins#40). documentAttributeManager is only handed out by
// aceInitialized, so expose a helper on editorInfo for postAceInit to call
// from inside callWithAce.
exports.aceInitialized = (hook, context) => {
  const clearLineFormatting = function () {
    const rep = this.rep;
    const documentAttributeManager = this.documentAttributeManager;
    if (!rep || !rep.selStart || !rep.selEnd) return;

    const firstLine = rep.selStart[0];
    // A selection that ends at column 0 does not really include that line.
    const lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0));

    for (let line = firstLine; line <= lastLine; line++) {
      const keys = documentAttributeManager.getAttributesOnLine(line).map((attr) => attr[0]);
      for (const key of keys) {
        if (DEFAULT_LINE_ATTRIBUTES.indexOf(key) !== -1) continue;
        documentAttributeManager.removeAttributeOnLine(line, key);
      }
    }
  };

  context.editorInfo.ace_clearLineFormatting = clearLineFormatting.bind(context);
};

exports.postAceInit = (hook, context) => {
  // Delegated: the Format menu this entry lives in is rendered by
  // ep_file_menu_toolbar and may not exist yet when postAceInit runs.
  $('body').on('click', '#clearFormatting', () => {
    context.ace.callWithAce((ace) => {
      const rep = ace.ace_getRep(); // get the current user selection
      const isSelection = (rep.selStart[0] !== rep.selEnd[0] || rep.selStart[1] !== rep.selEnd[1]);
      if (!isSelection) return false; // No point proceeding if no selection..

      const attrs = rep.apool.attribToNum; // get the attributes on this document
      $.each(attrs, (k, v) => { // for each attribute
        const attr = k.split(',')[0]; // get the name of the attribute
        if (attr !== 'author') { // if its not an author attribute
          // An empty value removes the attribute. Passing `false` used to
          // *apply* it instead: the value is stringified into the attribute
          // pool, and "false" is a non-empty — therefore set — value, so
          // "Clear Formatting" turned plain text bold/italic/underlined.
          ace.ace_setAttributeOnSelection(attr, '');
        }
      });

      // Character attributes are gone; now drop the line attributes.
      ace.ace_clearLineFormatting();
    }, 'clearFormatting', true);
  });
};
