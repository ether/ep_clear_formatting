var eejs = require('ep_etherpad-lite/node/eejs/');
var settings = require('ep_etherpad-lite/node/utils/Settings');
var checked_state = '';

exports.eejsBlock_dd_format = function (hook_name, args, cb) {
  args.content = args.content + eejs.require('ep_clear_formatting/templates/clear_formatting_menu.ejs');
  return cb();
}

