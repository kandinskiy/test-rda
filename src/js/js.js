new Quiz("#quiz form", {
  steps: [
    {
      title: 'Для кого вы ищете учебное заведение?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_for',
          values: ['Себе', 'Супругу/супруге', 'Родственнику', 'Коллеге', 'Ребенку', 'Другое']
        }
      ]
    },
    {
      title: 'В каком городе планируете поступать?',
      elements: [
        {
          type: 'select',
          name: 'quiz_city',
          label: 'Город',
          values: ['', 'Санкт-Петербург', 'Москва', 'Новосибирск', 'Нижний Новгород', 'Ростов-на-Дону', 'Екатеринбург', 'Краснодар']
        }
      ]
    },
    {
      title: 'Какое образование уже есть?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_education',
          values: ['9 классов', '11 классов', 'Колледж/техникум', 'Училище', 'Неоконченное высшее', 'Высшее']
        }
      ]
    },
    {
      title: 'Куда планируете поступать?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_institution',
          values: ['Вуз', 'Колледж/техникум', 'Училище']
        }
      ]
    },
    {
      title: 'Какую форму обучения предпочитаете?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_format',
          values: ['Очную', 'Заочную', 'Дистанционную']
        }
      ]
    },
    {
      title: 'Рассматриваете платное обучение?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_payment',
          values: ['Нет, только бюджет', 'Да, планирую учиться платно', 'Возможны оба варианта']
        }
      ]
    },
    {
      title: 'Какая специальность интересует?',
      elements: [
        {
          type: 'select',
          name: 'quiz_specialty',
          label: 'Специальность',
          values: ['', 'Любая', 'Экономика', 'Философия', 'Социология', 'Юриспруденция', 'Менеджмент', 'Информатика']
        }
      ]
    },
    {
      title: 'Как скоро планируете поступать?',
      elements: [
        {
          type: 'radio',
          name: 'quiz_period',
          values: ['Как можно быстрее', 'Месяц', 'Квартал', 'Полгода', 'Год']
        }
      ]
    },
    {
      title: 'Отлично, ваша подборка готова! 🥳',
      elements: [
        {
          type: 'finishStep'
        }
      ]
    }
  ],
  finishStep: [
    {object: 'input', type: 'text', name: 'user_name', label: 'Как вас зовут? *', impotent: 1},
    {object: 'input', type: 'phone', name: 'user_phone', label: 'Номер телефона', impotent: 0},
    {object: 'input', type: 'mail', name: 'user_mail', label: 'E-mail *', impotent: 1},
    {object: 'submit', name: 'submit', text: 'Получить подборку'},
    {object: 'agreed', text: 'Нажимая на кнопку, вы даете согласие на обработку своих <a href="">Персональных данных</a>'}
  ],
  executeFunction: quizSubmit
});

let newElement = (type, attributes = {}, classes = []) => {
  let element = document.createElement(type);
  for (let key in attributes) { if (attributes.hasOwnProperty(key)) { element.setAttribute(key, attributes[key]); } }
  if (classes && classes.length) { for (let value of classes) { element.classList.add(value); } }
  return element;
};

function quizSubmit() {
  const quiz = document.getElementById('quiz'),
    form = quiz.querySelector('form');

  let valuesForm = {
    'answers': form.answers.value,
    'user_name': form.user_name.value,
    'user_phone': form.user_phone.value,
    'user_mail': form.user_mail.value
  };

  let jsonForServer = JSON.stringify(valuesForm);
  console.log(jsonForServer);

  form.submit.setAttribute('disabled', 'disabled');

  let loaderBlock = newElement('div', {}, ['loader']);

  let loaderImage = newElement('img', {
    src: 'images/loader.svg', alt: ''
  }, ['loader__img']);

  loaderBlock.appendChild(loaderImage);
  form.appendChild(loaderBlock);

  let informBlock = newElement('div', {}, ['inform-block']);
  informBlock.style.opacity = '0';

  let informBlockImage = newElement('img', {
    src: 'images/quiz-end.png', alt: ''
  }, ['inform-block__img']);

  let informBlockTitle = newElement('div', {}, ['inform-block__title']);
  informBlockTitle.innerText = 'Отлично, спасибо!';

  let informBlockText = newElement('div', {}, ['inform-block__text']);
  informBlockText.innerHTML = 'Мы отправили подборку вам на почту.<br>Если подборка не приходит — проверьте спам, возможно, она попала туда.';

  informBlock.append(informBlockImage, informBlockTitle, informBlockText);

  //Вместо ajax
  (() => new Promise(resolve => {
    setTimeout(() => {
      form.style.opacity = '0';
      resolve();
    }, 4000);
  }).then(() => {
      setTimeout(() => {
        form.remove();
        quiz.appendChild(informBlock);
        informBlock.style.opacity = '1';
      }, 300);
  }))();

}


