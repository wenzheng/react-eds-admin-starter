export class Tree {
  constructor(element) {
    this.dom = {
      accordion: element,
      titles: element.querySelectorAll('.title'),
    };
  }

  init() {
    this.eventHandler();
  }

  eventHandler() {
    Array.from(this.dom.titles).forEach( title => {
      title.addEventListener('click', () => this.toggleAccordion(title), false);
    });
  }

  toggleAccordion(title) {
    if(title.classList.contains('opened')){
      this.closeAccordion(title);
    }else {
      this.openAccordion(title);
    }
  }

  openAccordion(ul) {
    ul.classList.add('opened');
    ul.classList.remove('closed');
  }

  closeAccordion(ul) {
    ul.classList.add('closed');
    ul.classList.remove('opened');
  }

}
