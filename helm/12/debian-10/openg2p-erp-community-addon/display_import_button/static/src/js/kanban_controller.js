odoo.define('display_import_button.KanbanController', function(require){
  "use strict";

  var KanbanController = require('web.KanbanController');
  var core = require('web.core');
  var qweb = core.qweb;

  var ImportKanbanController = KanbanController.include({
    renderButtons: function ($node) {
      if (this.hasButtons && (this.is_action_enabled('import') || this.is_action_enabled('create'))) {
        this.$buttons = $(qweb.render('KanbanView.buttons', {
            btnClass: 'btn-primary',
            widget: this,
        }));
        this.$buttons.on('click', 'button.o-kanban-button-new', this._onButtonNew.bind(this));
        this.$buttons.on('keydown',this._onButtonsKeyDown.bind(this));
        this._updateButtons();
        this.$buttons.appendTo($node);
      }
    },
  });
});
