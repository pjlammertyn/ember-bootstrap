require("ember-bootstrap/mixins/focus_support");
require("ember-bootstrap/mixins/text_support");

var get = Ember.get;
var Bootstrap = window.Bootstrap;

Bootstrap.DateTimePicker = Ember.View.extend({
  maskInput: false, // disables the text input mask
  pickDate: true, // disables the date picker
  pickTime: true, // disables de time picker
  pick12HourFormat: false, // enables the 12-hour format time picker
  pickSeconds: true, // disables seconds in the time picker
  startDate: -Infinity, // set a minimum date
  endDate: Infinity, // set a maximum date
  collapse: true,
  language: 'nl',
  format: 'dd-MM-yyyy hh:mm:ss',
  minViewMode: undefined, // 'months' or 'years'
  viewMode: undefined, // 'months' or 'years'
  weekStart: 1,
     
  init: function () {
      this._super();
      this.get('classNames').removeObject('form-control');
  }, 
  
  classNames: "input-group date".w(),
  
  template: Ember.Handlebars.compile([
    '{{view view.inputField}}',
    '<span class="input-group-addon">',
    '  <i {{bindAttr data-time-icon="view.data-time-icon" data-date-icon="view.data-date-icon"}}></i>',
    '</span>'].join("\n")),
  
  'data-time-icon': 'icon-clock',
  'data-date-icon': 'icon-calendar',

  inputField: Ember.TextField.extend(Bootstrap.TextSupport, Bootstrap.FocusSupport, {
    valueBinding: 'parentView.value',
    disabledBinding: 'parentView.disabled',
    classNames: 'form-control'.w()
  }),

  valueChanged: function () {
    var value = this.get('value');
    if (Em.typeOf(value) === 'string') {
        var picker = this.$().data('datetimepicker');
        if (value.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)) {
            value = new ISO8601Date(value);
            picker.setValue(value);
            Em.run.next(this, function () {
                picker.set();
            });
        } else {
            value = picker.parseDate(value);
            if (value) {
                Em.run.cancel(this.get('runLater'));
                this.set('runLater', Em.run.later(this, function () {
                    picker.setValue(value);
                }, 300));
            }
        }
    }   
  }.observes('value'),
  
  didInsertElement: function () {
    this._super();
    var self = this;
    Ember.run.schedule('actions', this, function () {
      var picker = self.$().datetimepicker({
        maskInput: self.get('maskInput'), 
        pickDate: self.get('pickDate'),
        pickTime: self.get('pickTime'), 
        pick12HourFormat: self.get('pick12HourFormat'),
        pickSeconds: self.get('pickSeconds'),
        startDate: self.get('startDate'),
        endDate: self.get('endDate'),
        collapse: self.get('collapse'),
        language: self.get('language'),
        format: self.get('format'),
        minViewMode: self.get('minViewMode'),
        viewMode: self.get('viewMode'),
        weekStart: self.get('weekStart'),
        startDate: self.get('startDate'),
        endDate: self.get('endDate')
      }).on('changeDate', function (ev) {
          self.set('value', ev.date);
          var picker = self.$().data('datetimepicker');
          Em.run.next(self, function () {
              picker.set();
          });
      });
      this.valueChanged();
    });
  },

  willDestroyElement: function() {
    this._super();
    var picker = this.$().data('datetimepicker');
    Ember.run.schedule('actions', this, function() {
      //cleanup 
      picker.destroy();
    });
  }
});
