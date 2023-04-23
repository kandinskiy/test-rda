function Quiz(selector, properties) {

  let quizBlock = document.querySelector(selector),
    stepsArray = properties.steps;

  if (!quizBlock || !stepsArray || !stepsArray.length) return;

  const newElement = (type, attributes = {}, classes = []) => {
    let element = document.createElement(type);
    for (let key in attributes) { if (attributes.hasOwnProperty(key)) { element.setAttribute(key, attributes[key]); } }
    if (classes && classes.length) { for (let value of classes) { element.classList.add(value); } }
    return element;
  };

  const editElement = (element, attributes = {}, classes = []) => {
    if (!element || typeof element === 'undefined') return;
    for (let key in attributes) { if (attributes.hasOwnProperty(key)) { element.setAttribute(key, attributes[key]); } }
    if (classes && classes.length) { for (let value of classes) { element.classList.add(value); } }
  };

  let finishArray = properties.finishStep,
    stepActive = 0,
    valuesArray = {},
    valuesFinish = {},
    controlStepArray = [],
    controlFinishArray = [];

  const stepReturn = (index) => {

    const controlStep = (element) => valuesArray[element];

    const anotherStep = (sign) => {
      divForm.style.pointerEvents = "none";
      let futureStep = (sign === 'prev') ? stepActive - 1 : stepActive + 1;
      if (stepsArray[futureStep]) {
        divForm.style.opacity = '0';
        setTimeout(() => {
          divForm.remove();
          stepActive = futureStep;
          stepReturn(stepActive);
          divForm.style.pointerEvents = "auto";
        }, 300);
      }
    };

    const radioReturn = (name, values) => {

      let divRadio = newElement('div', {}, ['quiz-radio']);
      if (values.length > 3) divRadio.classList.add('quiz-radio_two-columns');

      for (let i = 0; i < values.length; i++) {
        let divRadioItem = document.createElement('div');
        divRadioItem.classList.add('quiz-radio__item');

        let inputRadio = newElement('input', {
          type: 'radio', name: name, value: values[i], id: name + '-' + i
        }, [
          'quiz-radio__input'
        ]);

        if (valuesArray[name] === values[i]) inputRadio.checked = true;

        let labelRadio = newElement('label', {
          'for': name + '-' + i
        }, ['quiz-radio__label']);
        labelRadio.innerText = values[i];

        inputRadio.addEventListener('change', () => {
          valuesArray[name] = values[i];
          if (controlStepArray.every(controlStep) && buttonNext) {
            buttonNext.removeAttribute('disabled');
            if (controlStepArray.length === 1) anotherStep();
          }
        });

        divRadioItem.append(inputRadio, labelRadio);
        divRadio.appendChild(divRadioItem);
      }

      return divRadio;
    };

    const selectReturn = (name, labelText, values) => {

      let divSelect = newElement('div', {}, ['quiz-select']);

      let labelBlock = newElement('label', {
        for: name,
      }, ['quiz-select__label']);
      labelBlock.innerText = labelText;

      let select = newElement('select', {
        name: name, id: name
      }, ['quiz-select__select']);

      for (let i = 0; i < values.length; i++) {
        let option = newElement('option', {
          value: values[i]
        });
        option.innerText = values[i];
        if (values[i] === valuesArray[name]) {
          option.setAttribute('selected', 'selected');
          if (values[i]) select.classList.add('quiz-select__select_active');
        }
        select.appendChild(option);
      }

      select.addEventListener('change', () => {
        valuesArray[name] = select.value;
        if (controlStepArray.every(controlStep) && buttonNext) {
          select.classList.add('quiz-select__select_active');
          buttonNext.removeAttribute('disabled');
        } else {
          select.classList.remove('quiz-select__select_active');
          buttonNext.setAttribute('disabled', 'disabled');
        }
      });

      divSelect.append(labelBlock, select);
      return divSelect;
    };

    const finishFormReturn = () => {
      controlFinishArray = [];

      let submit = document.createElement('button');
      let controlFinish = (element) => valuesFinish[element];

      for (let i = 0; i < finishArray.length; i++) {
        if (finishArray[i].impotent) controlFinishArray.push(finishArray[i].name);
      }

      let valuesQuiz = Object.values(valuesArray);

      let hidden = newElement('input', {
        type: 'hidden', name: 'answers', value: JSON.stringify(valuesQuiz)
      });
      quizBlock.appendChild(hidden);

      for (let i = 0; i < finishArray.length; i++) {
        if (finishArray[i].object === 'input') {

          let endFormDiv = newElement('div', {}, ['quiz-input']);

          let endFormInput = newElement('input', {
            type: finishArray[i].type, name: finishArray[i].name, id: finishArray[i].name
          }, ['quiz-input__input']);

          let endFormLabel = newElement('label', {
            for: finishArray[i].name
          }, ['quiz-input__label']);
          endFormLabel.innerText = finishArray[i].label;

          endFormInput.addEventListener('input', () => {
            if (endFormInput.value.length > 0) {
              endFormInput.classList.add('quiz-input__input_active');
              endFormLabel.classList.add('quiz-input__label_active');
              valuesFinish[finishArray[i].name] = endFormInput.value;
            } else {
              endFormInput.classList.remove('quiz-input__input_active');
              endFormLabel.classList.remove('quiz-input__label_active');
              valuesFinish[finishArray[i].name] = '';
            }
            (controlFinishArray.every(controlFinish)) ? submit.removeAttribute('disabled') :
              submit.setAttribute('disabled', 'disabled');
          });

          endFormDiv.appendChild(endFormInput);
          endFormDiv.appendChild(endFormLabel);
          divElements.appendChild(endFormDiv);

        } else if (finishArray[i].object === 'submit') {

          editElement(submit, {
            type: 'submit', name: finishArray[i].name, title: finishArray[i].text, disabled: 'disabled'
          }, ['quiz-button', 'quiz-button_submit']);
          submit.innerText = finishArray[i].text;

          divButtons.appendChild(submit);

        } else if (finishArray[i].object === 'agreed') {

          let agreed = newElement('div', {}, ['quiz-agreed']);
          agreed.innerHTML = finishArray[i].text;

          divFooter.appendChild(agreed);

        }
      }

    };

    controlStepArray = [];

    let stepArray = stepsArray[index],
      stepTitle = stepArray.title,
      stepText = 'Шаг ' + (index + 1) + '/' + stepsArray.length,
      stepElements = stepArray.elements,
      buttonPrev,
      buttonNext;

    Array.from(stepArray.elements).forEach((elem) => {
      controlStepArray.push(elem.name);
    });

    let divForm = document.createElement('div');
    divForm.classList.add('quiz-form');
    divForm.style.opacity = '0';

    let divHeader = document.createElement('div');
    divHeader.classList.add('quiz-form__header');

    let divTitle = document.createElement('div');
    divTitle.classList.add('quiz-form__title');
    divTitle.innerText = stepTitle;

    let divStep = document.createElement('div');
    divStep.classList.add('quiz-form__step');
    divStep.innerText = stepText;

    let divBody = document.createElement('div');
    divBody.classList.add('quiz-form__body');

    let divElements = document.createElement('div');
    divElements.classList.add('quiz-form__elements');

    let divFooter = document.createElement('div');
    divFooter.classList.add('quiz-form__footer');

    let divButtons = document.createElement('div');
    divButtons.classList.add('quiz-form__buttons');

    if (typeof stepElements === 'object' && stepElements.length) {
      for (let i = 0; i < stepElements.length; i++) {
        let result;
        switch(true) {
          case (stepElements[i].type === 'radio'):
            result = radioReturn(stepElements[i].name, stepElements[i].values);
            break;
          case (stepElements[i].type === 'select'):
            result = selectReturn(stepElements[i].name, stepElements[i].label, stepElements[i].values);
            break;
          case (stepElements[i].type === 'finishStep'):
            result = finishFormReturn();
        }
        if (result && stepElements[i].type !== 'finishStep') divElements.appendChild(result);
      }
    }

    if (stepsArray[stepActive + 1] && stepActive + 1 < stepsArray.length) {
      buttonNext = document.createElement('button');
      if (!controlStepArray.every(controlStep)) buttonNext.setAttribute('disabled', 'disabled');
      buttonNext.classList.add('quiz-button', 'quiz-button_next');
      buttonNext.innerText = 'Далее';
      buttonNext.addEventListener('click', (e) => {
        e.preventDefault();
        anotherStep();
      });
    }

    if (stepActive > 0 && stepActive + 1 < stepsArray.length) {
      buttonPrev = document.createElement('button');
      buttonPrev.classList.add('quiz-button', 'quiz-button_not-important', 'quiz-button_prev');
      buttonPrev.innerText = 'Назад';

      buttonPrev.addEventListener('click', (e) => {
        e.preventDefault();
        anotherStep('prev');
      });
    }

    if (buttonPrev || buttonNext){
      if (buttonPrev) divButtons.appendChild(buttonPrev);
      if (buttonNext) divButtons.appendChild(buttonNext);
    }

    divHeader.append(divTitle, divStep);
    divBody.appendChild(divElements);

    divForm.append(divHeader, divBody);

    if (divButtons) divFooter.prepend(divButtons);
    if (divFooter) divForm.appendChild(divFooter);

    quizBlock.appendChild(divForm);

    setTimeout(() => {
      divForm.style.opacity = '1';
    }, 100);

  };

  stepReturn(stepActive);

  quizBlock.addEventListener('submit', (e) => {
    e.preventDefault();
    properties.executeFunction();
  });

}