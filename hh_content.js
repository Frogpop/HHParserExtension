
//Функция парсинга данных с резюме
function parseResumeData() {
    try {
        const observer = new MutationObserver(function () {
            //Элемнт с должностью
            const jobOuterSpan = document.querySelector('div.title--om0YKCGvsgac9v_T');//document.querySelector('span.resume-block__title-text[data-qa="resume-block-title-position"]');
            //console.log('вот чё спрасилось по работе: ', jobOuterSpan);

            //Элемент с ФИО
            const fioElement = document.querySelector('h1[data-qa="resume-personal-name"]');
            // console.log('парсинг элемента с ФИО: ', fioElement);

            if(jobOuterSpan || fioElement) {
                observer.disconnect()

                //Значения по умолчанию
                let jobTitle = 'Не найдено';
                let fio = 'Не найдено'
                let resumeUrl = document.URL;

                if (jobOuterSpan) {
                    jobTitle = jobOuterSpan.innerText;
                }

                if (fioElement) {
                    jobTitle = fioElement.innerText;
                }

                // if (jobOuterSpan) {
                //     const innerSpan = jobOuterSpan.querySelector('span');
                //     if (innerSpan) {
                //         jobTitle = innerSpan.textContent.trim();
                //     }
                // }

                // console.log('ФИО: ', fio)
                // console.log('Род деятельности: ', jobTitle);
                // console.log('URL: ', resumeUrl);

                //Отправляем сообщение на сохранение данных
                chrome.runtime.sendMessage({
                    type: 'SAVE_RESUME_DATA',
                    data: {
                        fio,
                        jobTitle,
                        resumeUrl
                    }
                });
            }
        })

        observer.observe(document.body, { childList: true, subtree: true });

    }catch(err){
        console.error('Ошибка при обработке данных: ',err);
    }
}

parseResumeData();