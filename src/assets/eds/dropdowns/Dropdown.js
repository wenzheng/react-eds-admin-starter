import { Menu } from './Menu';

export class Dropdown {
  constructor(element) {
    this.dom = {
      dropdown: element,
      button: element.querySelector('.btn, .clickable'),
      checkboxes: element.querySelectorAll('input[type="checkbox"]'),
      menu: element.querySelector('.menu'),
      items: element.querySelectorAll('.item'),
      input: element.querySelector('input[type="text"]'),
    };
    this.type = element.getAttribute('data-type') || undefined;
    this.initialLabel = this.dom.button.innerHTML;
    this.isDisabled = this.dom.dropdown.getAttribute('disabled') !== null;
    this.menu = {};
    this.highlightIndex = -1;
  }

  init() {
    if (this.dom.menu) {
      this.menu = new Menu(this.dom.menu);
      this.menu.init();
    }

    if (this.isDisabled) this.setDisabled();

    this.eventHandler();
  }

  eventHandler() {
    switch (this.type) {
      case 'click':
        this.dom.button.addEventListener('click', () => this.menu.toggle(), false);
        this.ifClickedOutside(() => this.menu.hide());
        break;
      case 'single':
        this.dom.dropdown.addEventListener('change', e => this.selectSingleOption(e), false);
        this.dom.button.addEventListener('click', () => this.menu.toggle(), false);
        this.ifClickedOutside(() => this.menu.hide());
        break;
      case 'multi':
        this.dom.dropdown.addEventListener('change', () => this.selectMultipleOptions(), false);
        this.dom.button.addEventListener('click', () => this.menu.toggle(), false);
        this.ifClickedOutside(() => this.menu.hide());
        break;
      case 'combo':
        this.dom.button.addEventListener('click', () => this.menu.toggle(), false);
        this.dom.menu.addEventListener('click', e => this.setInputValue(e.target), false);
        this.dom.input.addEventListener('click', () => this.menu.show(), false);
        this.dom.input.addEventListener('keyup', (e) => {
          this.menu.show();
          this.filterOptions();
          this.arrowKeySelection(e);
        }, false);
        this.dom.input.addEventListener('mousemove', () => this.menu.unHighlightAll(), false);
        this.ifClickedOutside(() => this.menu.hide());
        break;
      default:
    }
  }

  setDisabled() {
    if (this.dom.button) this.dom.button.setAttribute('disabled', 'disabled');
    if (this.dom.input) this.dom.input.setAttribute('disabled', 'disabled');
  }

  arrowKeySelection(e) {
    // set the correct highlightIndex depending on the key presed
    switch (`${e.keyCode}`) {
      case '40': // arrowDown
        this.highlightIndex++;
        break;
      case '38': // arrowUp
        --this.highlightIndex;
        break;
      case '13': // enter
        this.setInputValue(this.menu.getHighlightedItem());
        this.menu.hide();
        break;
    }
    if (this.highlightIndex < 0) this.highlightIndex = 0;

    this.menu.unHighlightAll();
    const itemList = this.filterOptions();
    const maxNumItems = Math.min(itemList.length, this.menu.max);
    if (maxNumItems > 0) {
      this.highlightIndex = this.highlightIndex % (maxNumItems);
      Menu.highlightItem(itemList[this.highlightIndex]);
    }
  }

  filterOptions() {
    const items = Array.from(this.dom.menu.querySelectorAll('.item'));
    const typedValue = this.dom.input.value.toLowerCase();
    const filteredResults =
      items.filter(val => val.innerText.toLowerCase().indexOf(typedValue) > -1);
    this.menu.showList(filteredResults);
    return filteredResults;
  }

  setInputValue(target) {
    // skip the div with empty class when adding to input
    if (!target.classList.contains('empty')) this.dom.input.value = target.innerText;
  }

  /**
   * Asign value to input hidden, change innerHTML with selected option
   */
  selectSingleOption(event) {
    const id = event.target.id;
    const label = this.dom.dropdown.querySelector(`label[for="${id}"]`);
    this.dom.button.innerText = label.innerText;
  }

  /**
   * Set correct dropdown label: data-select-label + (numChecked)
   */
  selectMultipleOptions() {
    const nChecked = this.dom.dropdown.querySelectorAll('input[type="checkbox"]:checked').length;
    const innerlabel = this.dom.button.getAttribute('data-innerlabel');
    if (nChecked > 0) {
      this.dom.button.innerHTML = `${innerlabel} (${nChecked})`;
    } else {
      this.dom.button.innerHTML = this.initialLabel;
    }
  }

  /**
   * Executes callback function when clicked outside the target event
   */
  ifClickedOutside(callback) {
    document.addEventListener('click', (event) => {
      if (!this.dom.dropdown.contains(event.target)) {
        callback.bind(this)();
      }
    });
  }
}
