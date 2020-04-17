import _ from 'lodash';
import Field from '../_classes/field/Field';

export default class RadioFillComponent extends Field {
  static schema(...extend) {
    return Field.schema({
      type: 'radiofill',
      inputType: 'radio',
      label: 'Radio Fill',
      key: 'radiofill',
      multiple: true,
      values: [{ label: '', value: '' }],
      fieldSet: false
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Radio Fill',
      group: 'basic',
      icon: 'dot-circle-o',
      weight: 80,
      schema: RadioFillComponent.schema()
    };
  }

  constructor(component, options, data) {
    super(component, options, data);
    this.previousValue = this.dataValue || null;
  }

  get defaultSchema() {
    return RadioFillComponent.schema();
  }

  get inputInfo() {
    const info = super.elementInfo();
    info.type = 'input';
    info.changeEvent = 'click';
    info.attr.class = 'form-check-input';
    info.attr.name = info.attr.name += `[${this.id}]`;
    return info;
  }

  get emptyValue() {
    return [];
  }

  get isRadio() {
    return this.component.inputType === 'radio';
  }

  render() {
    return super.render(this.renderTemplate('radioFill', {
      input: this.inputInfo,
      inline: this.component.inline,
      values: this.component.values,
      value: this.dataValue,
      row: this.row,
    }));
  }

  attach(element) {
    this.loadRefs(element, { input: 'multiple', wrapper: 'multiple', inputFill: 'multiple' });
    this.refs.inputFill.forEach((inputFill) => {
      this.addEventListener(inputFill, 'click', (event) => {
        const fillId = event.target.id;
        const checkId = fillId.substr(0, fillId.length - 5);
        const check = document.getElementById(checkId);
        check.checked = true;
        this.updateValue(null, { modified: true });
      });
      this.addEventListener(inputFill, 'change', () => {
        this.updateValue(null, { modified: true });
      });
    });
    this.refs.input.forEach((input) => {
      this.addEventListener(input, this.inputInfo.changeEvent, () => this.updateValue(null, {
        modified: true,
      }));
      // this.addShortcut(input, this.component.values[index].shortcut);

      if (this.isRadio) {
        input.checked = (this.dataValue === input.value);
        this.addEventListener(input, 'keyup', (event) => {
          if (event.key === ' ' && this.dataValue === input.value) {
            event.preventDefault();

            this.updateValue(null, {
              modified: true,
            });
          }
        });
      }
    });
    return super.attach(element);
  }

  getValue() {
    if (this.viewOnly || !this.refs.input || !this.refs.input.length) {
      return this.dataValue;
    }
    const value = [];
    this.refs.input.forEach((input) => {
      const fillId = `${input.id}-fill`;
      const fill = document.getElementById(fillId);
      let fillValue = '';
      if (fill) {
        fillValue = fill.value || '';
      }
      value.push({
        value: input.value,
        checked: true,
        fillValue: fillValue
      });
    });
    return value;
  }

  getValueAsString(value) {
    if (!value) {
      return '';
    }
    if (!_.isString(value)) {
      return _.toString(value);
    }

    const option = _.find(this.component.values, (v) => v.value === value);

    return _.get(option, 'label', '');
  }

  setValue(value, flags = {}) {
    const changed = this.updateValue(value, flags);
    if (this.componentModal && flags && flags.fromSubmission) {
      this.componentModal.setValue(value);
    }
    value = this.dataValue;
    if (!this.hasInput) {
      return changed;
    }
    const isArray = Array.isArray(value);
    // if (
    //   isArray &&
    //   Array.isArray(this.defaultValue) &&
    //   this.refs.hasOwnProperty('input') &&
    //   this.refs.input &&
    //   (this.refs.input.length !== value.length)
    // ) {
    //   this.redraw();
    // }
    // debugger;
    // this.refs.input.forEach((input) => {

    // });
    // for (const i in this.refs.input) {
    //   if (this.refs.input.hasOwnProperty(i)) {
    //     this.setValueAt(i, isArray ? value[i] : value, flags);
    //   }
    // }
    return changed;
  }

  updateValue(value, flags) {
    if (Array.isArray(value) && value.length === 0) {
      value = null;
    }
    const changed = super.updateValue(value, flags);
    if (changed && this.refs.wrapper) {
      //add/remove selected option class
      const value = this.dataValue;
      const optionSelectedClass = 'radio-selected';

      this.refs.wrapper.forEach((wrapper, index) => {
        const input = this.refs.input[index];
        if (input && input.value.toString() === value.toString()) {
          //add class to container when selected
          this.addClass(wrapper, optionSelectedClass);
        }
        else {
          this.removeClass(wrapper, optionSelectedClass);
        }
      });
    }

    if (!flags || !flags.modified || !this.isRadio) {
      return changed;
    }

    // If they clicked on the radio that is currently selected, it needs to reset the value.
    this.currentValue = this.dataValue;
    const shouldResetValue = !(flags && flags.noUpdateEvent)
      && this.previousValue === this.currentValue;
    if (shouldResetValue) {
      // this.resetValue();
      this.triggerChange();
    }
    this.previousValue = this.dataValue;
    return changed;
  }
}
