const eejs = require('ep_etherpad-lite/node/eejs/');
const settings = require('ep_etherpad-lite/node/utils/Settings');
const checked_state = '';

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content += eejs.require('ep_clear_formatting/templates/clear_formatting_menu.ejs');
  return cb();
};
