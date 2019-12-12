module.exports = {
    'en': {
        code: 'en', name: 'English',

        msg_yes: 'yes',
        msg_no: 'no',
        btn_main_menu: 'Main Menu',

        msg_sel: 'English language selected',
        msg_intro: 'Here you can make request for place in babyshop or check status existing requests.',
        msg_request_new: 'Create new request',
        msg_request_list: 'View my requests',
        msg_select_store: 'Select babystore',
        msg_enter_fio: 'Enter FamilyName Name SecondName of the child as a reply message',
        msg_check_data: 'Is data bellow correct?',
        // msg_complete: 'Request registered with number: ',

        msg_back: 'Press "Main Menu" button to return in main menu',
        msg_norequests: 'No requests found. Select language to create one.',
        msg_your_requests: 'Your requests:',
        msg_requets_accepted: "Request registered with number <a href='http://unbscan.napm.uz/#/address/0x52a2b4383d3b9b995f6d66976b9f82aa98404ba4'>{code}</a>. Your child is {index} in queue. Average waiting time: 767665 days. We will notify you about changes in queue and will inform you when your child will be accepted in selected kindergarten.",

        tpl_status: '<b>Date</b>: {date}; <b>Garten</b>: {oyName}; <b>FIO</b>: {userName}; <b>Status</b>:{status}'
    },
    'ru': {
        code: 'ru', name: 'Русский',

        msg_yes: 'Да',
        msg_no: 'Нет',
        btn_main_menu: 'Главное меню',

        msg_sel: 'Русскйи язык выбран',
        msg_intro: 'Здесь вы можете подать заявку в детский сад или посмотреть статус уже поданных заявок.',
        msg_request_new: 'Подать заявку',
        msg_request_list: 'Статус моих заявок',
        msg_select_store: 'Выберете десткий сад',
        msg_enter_fio: 'Введите Фамилию Имя Отчество ребенка в ответном сообщении',
        msg_check_data: 'Верно ли записаны данные?',
//        msg_complete: 'Запрос зарегистрирован с номером: ',

        msg_back: 'Нажмите кнопку "Главное меню" для возвращения в главное меню',
        msg_norequests: 'Запросов не найдено. Выберите язык чтобы создать запрос.',
        msg_your_requests: 'Ваши заявки:',
        msg_requets_accepted: "Запрос зарегистрирован с номером <a href='http://unbscan.napm.uz/#/address/0x52a2b4383d3b9b995f6d66976b9f82aa98404ba4'>{code}</a>. Ваш ребенок {index} в очереди. Среднее время ожидания: 767665 дней. Мы будем оповещать вас о движении очереди и сообщим, когда ребенок будет принят в детский сад.",

        tpl_status: '<b>Дата</b>: {date}; <b>Сад</b>: {oyName}; <b>ФИО</b>: {userName}; <b>Статус</b>:{status}'
    }
}