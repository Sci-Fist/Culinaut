import utils from '../core/utils.js';

class ContactForm {
    constructor() {
        this.state = {
            formType: 'default',
            formData: {}
        };
        
        this.formTypes = {
            privateDining: {
                title: 'Private Dining Anfrage',
                fields: [
                    { name: 'date', type: 'date', label: 'Wunschtermin', required: true },
                    { name: 'guests', type: 'number', label: 'Anzahl der Gäste', required: true },
                    { name: 'occasion', type: 'text', label: 'Anlass', required: false },
                    { name: 'dietary', type: 'textarea', label: 'Besondere Ernährungswünsche', required: false }
                ]
            },
            workshop: {
                title: 'Workshop Anmeldung',
                fields: [
                    { name: 'workshopType', type: 'select', label: 'Workshop Typ', required: true,
                      options: ['Kochen', 'Backen', 'Fermentieren', 'Nachhaltigkeit'] },
                    { name: 'participants', type: 'number', label: 'Teilnehmerzahl', required: true },
                    { name: 'preferredDates', type: 'text', label: 'Gewünschte Termine', required: true }
                ]
            },
            consulting: {
                title: 'Beratungsanfrage',
                fields: [
                    { name: 'consultingType', type: 'select', label: 'Art der Beratung', required: true,
                      options: ['Menüplanung', 'Küchen-Optimierung', 'Nachhaltigkeit', 'Andere'] },
                    { name: 'projectScope', type: 'textarea', label: 'Projektumfang', required: true },
                    { name: 'timeline', type: 'text', label: 'Zeitrahmen', required: true }
                ]
            }
        };

        this.init();
    }

    init() {
        this.setupFormTypeButtons();
        this.setupScrollToForm();
    }

    setupFormTypeButtons() {
        utils.dom.selectAll('[data-form-type]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = button.dataset.formType;
                this.changeFormType(formType);
                this.scrollToForm();
            });
        });
    }

    setupScrollToForm() {
        utils.dom.selectAll('[data-scroll-to="contact"]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToForm();
            });
        });
    }

    scrollToForm() {
        const formSection = utils.dom.select('#contact');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    changeFormType(type) {
        if (!this.formTypes[type]) return;

        this.state.formType = type;
        this.renderForm();
    }

    renderForm() {
        const formContainer = utils.dom.select('.contact-form-container');
        if (!formContainer) return;

        const formConfig = this.formTypes[this.state.formType];
        
        formContainer.innerHTML = `
            <h3>${formConfig.title}</h3>
            <form class="contact-form" id="contactForm">
                ${this.createFormFields(formConfig.fields)}
                <div class="form-group">
                    <button type="submit" class="submit-btn">Anfrage senden</button>
                </div>
            </form>
        `;

        this.setupFormValidation();
    }

    createFormFields(fields) {
        return fields.map(field => {
            const required = field.required ? 'required' : '';
            
            switch (field.type) {
                case 'select':
                    return `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <select id="${field.name}" name="${field.name}" ${required}>
                                <option value="">Bitte wählen</option>
                                ${field.options.map(option => 
                                    `<option value="${option}">${option}</option>`
                                ).join('')}
                            </select>
                        </div>
                    `;
                
                case 'textarea':
                    return `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <textarea id="${field.name}" name="${field.name}" 
                                    rows="4" ${required}></textarea>
                        </div>
                    `;
                
                default:
                    return `
                        <div class="form-group">
                            <label for="${field.name}">${field.label}</label>
                            <input type="${field.type}" id="${field.name}" 
                                   name="${field.name}" ${required}>
                        </div>
                    `;
            }
        }).join('');
    }

    setupFormValidation() {
        const form = utils.dom.select('#contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                await this.submitForm(form);
            }
        });
    }

    validateForm(form) {
        let isValid = true;
        const formData = new FormData(form);

        for (const [name, value] of formData.entries()) {
            const field = form.elements[name];
            const fieldGroup = field.closest('.form-group');
            
            if (field.hasAttribute('required') && !value) {
                this.showFieldError(fieldGroup, 'Dieses Feld ist erforderlich');
                isValid = false;
            } else {
                this.clearFieldError(fieldGroup);
            }
        }

        return isValid;
    }

    showFieldError(fieldGroup, message) {
        let errorElement = fieldGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = utils.dom.create('div', { 
                class: 'field-error',
                'aria-live': 'polite'
            });
            fieldGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        fieldGroup.classList.add('has-error');
    }

    clearFieldError(fieldGroup) {
        const errorElement = fieldGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
        fieldGroup.classList.remove('has-error');
    }

    async submitForm(form) {
        const submitButton = form.querySelector('.submit-btn');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Wird gesendet...';

            const formData = new FormData(form);
            const data = {
                type: this.state.formType,
                data: Object.fromEntries(formData.entries()),
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${config.api.baseUrl}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Übermittlung fehlgeschlagen');

            this.showSuccess('Ihre Anfrage wurde erfolgreich gesendet!');
            form.reset();
        } catch (error) {
            this.showError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    showSuccess(message) {
        const notification = utils.dom.create('div', {
            class: 'form-notification success',
            'aria-live': 'polite'
        }, [message]);
        
        this.showNotification(notification);
    }

    showError(message) {
        const notification = utils.dom.create('div', {
            class: 'form-notification error',
            'aria-live': 'polite'
        }, [message]);
        
        this.showNotification(notification);
    }

    showNotification(notification) {
        const container = utils.dom.select('.contact-form-container');
        container.insertBefore(notification, container.firstChild);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

export default new ContactForm();