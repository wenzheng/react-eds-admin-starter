import { App } from './App';
import { Settings } from './Settings';
import { Sysbar } from './Sysbar';

export class Layout {

   constructor(element){
     this.dom = {
       body: element,
       app: element.querySelector('.app'),
       settings: element.querySelector('.settings'),
       sysbar: element.querySelector('.sysbar'),
     };
     this.app = new App(this.dom.app);
     this.settings = new Settings(this.dom.settings);
     this.sysbar = new Sysbar(this.dom.sysbar);
     this.listeners = {
       resize: () => this.contentBehaviour()
     };
     this.events = {
       showNavigation: new CustomEvent("showNavigation"),
       hideNavigation: new CustomEvent("hideNavigation"),
       toggleNavigation: new CustomEvent("toggleNavigation"),
     }
   }

   init(){
     this.app.init();
     this.settings.init();
     this.sysbar.init();
     this.eventHandler();
     this.contentBehaviour();
   }

   destroy() {
     this.removeEventHandler();
     this.app.destroy();
     this.settings.destroy();
     this.sysbar.destroy();
   }
   
   eventHandler(){
     window.addEventListener('resize', this.listeners.resize, false);
   }
   
   removeEventHandler(){
     window.removeEventListener('resize', this.listeners.resize, false);
   }

   contentBehaviour(){
     const viewport = {
       sm: 480,
       md: 768,
       lg: 1024,
     };
     const w = window.outerWidth;
     if(w <= viewport.sm){
       document.dispatchEvent(this.events.hideNavigation);
     } else if (w <= viewport.md) {
       document.dispatchEvent(this.events.hideNavigation);
     } else if (w <= viewport.lg) {
       document.dispatchEvent(this.events.showNavigation);
     } else{
       document.dispatchEvent(this.events.showNavigation);
     }
   }

}
