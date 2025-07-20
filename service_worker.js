
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Передача сохранённых данных при запросе
    if (message.type === 'GET_RESUME_DATA') {
        chrome.storage.local.get(['resumeData'], (result) => {
            if (result.resumeData) {
                sendResponse({ type: 'RESUME_DATA', payload: result.resumeData });
            } else {
                sendResponse({ type: 'RESUME_DATA', payload: null });
            }
        });

        return true;
    }

    // Обработка сохранения данных
    if (message.type === 'SAVE_RESUME_DATA') {
        const { fio, jobTitle, resumeUrl } = message.data;

        //Сохраняем данные в сессионный сторадж
        chrome.storage.local.set({
            resumeData: {
                fio,
                jobTitle,
                resumeUrl,
                timestamp: new Date().toISOString()
            }
        });


        //Отображение бейджа
        chrome.action.setBadgeText({ text: '✔️' });

        //Затирание бейджа
        setTimeout(() => {
            chrome.action.setBadgeText({ text: '' });
        }, 3000);
    }
});

//Отчистка storage.local при закрытии браузера
chrome.windows.onRemoved.addListener(() => {
    chrome.windows.getAll({ populate: true }, (windows) => {
        if (windows.length === 0) {
            chrome.storage.local.clear();
        }
    });
});