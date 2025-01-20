import { Component, h, Prop, Element, ComponentInterface } from '@stencil/core';

@Component({
  tag: 'focus-next',
  shadow: true,
})
export class FocusNext implements ComponentInterface {
  @Prop() nextInputId: string;
  @Element() hostElement: HTMLElement;

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.nextInputId) {
      const root = this.hostElement.getRootNode() as ShadowRoot | Document;
      const nextElement = root.getElementById(this.nextInputId);
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

  componentDidLoad() {
    this.hostElement.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  disconnectedCallback() {
    this.hostElement.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  render() {
    return <slot />;
  }
}
