export class SignIn {

  constructor(element) {
    this.dom = {
      signin: element,
      reveal: element.querySelector('.reveal'),
      inputPassword: element.querySelector('#password'),
      form: element.querySelector('form'),
      error: element.querySelector('.error'),
      welcome: element.querySelector('.welcome'),
    };
    this.listeners = {
      click: () => this.revealPassword(),
      blur: (e) => this.validateFieldOnBlur(e),
      submit: (e) => this.validateFormOnSubmit(e),
    };
    this.messages = {
      valueMissing: 'Please fill out this field.',
      typeMismatch: {
        email: 'Please use a valid email.',
        fallback: 'Please use the correct input type.'
      },
      patternMismatch: {
        signum: 'Please use a valid signum.',
        fallback: 'Please match the requested format.'
      },
      fallback: 'Please enter a correct value for this field.'
    }
    this.props = {
      validFields: []
    }
  }

  init() {
    this.removeNativeValidation();
    this.eventHandler();
    // this.showGenericError();
  }

  destroy() {
    this.removeEventHandler();
  }

  eventHandler() {
    this.dom.reveal.addEventListener('click', this.listeners.click, false);
    this.dom.signin.addEventListener('blur', this.listeners.blur, true);
    this.dom.signin.addEventListener('submit', this.listeners.submit, true);
  }

  removeEventHandler() {
    this.dom.reveal.removeEventListener('click', this.listeners.click, false);
    this.dom.signin.removeEventListener('blur', this.listeners.blur, false);
    this.dom.signin.removeEventListener('submit', this.listeners.submit, false);
  }

  revealPassword() {
    var icon = this.dom.signin.querySelector('.reveal .icon');
    var message = this.dom.reveal.querySelector('.message');
    if (this.dom.inputPassword.type === "password") {
      this.dom.inputPassword.type = "text";
      icon.classList.remove('icon-eye');
      icon.classList.add('icon-eye-solid');
      message.innerText = 'Hide password';
    } else {
      this.dom.inputPassword.type = "password";
      icon.classList.remove('icon-eye-solid');
      icon.classList.add('icon-eye');
      message.innerText = 'Show password';
    }
  }

  showGenericError() {
    var error = this.dom.error;
    error.classList.remove('hidden');
    var inputFields = this.dom.signin.querySelectorAll('.field > input');
    inputFields.forEach( input => {
      input.classList.add('invalid');
    });
  }

  removeNativeValidation() {
    this.dom.form.setAttribute('novalidate', true);
  }

  validateFieldOnBlur(e) {
    var inputField = e.target;
    var field = inputField.parentNode;
    var hint = field.querySelector('.hint');

    if (field.classList.contains('validate')){
      var error = this.getErrorType(inputField);

      if (error && error !== this.messages.valueMissing){
        hint.innerText = error;
        inputField.classList.add('invalid');
      } else {
        inputField.classList.remove('invalid');
        inputField.classList.add('hidden');
      }
    };
  }

  validateFormOnSubmit(e) {
    var formFields = e.target.querySelectorAll('.field');

    formFields.forEach( (field, i) => {
      var inputField = field.querySelector('input');
      var hint = field.querySelector('.hint');
      var error = this.getErrorType(inputField);

      if (error){
        hint.innerText = error;
        inputField.classList.add('invalid');
        e.preventDefault();
        this.props.validFields[i] = false;
      } else {
        inputField.classList.remove('invalid');
        inputField.classList.add('hidden');
        this.props.validFields[i] = true;
      }
    });

    var allFieldsValid = this.props.validFields.every( state => {
      return state == true;
    });

    // This is just for demo purposes
    if(allFieldsValid){
      this.successSignIn();
    }
  }

  getErrorType(field) {
    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;
    var validity = field.validity;
    if (validity.valid) return;
    if (validity.valueMissing) return this.messages.valueMissing;
    if (validity.typeMismatch) {
        if (field.type === 'email') return this.messages.typeMismatch.email;
        return this.messages.typeMismatch.fallback;
    }
    if (validity.patternMismatch) {
        if (field.classList.contains('signum')) return this.messages.patternMismatch.signum;
        return this.messages.patternMismatch.fallback;
    }
    return this.messages.fallback;
  }

  successSignIn() {
    this.hideSignInForm();
    this.showWelcomeScreen();
    // This is just for demo purposes
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }

  showWelcomeScreen() {
    this.dom.welcome.classList.remove('hidden');
  }

  hideWelcomeScreen() {
    this.dom.welcome.classList.add('hidden');
  }

  showSignInForm() {
    this.dom.form.classList.remove('hidden');
  }

  hideSignInForm() {
    this.dom.form.classList.add('hidden');
  }

  hideSignInPage() {
    this.dom.signin.classList.add('hidden');
  }

  setWelcomeName(name) {
    this.dom.welcome.querySelector('.username').innerText = name;
  }

}
