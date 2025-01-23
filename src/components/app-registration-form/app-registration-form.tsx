import { Component, h, State } from '@stencil/core';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  documentNumber: string;
  documentType: string;
  gender: string;
  country: string;
  phone: string;
  password: string;
};

const phoneNumberPatterns: { [key: string]: RegExp } = {
  Perú: /^9\d{8}$/,
  Argentina: /^\+?549\d{8}$/,
  México: /^\+?521\d{9}$/,
  Colombia: /^\+?57\d{10}$/,
  Chile: /^\+?569\d{8}$/,
};

@Component({
  tag: 'app-registration-form',
  styleUrl: 'app-registration-form.css',
  shadow: true,
})
export class AppRegistrationForm {
  @State() registrationForm: FormData = {
    firstName: '',
    lastName: '',
    email: '',
    documentNumber: '',
    documentType: '',
    gender: '',
    country: '',
    phone: '',
    password: '',
  };

  @State() errorMessages: { [key: string]: string } = {};

  countries: string[] = ['Perú', 'Argentina', 'México', 'Colombia', 'Chile'];
  documentsType: string[] = ['DNI', 'Pasaporte', 'Carnet de Extranjería'];

  handleInputChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.registrationForm = { ...this.registrationForm, [field]: input.value };
    this.validateField(field, input.value);
  }

  handleInputBlur(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    this.validateField(field, input.value);
  }

  validateField(field: string, value: string) {
    const errors: { [key: string]: string } = {
      firstName: value ? '' : 'Ingresa su nombre',
      lastName: value ? '' : 'Ingrese su apellido',
      email: value.trim() === '' ? 'Ingresa tu correo electrónico' : /.+@.+\..+/.test(value) ? '' : 'Formato de correo incorrecto',
      documentNumber: value.trim() === '' ? 'Ingrese su número de documento' : value.length >= 8 ? '' : 'Formato de documento incorrecto',
      documentType: value ? '' : 'Ingrese el tipo de documento',
      gender: value ? '' : 'Seleccione su género',
      country: value ? '' : 'Seleccione su país',
      phone: value.trim() === '' ? 'Ingrese su número de celular' : phoneNumberPatterns[this.registrationForm.country]?.test(value) || !value ? '' : `Número de teléfono inválido`,
      password:
        value.trim() === ''
          ? 'Ingrese una contraseña segura'
          : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? ''
          : 'La contraseña debe cumplir los criterios',
    };
    this.errorMessages = { ...this.errorMessages, [field]: errors[field] };
  }

  validateForm() {
    Object.keys(this.registrationForm).forEach(key => this.validateField(key, this.registrationForm[key]));
  }

  formIsValid() {
    if (Object.values(this.errorMessages).length === 0) return false;
    return Object.values(this.errorMessages).every(message => message === '');
  }

  hasLowercase() {
    const password = this.registrationForm.password;
    return password && /[a-z]/.test(password);
  }

  hasUppercase() {
    const password = this.registrationForm.password;
    return password && /[A-Z]/.test(password);
  }

  hasNumber() {
    const password = this.registrationForm.password;
    return password && /\d/.test(password);
  }

  hasSpecialChar() {
    const password = this.registrationForm.password;
    return password && /[@$!%*?&]/.test(password);
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    this.validateForm();

    if (this.formIsValid()) {
      console.log('Formulario enviado:', this.registrationForm);
      alert(JSON.stringify(this.registrationForm));
    }
  }

  render() {
    return (
      <form onSubmit={event => this.handleSubmit(event)} novalidate>
        <h1>Formulario de Registro</h1>

        <fieldset>
          <legend>Información Personal</legend>
          <div class="grid">
            <div>
              <label htmlFor="firstName">Nombres</label>
              <focus-next nextInputId="lastName">
                <input
                  id="firstName"
                  value={this.registrationForm.firstName}
                  onBlur={event => this.handleInputBlur(event, 'firstName')}
                  onInput={event => this.handleInputChange(event, 'firstName')}
                  required
                  aria-required="true"
                  aria-describedby="firstName-error"
                  aria-invalid={this.errorMessages.firstName ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.firstName && this.errorMessages.firstName != '' }}
                />
              </focus-next>
              <span id="lastName-error" aria-live="polite">
                {this.errorMessages.firstName}
              </span>
            </div>
            <div>
              <label htmlFor="lastName">Apellidos</label>
              <focus-next nextInputId="email">
                <input
                  id="lastName"
                  value={this.registrationForm.lastName}
                  onBlur={event => this.handleInputChange(event, 'lastName')}
                  onInput={event => this.handleInputChange(event, 'lastName')}
                  required
                  aria-required="true"
                  aria-describedby="firstName-error"
                  aria-invalid={this.errorMessages.lastName ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.lastName && this.errorMessages.lastName != '' }}
                />
              </focus-next>

              <span id="firstName-error" aria-live="polite">
                {this.errorMessages.lastName}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="email">Correo Electrónico</label>
            <focus-next nextInputId="documentType">
              <input
                id="email"
                type="email"
                inputmode="email"
                value={this.registrationForm.email}
                onBlur={event => this.handleInputChange(event, 'email')}
                onInput={event => this.handleInputChange(event, 'email')}
                required
                aria-required="true"
                aria-describedby="email-error"
                aria-invalid={this.errorMessages.email ? 'true' : null}
                class={{ 'is-invalid': this.errorMessages.email && this.errorMessages.email != '' }}
              />
            </focus-next>
            <span id="email-error" aria-live="polite">
              {this.errorMessages.email}
            </span>
          </div>
        </fieldset>

        <fieldset>
          <legend>Datos Necesarios</legend>
          <div class="grid">
            <div>
              <label htmlFor="documentType">Tipo de Documento</label>
              <focus-next nextInputId="documentNumber">
                <select
                  id="documentType"
                  vocab={this.registrationForm.documentType}
                  onBlur={event => this.handleInputChange(event, 'documentType')}
                  onInput={event => this.handleInputChange(event, 'documentType')}
                  required
                  aria-required="true"
                  aria-describedby="documentType-error"
                  aria-invalid={this.errorMessages.documentType ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.documentType && this.errorMessages.documentType != '' }}
                >
                  <option value="">Seleccione...</option>
                  {this.documentsType.map(type => (
                    <option value={type}>{type}</option>
                  ))}
                </select>
              </focus-next>
              <span id="documentType-error" aria-live="polite">
                {this.errorMessages.documentType}
              </span>
            </div>
            <div>
              <label htmlFor="documentNumber">Número de Documento</label>
              <focus-next nextInputId="gender">
                <input-numeric>
                  <input
                    id="documentNumber"
                    maxlength={12}
                    value={this.registrationForm.documentNumber}
                    onBlur={event => this.handleInputChange(event, 'documentNumber')}
                    onInput={event => this.handleInputChange(event, 'documentNumber')}
                    required
                    aria-required="true"
                    aria-describedby="documentNumber-error"
                    aria-invalid={this.errorMessages.documentNumber ? 'true' : null}
                    class={{ 'is-invalid': this.errorMessages.documentNumber && this.errorMessages.documentNumber != '' }}
                  />
                </input-numeric>
              </focus-next>
              <span id="documentNumber-error" aria-live="polite">
                {this.errorMessages.documentNumber}
              </span>
            </div>
            <div>
              <label htmlFor="gender">Identidad de Género</label>
              <focus-next nextInputId="country">
                <select
                  id="gender"
                  vocab={this.registrationForm.gender}
                  onBlur={event => this.handleInputChange(event, 'gender')}
                  onInput={event => this.handleInputChange(event, 'gender')}
                  required
                  aria-required="true"
                  aria-describedby="gender-error"
                  aria-invalid={this.errorMessages.gender ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.gender && this.errorMessages.gender != '' }}
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </focus-next>
              <span id="gender-error" aria-live="polite">
                {this.errorMessages.gender}
              </span>
            </div>
            <div>
              <label htmlFor="country">País</label>
              <focus-next nextInputId="phone">
                <select
                  id="country"
                  vocab={this.registrationForm.country}
                  onBlur={event => this.handleInputChange(event, 'country')}
                  onInput={event => this.handleInputChange(event, 'country')}
                  required
                  aria-required="true"
                  aria-describedby="country-error"
                  aria-invalid={this.errorMessages.country ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.country && this.errorMessages.country != '' }}
                >
                  <option value="">Seleccione...</option>
                  {this.countries.map(type => (
                    <option value={type}>{type}</option>
                  ))}
                </select>
              </focus-next>
              <span id="country-error" aria-live="polite">
                {this.errorMessages.country}
              </span>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Seguridad</legend>
          <div>
            <label htmlFor="phone">Teléfono Celular</label>
            <focus-next nextInputId="password">
              <input-numeric>
                <input
                  id="phone"
                  value={this.registrationForm.phone}
                  onBlur={event => this.handleInputChange(event, 'phone')}
                  onInput={event => this.handleInputChange(event, 'phone')}
                  required
                  aria-required="true"
                  aria-describedby="phone-error"
                  aria-invalid={this.errorMessages.phone ? 'true' : null}
                  class={{ 'is-invalid': this.errorMessages.phone && this.errorMessages.phone != '' }}
                />
              </input-numeric>
            </focus-next>
            <span id="phone-error" aria-live="polite">
              {this.errorMessages.phone}
            </span>
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={this.registrationForm.password}
              onBlur={event => this.handleInputChange(event, 'password')}
              onInput={event => this.handleInputChange(event, 'password')}
              required
              aria-required="true"
              aria-describedby="password-error"
              aria-invalid={this.errorMessages.password ? 'true' : null}
              class={{ 'is-invalid': this.errorMessages.password && this.errorMessages.password != '' }}
            />
            <div id="password-criteria" class="password-criteria">
              La contraseña debe contener:
              <ul>
                <li class={{ 'is-valid': this.registrationForm.password.length >= 8 }}>Al menos 8 caracteres</li>
                <li class={{ 'is-valid': this.hasLowercase() }}>Al menos una letra minúscula</li>
                <li class={{ 'is-valid': this.hasUppercase() }}>Al menos una letra mayúscula</li>
                <li class={{ 'is-valid': this.hasNumber() }}>Al menos un número</li>
                <li class={{ 'is-valid': this.hasSpecialChar() }}>Al menos un carácter especial (@$!%*?&)</li>
              </ul>
            </div>
            <span id="password-error" aria-live="polite">
              {this.errorMessages.password}
            </span>
          </div>
        </fieldset>

        <button disabled={!this.formIsValid()} type="submit">
          Registrar
        </button>
      </form>
    );
  }
}
