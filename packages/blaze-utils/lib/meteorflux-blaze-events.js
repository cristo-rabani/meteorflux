MeteorFlux.BlazeEvents = class BlazeEvents {
  constructor() {
    let self = this;
    if ((typeof Blaze !== 'undefined') && (typeof Blaze !== 'undefined'))
      self._createGlobalEvents();
  }

  _createGlobalEvents() {
    let self = this;
    for (var t in Template) {
      if (Template.hasOwnProperty(t)) {
        var tmpl = Template[t];
        if (Blaze.isTemplate(tmpl)) {
          tmpl.events({
            'click a[dispatch]': self._dispatch,
            'click button[dispatch]': self._dispatch,
            'submit form[dispatch]': self._dispatch
          });
        }
      }
    }
  }

  _dispatch(event, tmpl) {
    let self = this;
    event.preventDefault();
    event.stopImmediatePropagation();
    let action = {
      type: event.currentTarget.getAttribute('dispatch'),
      context: this,
      template: tmpl,
      event: event
    };

    // add any data-something to the Action payload.
    let dataSet = action.event.currentTarget.dataset;

    // add any form value to the Action payload.
    let formFields = event.currentTarget;
    formFields = _.filter(formFields, k => k.type !== 'submit');
    formFields = _.object(
      _.map(formFields, k => k.name),
      _.map(formFields, k => {
        if (k.type === 'checkbox')
          return k.checked;
        else if (k.type === 'radio')
          return $('input[name=' + k.name + ']:checked').val();
        else
          return k.value;
      }));

    _.extend(action, dataSet, formFields);
    return Dispatch(action);
  }
};

Meteor.startup(function () {
  if (MeteorFlux && MeteorFlux.MF)
    new MeteorFlux.BlazeEvents();
});
