export class Accordion {
  constructor(element) {
    this.dom = {
      accordion: element,
      lis: element.querySelectorAll('li'),
    };
  }

  init() {
    this.eventHandler();
  }

  eventHandler(type) {
    if (type === 'remove') {

      Array.from(this.dom.lis).forEach(li => {
        li.querySelector('.title')
          .removeEventListener('click', () => this.toggleAccordion(li), false);
      });
      return;
    }
    Array.from(this.dom.lis).forEach(li => {
      li.querySelector('.title')
        .addEventListener('click', () => this.toggleAccordion(li), false);
    });
  }

  toggleAccordion(li) {
    if (li.classList.contains('opened')) {
      this.closeAccordion(li);
    } else {
      this.openAccordion(li);
    }
  }

  openAccordion(li) {
    li.classList.add('opened');
    li.classList.remove('closed');
  }

  closeAccordion(li) {
    li.classList.add('closed');
    li.classList.remove('opened');
  }

  destroy() {
    this.eventHandler('remove');
    // and other tasks to be run once at destruction
  }
}
