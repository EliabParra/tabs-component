export class TabsComponent extends HTMLElement {
	constructor(props) {
		super();
		this.attachShadow({ mode: "open" })
        if (props) this.props = props
	}

	#getTemplate() {
        return `
            <h1 class="title">${this.props.title || "Tabs Component"}</h1>
            <div class="tabs-container">
                <div class="tabs-header"></div>
                <div class="tabs-content"></div>
            </div>
        `
    }

    async #getStyles() {
        let css = await fetch("./Tabs/tabs-styles.css")
        css = await css.text()
        const style = document.createElement("style")
        style.textContent = css
        this.shadowRoot.appendChild(style)
    }

    async render() {
        await this.#getStyles()
        this.shadowRoot.innerHTML += this.#getTemplate()
        this.addTab({id: 1, title: "Tab 1"})
    }

    addTab({id, title}) {
        const tab = document.createElement("div")
        tab.classList.add("tab")
        tab.setAttribute("data-tab-id", id)
        tab.textContent = title
        console.log(tab)
        this.shadowRoot.querySelector(".tabs-header").appendChild(tab)
        console.log(this.shadowRoot.querySelector(".tabs-header"))
    }

    addRow({tabId, elements, styles}) {
        const row = document.createElement("div")
        row.classList.add("row")
        row.setAttribute("data-tab-id", tabId)
        elements.forEach(element => {
            row.appendChild(element)
        })
        this.shadowRoot.querySelector(".tabs-content").appendChild(row)
    }

    deleteTab(tabId) {
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`)
        tab.remove()
    }

    selectTab(tabId) {
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`)
        tab.classList.add("selected")

        const rows = this.shadowRoot.querySelectorAll(`[data-tab-id="${tabId}"]`)
        rows.forEach(row => {
            row.classList.add("selected")
        })
    }

    show() { this.style.visibility = "visible" }
    hide() { this.style.visibility = "hidden" }

    enableTab(tabId) {
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`)
        tab.classList.remove("disabled")
    }

    disableTab(tabId) {
        const tab = this.shadowRoot.querySelector(`[data-tab-id="${tabId}"]`)
        tab.classList.add("disabled")
    }

    #checkAttributes(attrs) {
        attrs.forEach(attr => {
            if (this.hasAttribute(attr)) {
                this.setAttribute(attr, this.getAttribute(attr))
            }
            this.removeAttribute(attr)
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "title") {
            this.title = newValue
            this.render()
        }
    }

    connectedCallback() {
        this.#checkAttributes(["title"])
        this.render()
    }
}

customElements.define("tabs-component", TabsComponent)
