export class WizardFooter {

   constructor(element){
     this.dom = {
       wizardFooter: element,
       nextAction: element.querySelector('#wizard-next'),
       prevAction: element.querySelector('#wizard-previous')
     };

     this.target = element.dataset.target;
     this.wizardState = undefined;
     this.events = {
       wizardStateChange: new CustomEvent("wizardStateChange", {
         detail: {
           message: "state changed"
         },
         bubbles: true,
         cancelable: true
       }),
       wizardShowNextSteps: new CustomEvent("wizardShowNextSteps", {
         detail: {
           message: "show next steps"
         },
         bubbles: true,
         cancelable: true
       }),
       wizardShowPrevSteps: new CustomEvent("wizardShowPrevSteps", {
         detail: {
           message: "show prev steps"
         },
         bubbles: true,
         cancelable: true
       }),
     }
   }

   init(){
     this.eventHandler();
   }

   eventHandler(){
     this.dom.nextAction.addEventListener('click', () => this.nextStep(), false);
     this.dom.prevAction.addEventListener('click', () => this.prevStep(), false);
     document.addEventListener('wizardState', (e) => this.updateButtons(e), false);
   }

   nextStep(){
     let currentStep = this.wizardState.currentStep;
     let lastStepPresentation = this.wizardState.presentation.slice(-1)[0];

     if(currentStep >= 0 && currentStep < this.wizardState.numSteps){
       this.wizardState.currentStep++;
       this.events.wizardStateChange.detail.state = this.wizardState;
       document.dispatchEvent(this.events.wizardStateChange);
       if(currentStep === lastStepPresentation -1){
         document.dispatchEvent(this.events.wizardShowNextSteps);
       }
     }
   }

   prevStep(){
     let currentStep = this.wizardState.currentStep;
     let firstStepPresentation = this.wizardState.presentation[0];

     if(currentStep > 0){
       this.wizardState.currentStep--;
       this.events.wizardStateChange.detail.state = this.wizardState;
       document.dispatchEvent(this.events.wizardStateChange);

       if(currentStep === firstStepPresentation){
       document.dispatchEvent(this.events.wizardShowPrevSteps);
       }
     }
   }

   updateButtons(event){
     this.wizardState = event.detail.state;
     let currentStep = event.detail.state.currentStep;

     if(currentStep === event.detail.state.numSteps -1){
       this.dom.nextAction.innerHTML = 'Finish';
     }else{
       this.dom.nextAction.removeAttribute('disabled');
       this.dom.nextAction.innerHTML = '<span class="term">Next</span> <i class="icon icon-arrow-right"></i>';
     }

     if(currentStep > 0){
       this.dom.prevAction.classList.remove('hidden');
     }else {
       this.dom.prevAction.classList.add('hidden');
     }

     if(currentStep === event.detail.state.numSteps){
       this.dom.nextAction.innerHTML = 'Finished';
        this.dom.prevAction.remove();
        this.dom.prevAction.removeAttribute('disabled');
        this.dom.nextAction.setAttribute('disabled', true);
     }

   }

}

export default WizardFooter;
