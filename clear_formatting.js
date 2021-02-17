'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_dd_format = (hookName, args, cb) => {
  args.content += eejs.require('ep_clear_formatting/templates/clear_formatting_menu.ejs');
  cb();
};
