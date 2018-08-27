export class Menu {
  constructor(element) {
    this.dom = {
      menu: element,
      items: element.querySelectorAll('.item'),
      emptyMessage: element.querySelector('.empty'),
      highlightItem: element.querySelector('.highlight'),
    };
    this.max = element.getAttribute('data-display-max') || 5;
  }

  init() {
    this.limitDisplayMaxItems();
  }

  toggle() {
    this.dom.menu.classList.contains('visible') ? this.hide() : this.show();
  }

  show() {
    this.dom.menu.classList.add('visible');
  }

  hide() {
    this.dom.menu.classList.remove('visible');
  }

  limitDisplayMaxItems() {
    Array.from(this.dom.items).forEach(item => item.classList.add('hidden'));
    Array.from(this.dom.items).forEach((item, i) => {
      if (i < this.max) item.classList.remove('hidden');
    });
  }

  showList(list) {
    // hide all items from the menulist
    Array.from(this.dom.items).forEach(item => item.classList.add('hidden'));
    // remove the hidden class from those that appear in the filteredList
    Array.from(list).forEach((item, i) => {
      if (i < this.max) item.classList.remove('hidden');
    });
    list.length === 0 ? this.showEmptyState() : this.hideEmptyState();
  }

  showEmptyState() {
    this.dom.emptyMessage.classList.add('visible');
  }

  hideEmptyState() {
    this.dom.emptyMessage.classList.remove('visible');
  }

  static highlightItem(item) {
    item.classList.add('highlight');
  }

  static unHighlightItem(item) {
    item.classList.remove('highlight');
  }

  unHighlightAll() {
    Array.from(this.dom.items).forEach(item => Menu.unHighlightItem(item));
  }

  getHighlightedItem() {
    return this.dom.menu.querySelector('.highlight');
  }
}
