const rowData = [
  {
    expenses: 'Rent',
    january: 1000,
    february: 1000
  },
  {
    expenses: 'Food',
    january: 150,
    february: 125
  },
  {
    expenses: 'Car',
    january: 100,
    february: 200
  },
  {
    expenses: 'Electricity',
    january: 100,
    february: 200
  },
];

const columnDefs = [
  { field: 'expenses', editable: false, cellRenderer: '' },
  { field: 'january', headerName: 'January' },
  { field: 'february', headerName: 'February' },
  { field: 'march', headerName: 'March' },
  { field: 'april', headerName: 'April' },
  { field: 'may', headerName: 'May' },
  { field: 'june', headerName: 'June' },
  { field: 'july', headerName: 'July' },
  { field: 'august', headerName: 'August' },
  { field: 'september', headerName: 'September' },
  { field: 'october', headerName: 'October' },
  { field: 'november', headerName: 'November' },
  { field: 'december', headerName: 'December' }
];

let months = columnDefs.filter(colDef => colDef.field !== 'expenses').map(colDef => colDef.headerName);

class ExpensePopupCellEditor {

  init(params) {
    this.container = document.createElement('div');
    this.container.setAttribute('class', 'input-widget-popup');
    this._createTable(params);
    this._registerApplyListener();
    this.params = params;
  }

  getGui() {
    return this.container;
  }

  destroy() {
    this.applyButton.removeEventListener('click', this._applyValues);
  }

  afterGuiAttached() {
    this.container.focus();
  }

  getValue() {
    return this.inputValue.value;
  }

  isPopup() {
    return true;
  }

  _createTable(params) {
    this.container.innerHTML = `
      <table>
        <tr>
            <th></th>
            <th>From</th>
            <th>To</th>
        </tr>
        <tr>
            <td></td>
            <td>${params.colDef.headerName}</td>
            <td><select id="monthSelection"></select></td>
        </tr>
        <tr></tr>
        <tr>
            <td>${params.data.expenses}</td>
            <td></td>
            <td><input id="inputValue" type="number"/></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td><button id="applyBtn">Apply</button></td>
        </tr>
      </table>
    `;
    this.monthDropdown = this.container.querySelector('#monthSelection');
    for (let i = 0; i < months.length; i++) {
      const option = document.createElement('option');
      option.setAttribute('value', i.toString());
      option.innerText = months[i];
      if (params.colDef.headerName === months[i]) {
        option.setAttribute('selected', 'selected');
      }
      this.monthDropdown.appendChild(option);
    }
    this.inputValue = this.container.querySelector('#inputValue');
    this.inputValue.value = params.value;
  }

  _registerApplyListener() {
    this.applyButton = this.container.querySelector('#applyBtn');
    this.applyButton.addEventListener('click', this._applyValues);
  }

  _applyValues = () => {
    const newData = { ...this.params.data };
    const startingMonthIndex = months.indexOf(this.params.colDef.headerName);
    const endMonthIndex = parseInt(this.monthDropdown.value);
    const subset = startingMonthIndex > endMonthIndex
      ? months.slice(endMonthIndex, startingMonthIndex)
      : months.slice(startingMonthIndex, endMonthIndex + 1);

    subset
      .map(month => month.toLowerCase())
      .forEach(month => {
        newData[month] = this.inputValue.value;
      });
    this.params.node.setData(newData);
    this.params.stopEditing();
  }
}

class ExpensesCellRenderer {
  init(params) {
    this.gui = document.createElement('span');
    if (this._isNotNil(params.value)
        && (this._isNumber(params.value) || this._isNotEmptyString(params.value))) {
      this.gui.innerText = `$ ${params.value.toLocaleString()}`;
    } else {
      this.gui.innerText = '';
    }
  }

  _isNotNil(value) {
    return value !== undefined && value !== null;
  }

  _isNotEmptyString(value) {
    return typeof value === 'string' && value !== '';
  }

  _isNumber(value) {
    return !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value);
  }

  getGui() {
    return this.gui;
  }
}


const gridOptions = {
  columnDefs,
  rowData,
  defaultColDef: {
    editable: true,
    sortable: true,
    cellRenderer: ExpensesCellRenderer,
    cellEditor: ExpensePopupCellEditor
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
