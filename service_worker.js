
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Передача сохранённых данных при запросе
    if (message.type === 'GET_RESUME_DATA') {
        chrome.storage.session.get(['resumeData'], (result) => {
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
        chrome.storage.session.set({
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
