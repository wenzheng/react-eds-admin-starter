export class Sysbar {

  constructor(element) {
    this.dom = {
      sysbar: element,
      items: element.querySelectorAll('.item'),
      username: element.querySelector('.username'),
    };
    this.listeners = {
      click: () => this.toggleSettings(),
    };
    this.events = {
      toggleSettings: new CustomEvent("toggleSettings"),
    };
  }

  init() {
    this.eventHandler();
  }

  destroy() {
    this.removeEventHandler();
  }

  eventHandler() {
    this.dom.items.forEach( item => {
      if(item.querySelector('.username')){
        item.addEventListener('click', this.listeners.click, false);
      }
    });
  }

  removeEventHandler() {
    this.dom.items.forEach( item => {
      if(item.querySelector('.username')){
        item.removeEventListener('click', this.listeners.click, false);
      }
    });
  }

  toggleSettings() {
    window.dispatchEvent(this.events.toggleSettings);
  }

}