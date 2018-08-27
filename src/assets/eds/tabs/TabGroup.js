import { Tab } from './Tab';

export class TabGroup {
  constructor(element){
    this.dom = {
      tabgroup: element,
      titles: element.querySelectorAll('.title'),
      contents: element.querySelectorAll('.content')
    };
    this.tabs = [];
  }

  init(){
    this.initTabs();
    this.eventHandler();
  }

  eventHandler(){
    Array.from(this.tabs).forEach( tab => {
      tab.dom.title.addEventListener('click', () => {
        this.hideAll();
        tab.showContent();
      });
    });
  }

  hideAll(){
    this.tabs.forEach( tab => tab.hideContent() );
  }

  initTabs(){
    for(let i = 0; i < this.dom.titles.length; i++){
      let t = new Tab({
        title: this.dom.titles[i],
        content: this.dom.contents[i]
      });
      this.tabs.push(t);
    }
  }
}
