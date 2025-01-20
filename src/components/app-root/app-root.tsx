import { Component, h } from '@stencil/core';
import { Router } from '../../';
import { Route } from 'stencil-router-v2';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div class="container">
        <main>
          <Router.Switch>
            <Route path="/">
              <app-registration-form />
            </Route>
          </Router.Switch>
        </main>
      </div>
    );
  }
}
