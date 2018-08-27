/* global eventListener, findParentByClass, addClass, removeClass, classOnParent */
(() => {
  const selectTableRow = (element, index) => {
    const state = element.checked;
    if (index === 'all') {
      const table = findParentByClass(element, 'table');
      const elements = Array.from(table.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
      elements.forEach((elem) => {
        const cbLabel = Array.from(elem.getElementsByClassName('checkbox'));
        const checkbox = document.getElementById(cbLabel[0].htmlFor);
        if (checkbox.disabled) return;
        if (state) {
          addClass(elem, 'selected');
        } else {
          removeClass(elem, 'selected');
        }
        checkbox.checked = state;
      });
    } else if (index === 'row') {
      if (element.disabled) return;
      classOnParent(element, 'tr', 'selected');
    }
  };

  const selectAll = document.getElementById('table-0');
  eventListener(selectAll, 'click', ({ target }) => {
    selectTableRow(target, 'all');
  });

  const rowSelect = document.getElementsByClassName('checkbox select-row');
  eventListener(rowSelect, 'click', ({ target }) => {
    selectTableRow(target, 'row');
  });
})();
