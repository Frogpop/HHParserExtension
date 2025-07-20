
//console.log('jira_content.js успешно загружен!');

// Получение данных из storage
function getResumeDataFromStorage(callback) {
    chrome.runtime.sendMessage({ type: 'GET_RESUME_DATA' }, (response) => {
        if (response && response.type === 'RESUME_DATA') {
            if(!response.payload){
                    alert('Данные с HH.ru не найдены. Откройте страницу резюме');
            }
            callback(response.payload);
        }
    });
}

// Функция автозаполнения для странцы с редактированием задачи
function fillEditIssue(resumeData) {
    // Функция для обработки полей
    function processField(editSelector, inputSelector, valueHandler) {
        //Поиск поля с данными
        const editBtn = document.querySelector(editSelector);
        if (editBtn) {
            //Клик на это поле, Jira подменит поле на редактируемое
            editBtn.click();
            editBtn.dispatchEvent(new Event('input', { bubbles: true }));

            const observerInput = new MutationObserver(() => {
                //Ожидаем появление редактируемого поля и заменяем в нём даныне
                const inputField = document.querySelector(inputSelector);
                if (inputField) {
                    observerInput.disconnect();
                    valueHandler(inputField);
                }
            });
            observerInput.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Обработка для ФИО
    processField(
        '[data-testid="issue-field-summary.ui.issue-field-summary-inline-edit--container"] button',
        'textarea[aria-label="Summary"]',
        (field) => {
            field.value = `${resumeData.fio}`;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('изменённое поле: ', field);
        }
    );

    // Обработка для URL
    processField(
        '[data-testid="issue-view-layout-url-field.ui.issue-field-url-container"] button',
        'input[aria-label="URL"]',
        (field) => {
            field.value = `${resumeData.resumeUrl}`;
            field.dispatchEvent(new Event('input', { bubbles: true }));
        }
    );


    //Обработка для должности
    processField(
        '[data-editor-container-id="issue-description-editor"] button',
        '[data-editor-container-id="issue-description-editor"] p',
        (field) => {
            field.textContent = `${resumeData.jobTitle}`;
            field.dispatchEvent(new Event('input', { bubbles: true }));
        }
    );
}

//Функция для автозаполнения страницы с созданием задачи
function fillCreateIssue(resumeData) {

    //Заполнение заголовка ФИО
    const summaryField = document.querySelector('input#summary');
    if (summaryField) {
        summaryField.value = `${resumeData.fio}`;
        summaryField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    //Заполнение описания должностью
    const descriptionField = document.querySelector('textarea#description');
    if (descriptionField) {
        descriptionField.value = `${resumeData.jobTitle}`;
        descriptionField.dispatchEvent(new Event('input', { bubbles: true }));
    }

    //Заполнение кастомного поля URL
    const urlFieald = document.querySelector('input#customfield_10041');
    if (urlFieald) {
        urlFieald.value = `${resumeData.resumeUrl}`;
        urlFieald.dispatchEvent(new Event('input', { bubbles: true }));
    }

    //Отправка сообщения об успешной вставке
    window.postMessage({ type: 'JIRA_FILL_SUCCESS' }, '*');
    //console.log('✅ Данные вставлены в Jira:', resumeData);
}

//Функция для определения типа страницы, и запуска автозаполнения
function startJiraFill() {
    const url = document.URL;
    getResumeDataFromStorage((resumeData) => {
        if(url.includes('CreateIssue!default.jspa') || url.includes('CreateIssue.jspa')) {
            fillCreateIssue(resumeData);
        }else if (url.includes('browse')) {
            fillEditIssue(resumeData);
        }
    });
}

//Запуск скрипта при получении сообщения
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'RUN_JIRA_FILL') {
        startJiraFill();
    }
});

//Делаем функцию глобальной, что её могли вызывать другие скрипты
window.startJiraFill = startJiraFill;