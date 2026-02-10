(function (globalScope, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    globalScope.SiteLayout = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DEFAULT_HOME_URL = 'index.html';
  const DEFAULT_GITHUB_URL = 'https://github.com/smartflame17';

  function buildHeaderTemplate(options = {}) {
    const homeUrl = options.homeUrl || DEFAULT_HOME_URL;
    const githubUrl = options.githubUrl || DEFAULT_GITHUB_URL;

    return `
      <header class="site-header">
        <div class="container site-header-inner">
          <a class="site-brand" href="${homeUrl}">Smartflame's Hub</a>
          <nav class="site-nav" aria-label="Primary">
            <a href="${homeUrl}">Main Page</a>
            <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </div>
      </header>
    `;
  }

  function buildFooterTemplate(options = {}) {
    const homeUrl = options.homeUrl || DEFAULT_HOME_URL;
    const githubUrl = options.githubUrl || DEFAULT_GITHUB_URL;

    return `
      <footer class="site-footer">
        <div class="container site-footer-inner">
          <p>&copy; 2025 Smartflame. Hosted on GitHub Pages.</p>
          <nav class="site-nav" aria-label="Footer">
            <a href="${homeUrl}">Main Page</a>
            <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
          </nav>
        </div>
      </footer>
    `;
  }

  function defineLayoutElements(dependencies = {}) {
    const customElementsRegistry = dependencies.customElementsRegistry || (typeof customElements !== 'undefined' ? customElements : null);
    const HTMLElementClass = dependencies.HTMLElementClass || (typeof HTMLElement !== 'undefined' ? HTMLElement : null);

    if (!customElementsRegistry || !HTMLElementClass) {
      return false;
    }

    class SiteHeader extends HTMLElementClass {
      connectedCallback() {
        this.innerHTML = buildHeaderTemplate({
          homeUrl: this.getAttribute('home-url'),
          githubUrl: this.getAttribute('github-url')
        });
      }
    }

    class SiteFooter extends HTMLElementClass {
      connectedCallback() {
        this.innerHTML = buildFooterTemplate({
          homeUrl: this.getAttribute('home-url'),
          githubUrl: this.getAttribute('github-url')
        });
      }
    }

    if (!customElementsRegistry.get('site-header')) {
      customElementsRegistry.define('site-header', SiteHeader);
    }

    if (!customElementsRegistry.get('site-footer')) {
      customElementsRegistry.define('site-footer', SiteFooter);
    }

    return true;
  }

  if (typeof window !== 'undefined') {
    defineLayoutElements();
  }

  return {
    DEFAULT_HOME_URL,
    DEFAULT_GITHUB_URL,
    buildHeaderTemplate,
    buildFooterTemplate,
    defineLayoutElements
  };
});
