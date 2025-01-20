import { Component, h, Element, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'input-numeric',
  shadow: true,
})
export class InputNumeric implements ComponentInterface {
  @Element() hostElement: HTMLElement;

  private handleKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    const isNumberKey = /^[0-9]$/.test(event.key);

    if (!isNumberKey && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  componentDidLoad() {
    const inputElement = this.hostElement.querySelector('input');
    if (inputElement) {
      inputElement.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  disconnectedCallback() {
    const inputElement = this.hostElement.querySelector('input');
    if (inputElement) {
      inputElement.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  render() {
    return <slot />;
  }
}
