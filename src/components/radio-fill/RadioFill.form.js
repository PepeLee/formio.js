import baseEditForm from '../_classes/component/Component.form';

import RadioEditData from './editForm/RadioFill.edit.data';
import RadioEditDisplay from './editForm/RadioFill.edit.display';
import RadioEditValidation from './editForm/RadioFill.edit.validation';

export default function(...extend) {
  return baseEditForm([
    {
      key: 'display',
      components: RadioEditDisplay
    },
    {
      key: 'data',
      components: RadioEditData
    },
    {
      key: 'validation',
      components: RadioEditValidation
    },
  ], ...extend);
}
