import { STORAGE_KEYS, PAGE_NAME_ENUM } from "../const/const.js";
import { itLanguageConfig, libAndFwConfig, commitFreqConfig } from "../const/chartConfigs.js";
import { convertStringToPageNameEnum } from "../helpers/convertToEnum.js";
import { convertElement, getElementFromDocument } from "../helpers/elements.js";
import Chart from "chart.js";
class PageChanger {
    componentFactory;
    translator;
    imageModalViewer;
    basePageName;
    burgerCheckbox;
    _currentPage;
    get currentPage() {
        return this._currentPage;
    }
    set currentPage(pageName) {
        this._currentPage = pageName;
        sessionStorage.setItem(STORAGE_KEYS.session.currentPage, pageName);
    }
    constructor(props) {
        this.componentFactory = props.componentFactory;
        this.translator = props.translator;
        this.imageModalViewer = props.imageModalViewer;
        this.basePageName = props.basePageName;
        this._currentPage = this.basePageName;
        this.currentPage = convertStringToPageNameEnum(sessionStorage.getItem(STORAGE_KEYS.session.currentPage) || props.basePageName);
        this.burgerCheckbox = getElementFromDocument("#viewBurgerNavCheckbox");
        this.changePageByLink(this.currentPage);
        this.burgerCheckbox.addEventListener("click", (el) => {
            const isViewBurger = convertElement(el.currentTarget).checked;
            if (isViewBurger) {
                this.componentFactory.root.style.visibility = "hidden";
                this.componentFactory.root.style.opacity = "0";
            }
            else {
                this.componentFactory.root.style.visibility = "visible";
                this.componentFactory.root.style.opacity = "1";
            }
        });
    }
    changePageByLink(pageNameToSelect) {
        const root = this.componentFactory.root;
        this.currentPage = convertStringToPageNameEnum(pageNameToSelect);
        this.burgerCheckbox.checked = false;
        root.style.visibility = "visible";
        root.style.opacity = "1";
        this.setPageByCurrentPage();
        if (pageNameToSelect == PAGE_NAME_ENUM.exp) {
            new Chart(convertElement(document.getElementById("it-language-chart")), itLanguageConfig);
            new Chart(convertElement(document.getElementById("lib-fw-chart")), libAndFwConfig);
            new Chart(convertElement(document.getElementById("commit-freq-chart")), commitFreqConfig);
        }
        this.showSelectedLinkByCurrentPage();
        this.transformLogoByCurrentPage();
        this.translator.translateSiteByCurrentLanguage();
        this.imageModalViewer.setImageModalEvents();
    }
    setPageByCurrentPage() {
        const components = this.componentFactory.components;
        if (components) {
            const currentPage = this._currentPage;
            this.componentFactory.root.innerHTML = components.pageList[currentPage].outerHTML;
            document.title = "fok ∙ " + currentPage;
        }
    }
    showSelectedLinkByCurrentPage() {
        const currentPage = this._currentPage;
        this.componentFactory.container
            .querySelectorAll(".header__nav")
            .forEach(navEl => {
            navEl.querySelectorAll(".header__nav-link")
                .forEach(linkEl => {
                if (linkEl.id.includes(currentPage))
                    linkEl.classList.add("header__nav-link--selected");
                else
                    linkEl.classList.remove("header__nav-link--selected");
            });
        });
    }
    transformLogoByCurrentPage() {
        const currentPage = this._currentPage;
        const logoLinkEl = convertElement(this.componentFactory.container.querySelector(".logo-link"));
        if (currentPage === PAGE_NAME_ENUM.home) {
            logoLinkEl.classList.add("logo-link--big");
        }
        else {
            logoLinkEl.classList.remove("logo-link--big");
        }
    }
}
export default PageChanger;