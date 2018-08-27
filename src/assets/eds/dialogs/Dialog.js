export class Dialog {

  constructor(element) {
    this.dom = {
      dialog: element,
      content: element.querySelector('.content'),
      id: element.id,
      closeButton: undefined
    }
    this.type = element.dataset.type;
    this.trigger = element.dataset.trigger;
    this.events = {
      closeDialogEvent: new CustomEvent('DialogClose', {
        detail: { id: this.id }
      }),
      showDialogEvent: new CustomEvent('DialogShow', {
        detail: { id: this.id }
      })
    }
  }

  init() {
    this.getCloseButton();
    this.eventHandler();
  }

  eventHandler() {
    // Open Dialog if
      //  - trigger defined
    if(this.trigger){
      let button = document.querySelector(this.trigger);
      button.addEventListener('click', () => this.show(), false);
    }else{
      //  - custom event defined
      this.dom.dialog.addEventListener('triggerDialog', e => {
        if(e.detail.id == this.dom.id) this.show();
      }, false);
    }

    // Close Dialog
    // this.dom.dialog.addEventListener('click', (e) => this.clickedOutside(e), false);
    switch (this.type) {
      case 'simple':
        this.dom.closeButton.addEventListener('click', () => this.hide(), false); // internal button
        break;
      case 'fullscreen':
        this.dom.closeButton.addEventListener('click', () => this.hide(), false); // internal cross
        break;
    }
  }

  show(e) {
    this.dom.dialog.classList.add('show');
    this.dom.dialog.dispatchEvent(this.events.showDialogEvent);
  }

  hide() {
    this.dom.dialog.classList.remove('show');
    this.dom.dialog.dispatchEvent(this.events.closeDialogEvent);
  }

  clickedOutside(e) {
    if(event.target.classList.contains('dialog')) this.hide();
  }

  getCloseButton(){
    let buttons = this.dom.dialog.querySelectorAll('.btn');
    Array.from(buttons).forEach( button => {
      if(button.getAttribute('data-close')){
        this.dom.closeButton = button;
      }
    });

    let icons = this.dom.dialog.querySelectorAll('.icon');
    Array.from(icons).forEach( icon => {
      if(icon.getAttribute('data-close')){
        this.dom.closeButton = icon;
      }
    });
  }

}
