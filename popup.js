
//Функция проверки доступности функции вставки
function checkFunction() {
    if (typeof window.startJiraFill !== 'function') {
        console.error('Вставка не предусмотрена на данной вкладке');
        return false;
    }
    return true;
}

//Запуск функции вставки
function startQuery(){
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (!tabs || !tabs[0]) {
            console.error('Активная вкладка не найдена');
            return;
        }

        const tab = tabs[0];

        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: checkFunction,
        }, (results) =>{
            if (results[0].result) {
                //Если функция доступна отправка сообщения для запуска вставки
                chrome.tabs.sendMessage(tab.id, { action: 'RUN_JIRA_FILL' });
            }
        })
    });
}

document.addEventListener('DOMContentLoaded', startQuery);

document.getElementById('fillBtn').addEventListener('click', startQuery);
