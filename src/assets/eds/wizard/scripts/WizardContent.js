export class WizardContent {

   constructor(element){
     this.dom = {
       content: element,
     }
   }

   init(){
     this.eventHandler();
   }

   eventHandler(){
     window.addEventListener('wizardState', (e) => this.showCorrectContent(e), false);
   }

   showCorrectContent(event){
     let currentStep = event.detail.state.currentStep;
     let contents = this.dom.content.querySelectorAll('.content');

     contents.forEach( (content,i) => {
       if(i == currentStep){
         this.showContent(content);
       }else {
         this.hideContent(content);
       }
     });
   }

   showContent(content){
     content.classList.remove('hidden');
   }

   hideContent(content){
     content.classList.add('hidden');
   }

 }

export default WizardContent;
