// Написать функционал под модальные окна. +
// Написан функционал должен быть на классах с учетом дополнительного функционала. +
// 1) Автоматическое открытие с возможностью задержки
// 2) Количество показов на данного пользователя (уменьшать при закрытии пользователя) +
// 3) Вся верстка и стили должны грузится через js + весь функционал должен быть написан на чистом js +
class MyPopup {
    constructor(options) {
        // Проверка на подключение стиля
        if (MyPopup.stylesOnPage == false) {
            let check = this.checkStyles();
            if (check == false) {
                this.addStyles();
                MyPopup.stylesOnPage = true;
            } else {
                MyPopup.stylesOnPage = true;
            }
        }

        // время css-анимации закрытия модалки
        // перед тем как будет убран класс .mp-modal--close
        this.animationSpeed = 500;

        // значение, чтобы избежать конфликта одновременного вызова
        // открытия и закрытия модалки
        this.closeProcess = false;

        // уничтожена ли модалка
        this.popupDestroyed = false;

        // кол-во доступных открытий модалки
        this.popupMaxOpenCount = options.maxOpenCount || null;

        // модалка
        this.popup = this._createPopup(options);

        // обработчик для модалки
        this.popupHandler = (e) => {
            if (e.target.dataset.mpclose) {
                this.close();
            }
        }
        this.popup.addEventListener('click', this.popupHandler);

        this.popupIntervalDone = false;
        if (options.autoOpen && options.autoOpen > 0) {
            this.popupInterval = setInterval(() => {
                this.popupIntervalDone = true;
                this.open();
            }, options.autoOpen);
        }
    }

    // добавления кнопок с обработчиками в футер
    _createPopupFooter(buttons = []) {
        const footer = document.createElement('div');
        if (buttons.length === 0) {
            return footer;
        }

        footer.classList.add('mp-modal__footer');

        buttons.forEach((options) => {
            const button = document.createElement('button');
            button.textContent = options.text || "Button";
            button.classList.add(options.class || "");
            if (options.handler) {
                button.addEventListener("click", options.handler);
            }
            footer.appendChild(button);
        });

        return footer;
    }

    _createPopup(options) {
        const title = options.title || 'MyPopup';
        const content = options.content || 'Content';
        const width = options.width || '500px';
        const popupTemplate = document.createElement('div');
        popupTemplate.classList.add('mp-modal');
        popupTemplate.insertAdjacentHTML('beforeend', `
            <div class="mp-modal__container" data-mpclose="true">
                <div class="mp-modal__window" style="width: ${width};">
                    <div class="mp-modal__header">
                        <h5 class="mp-modal__title">
                            ${title}
                        </h5>
                        ${options.closable ? `
                            <button class="mp-modal__close" data-mpclose="true">&times;</button>
                        ` : ''}
                    </div>
                    <div class="mp-modal__content">
                        ${content}
                    </div>
                </div>
            </div>
        `);
        popupTemplate.querySelector('.mp-modal__content').after(this._createPopupFooter(options.footerButtons));
        document.body.appendChild(popupTemplate);
        return popupTemplate;
    }

    // открыть модалку
    open() {
        // если интервал отработал, то удалить интервал и установить флаг в false
        if (this.popupIntervalDone) {
            clearInterval(this.popupInterval);
            this.popupIntervalDone = false;
        }
        // если модалка уничтожена, то вернуть false
        if (this.popupDestroyed) {
            return false;
        }
        
        // если процесс закрытия завершён, открыть окно
        if (this.closeProcess == false) {
            if (this.popupMaxOpenCount !== null && this.popupMaxOpenCount > 0) {
                this.popup.classList.add('mp-modal--open');
                this.popupMaxOpenCount--;
            }
        }
    }

    close() {
        this.closeProcess = true;
        this.popup.classList.remove('mp-modal--open');
        this.popup.classList.add('mp-modal--close');
        setTimeout(() => {
            this.popup.classList.remove('mp-modal--close');
            this.closeProcess = false;
        }, this.animationSpeed);
    }

    destroy() {
        // удалить из HTML эту модалку
        this.popup.parentNode.removeChild(this.popup);
        this.popup.removeEventListener('click', this.popupHandler);
        this.popupDestroyed = true;
    }

    // статическая переменная класса, индикатор подключения стилей
    static stylesOnPage = false;

    checkStyles() {
        let styles = document.head.querySelector('link[href$="mypopup.css"]');
        if (styles && styles !== null) return true;
        return false;
    }

    addStyles() {
        let link = document.createElement("link");
        let head = document.head || document.getElementsByTagName('head')[0];
        link.href = "mypopup.css";
        link.rel = "stylesheet";
        head.appendChild(link);
    }
}