export class TabsComponent extends HTMLElement {
  constructor(props) {
    super();
    this.attachShadow({ mode: "open" });
    if (props) this.props = props;
  }

  #getTemplate() {
    return `
      <h1 class="title">${this.props?.title || "Tabs Component"}</h1>
      <div class="tabs-container">
        <div class="tabs-header">
          <span class="underline"></span>
        </div>
        <div class="tabs-content"></div>
      </div>
    `;
  }

  async #getStyles() {
    let css = await fetch("./Tabs/tabs-styles.css");
    css = await css.text();
    const style = document.createElement("style");
    style.textContent = css;
    this.shadowRoot.appendChild(style);
  }

  async render() {
    await this.#getStyles();
    this.shadowRoot.innerHTML += this.#getTemplate();

    // Crear pestañas de ejemplo
    this.addTab({ id: 1, title: "Tab 1" });
    this.addTab({ id: 2, title: "Tab 2" });
    this.addTab({ id: 3, title: "Tab 3" });

    // Crear contenido de ejemplo
    this.addRow({ tabId: 1, elements: [this.#createParagraph("Contenido de la pestaña 1")] });
    this.addRow({ tabId: 2, elements: [this.#createParagraph("Contenido de la pestaña 2")] });
    this.addRow({ tabId: 3, elements: [this.#createParagraph("Contenido de la pestaña 3")] });

    // Seleccionar la primera pestaña
    this.selectTab(1);
  }

  addTab({ id, title }) {
    const tab = document.createElement("div");
    tab.classList.add("tab");
    tab.setAttribute("data-tab-id", id);
    tab.textContent = title;

    tab.addEventListener("click", () => this.selectTab(id));

    this.shadowRoot.querySelector(".tabs-header").appendChild(tab);
  }

  addRow({ tabId, elements }) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.setAttribute("data-tab-id", tabId);
    elements.forEach(el => row.appendChild(el));
    this.shadowRoot.querySelector(".tabs-content").appendChild(row);
  }

  deleteTab(tabId) {
    const tab = this.shadowRoot.querySelector(`.tab[data-tab-id="${tabId}"]`);
    if (tab) tab.remove();
  }

  selectTab(tabId) {
    // desactivar pestaña previa
    const prev = this.shadowRoot.querySelector(".tab.selected");
    if (prev) prev.classList.remove("selected");

    // activar nueva pestaña
    const tab = this.shadowRoot.querySelector(`.tab[data-tab-id="${tabId}"]`);
    if (!tab) return;
    tab.classList.add("selected");

    // mostrar contenido correspondiente
    this.shadowRoot.querySelectorAll(".row").forEach(row => {
      row.classList.toggle("selected", row.getAttribute("data-tab-id") == tabId);
    });

    // mover underline
    const underline = this.shadowRoot.querySelector(".underline");
    underline.style.width = `${tab.offsetWidth}px`;
    underline.style.left = `${tab.offsetLeft}px`;
  }

  #createParagraph(text) {
    const p = document.createElement("p");
    p.textContent = text;
    return p;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("tabs-component", TabsComponent);