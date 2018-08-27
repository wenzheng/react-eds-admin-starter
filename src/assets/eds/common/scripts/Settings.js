export class Settings {

   constructor(element){
     this.dom = {
       settings: element,
     };
     this.listeners = {
       toggleSettings: () => this.toggle()
     };
   }

   init(){
     this.eventHandler();
   }

   destroy(){
     this.removeEventHandler();
   }

   eventHandler(){
     window.addEventListener(
       'toggleSettings', this.listeners.toggleSettings, false);
   }

   removeEventHandler(){
     window.removeEventListener(
       'toggleSettings', this.listeners.toggleSettings, false);
   }

   toggle(){
     if(this.dom.settings.classList.contains('hidden')){
       this.show();
     }else{
       this.hide();
     }
   }

   hide(){
     this.dom.settings.classList.add('hidden');
   }

   show(){
     this.dom.settings.classList.remove('hidden');
   }

 }