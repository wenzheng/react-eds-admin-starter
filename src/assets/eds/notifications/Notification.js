export class Notification {

  constructor(element){
    this.dom = {
      notification: element,
      title: element.querySelector('.title'),
      timeout: element.querySelector('.timeout'),
    }
  }

  init(){
    this.eventHandler();
  }

  eventHandler(){
    this.dom.notification.addEventListener(
      'click', () => this.hide(), false);

    window.addEventListener(
      'showNotification', () => this.show(), false);

    window.addEventListener(
      'hideNotification', () => this.hide(), false);
  }

  destroy(){
    this.dom.notification.removeEventListener('click',
      () => this.hide(), false);
  }

  hide(){
    this.dom.notification.classList.add('hidden');
    // setTimeout( () => this.dom.notification.remove(), 250);
    // this.destroy();
  }

  show(){
    this.dom.notification.classList.remove('hidden');
  }

  setTitle(text){
    this.dom.title.innerHTML = text;
  }

  setType(type){
    this.dom.notification.classList.add(type);
  }

}
