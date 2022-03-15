odoo.define('remove_export_option.remove_export_option', function (require) {
"use strict";

var Sidebar = require('web.Sidebar');
var core = require('web.core');
var _t = core._t;
var _lt = core._lt;
    Sidebar.include({
        _addItems: function (sectionCode, items) {
            var self = this;
            if (items) {
                this.getSession().user_has_group('remove_export_option.group_hide_export').done(function(has_group) {
                    if (!has_group) 
                    {
                        var export_label = _t("Export");
                        if (sectionCode == 'other') {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i]['label'] == export_label) {
                                    items.splice(i, 1);
                                    if ($('a[data-section="other"][data-index="0"]').length > 0)
                                        $('a[data-section="other"][data-index="0"]').parent().remove();
                                }
                            }
                        }                        
                    }
                });
                this.items[sectionCode].unshift.apply(this.items[sectionCode], items);
            }
        },
    });
});
