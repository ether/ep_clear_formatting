exports.postAceInit = function(hook, context){
  $('#clearFormatting').click(function(){
    context.ace.callWithAce(function(ace){
      var rep = ace.ace_getRep();
      var isSelection = (rep.selStart[0] !== rep.selEnd[0] || rep.selStart[1] !== rep.selEnd[1]);
      if(!isSelection) return false; // No point proceeding if no selection..

      // note this is just bodged together, we need to query the documentattributemanager probably to find out 
      // which attributes exist...
      ace.ace_setAttributeOnSelection("bold", false);
      ace.ace_setAttributeOnSelection("italic", false);
      ace.ace_setAttributeOnSelection("underline", false);
      ace.ace_setAttributeOnSelection("strikethrough", false);
      ace.ace_setAttributeOnSelection("fontcolor", false);
      ace.ace_setAttributeOnSelection("color", false);
      ace.ace_setAttributeOnSelection("subscript", false);
      ace.ace_setAttributeOnSelection("superscript", false);
    },'clearFormatting' , true);
  });
}
