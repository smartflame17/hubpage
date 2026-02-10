const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildHeaderTemplate,
  buildFooterTemplate,
  defineLayoutElements,
  DEFAULT_GITHUB_URL,
  DEFAULT_HOME_URL
} = require('../assets/js/layout-components.js');

class FakeHTMLElement {
  constructor() {
    this.innerHTML = '';
    this.attributes = new Map();
  }

  getAttribute(name) {
    return this.attributes.get(name) || null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
}

function createFakeRegistry() {
  const store = new Map();

  return {
    define(name, constructor) {
      store.set(name, constructor);
    },
    get(name) {
      return store.get(name);
    }
  };
}

test('header template includes default main page and github links', () => {
  const template = buildHeaderTemplate();

  assert.match(template, new RegExp(`href="${DEFAULT_HOME_URL}"`));
  assert.match(template, new RegExp(`href="${DEFAULT_GITHUB_URL}"`));
  assert.match(template, /Main Page/);
  assert.match(template, /GitHub/);
});

test('footer template includes custom main page and github links', () => {
  const template = buildFooterTemplate({
    homeUrl: '/portfolio',
    githubUrl: 'https://github.com/example'
  });

  assert.match(template, /href="\/portfolio"/);
  assert.match(template, /href="https:\/\/github.com\/example"/);
});

test('custom elements are defined and render with attributes', () => {
  const registry = createFakeRegistry();

  const registered = defineLayoutElements({
    customElementsRegistry: registry,
    HTMLElementClass: FakeHTMLElement
  });

  assert.equal(registered, true);

  const HeaderElement = registry.get('site-header');
  const FooterElement = registry.get('site-footer');

  assert.ok(HeaderElement);
  assert.ok(FooterElement);

  const headerInstance = new HeaderElement();
  headerInstance.setAttribute('home-url', '/home');
  headerInstance.setAttribute('github-url', 'https://github.com/portfolio-owner');
  headerInstance.connectedCallback();

  assert.match(headerInstance.innerHTML, /href="\/home"/);
  assert.match(headerInstance.innerHTML, /github.com\/portfolio-owner/);

  const footerInstance = new FooterElement();
  footerInstance.connectedCallback();

  assert.match(footerInstance.innerHTML, /Main Page/);
  assert.match(footerInstance.innerHTML, /GitHub/);
});
