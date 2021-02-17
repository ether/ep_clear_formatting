'use strict';

exports.postAceInit = (hook, context) => {
  $('#clearFormatting').click(() => {
    context.ace.callWithAce((ace) => {
      const rep = ace.ace_getRep(); // get the current user selection
      const isSelection = (rep.selStart[0] !== rep.selEnd[0] || rep.selStart[1] !== rep.selEnd[1]);
      if (!isSelection) return false; // No point proceeding if no selection..

      const attrs = rep.apool.attribToNum; // get the attributes on this document
      $.each(attrs, (k, v) => { // for each attribute
        const attr = k.split(',')[0]; // get the name of the attribute
        if (attr !== 'author') { // if its not an author attribute
          ace.ace_setAttributeOnSelection(attr, false); // set the attribute to false
        }
      });
    }, 'clearFormatting', true);
  });
};
