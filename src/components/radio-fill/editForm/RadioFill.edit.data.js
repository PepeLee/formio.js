export default [
  {
    key: 'multiple',
    ignore: true,
  },
  {
    type: 'datagrid',
    input: true,
    label: 'Values',
    key: 'values',
    tooltip: 'The radio button values that can be picked for this field. Values are text submitted with the form data. Labels are text that appears next to the radio buttons on the form.',
    weight: 10,
    reorder: true,
    defaultValue: [{ label: '', value: '' ,isfill : true }],
    components: [
      {
        label: 'Label',
        key: 'label',
        input: true,
        type: 'textfield',
      },
      {
        label: 'Value',
        key: 'value',
        input: true,
        type: 'textfield',
        allowCalculateOverride: true,
        calculateValue: { _camelCase: [{ var: 'row.label' }] },
        validate: {
          required: true
        }
      },
      {
        label: '是否填空',
        optionsLabelPosition: 'right',
        tableView: false,
        values: [
            {
                label: '',
                value: 'yes',
                shortcut: ''
            }
        ],
        calculateServer: false,
        key: 'isFill',
        type: 'selectboxes',
        input: true,
        inputType: 'checkbox',
        defaultValue: {
            '': false
        }
     }
    ],
  },
  {
    type: 'select',
    input: true,
    label: 'Storage Type',
    key: 'dataType',
    clearOnHide: true,
    tooltip: 'The type to store the data. If you select something other than autotype, it will force it to that type.',
    weight: 12,
    template: '<span>{{ item.label }}</span>',
    dataSrc: 'values',
    data: {
      values: [
        { label: 'Autotype', value: 'auto' },
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Object', value: 'object' },
      ],
    },
  },
];
