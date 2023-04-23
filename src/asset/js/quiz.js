function Quiz(selector, properties) {

  let quizBlock = document.querySelector(selector),
    stepsArray = properties.steps,
    finishArray = properties.finishStep,
    stepActive = 0,
    valuesArray = {},
    valuesFinish = {},
    controlStepArray = [],
    controlFinishArray = [];

  if (!quizBlock || !stepsArray || !stepsArray.length) return;

  const stepReturn = (index) => {
    controlStepArray = [];

    const controlStep = (element) => valuesArray[element];

    const anotherStep = (sign) => {
      let futureStep = (sign === 'prev') ? stepActive - 1 : stepActive + 1;
      if (stepsArray[futureStep]) {
        divForm.style.opacity = '0';
        setTimeout(() => {
          divForm.remove();
          stepActive = futureStep;
          stepReturn(stepActive);
        }, 300);
      }
    };

    const radioReturn = (name, values) => {

      let divRadio = document.createElement('div');
      divRadio.classList.add('quiz-radio');

      if (values.length > 3) divRadio.classList.add('quiz-radio_two-columns');

      for (let i = 0; i < values.length; i++) {
        let divRadioItem = document.createElement('div'),
          inputRadio = document.createElement('input'),
          labelRadio = document.createElement('label');

        divRadioItem.classList.add('quiz-radio__item');

        inputRadio.setAttribute('type', 'radio');
        inputRadio.setAttribute('name', name);
        inputRadio.setAttribute('value', values[i]);
        inputRadio.setAttribute('id', name + '-' + i);
        inputRadio.classList.add('quiz-radio__input');

        if (valuesArray[name] === values[i]) inputRadio.checked = true;

        inputRadio.addEventListener('change', () => {
          valuesArray[name] = values[i];
          if (controlStepArray.every(controlStep) && buttonNext) {
            buttonNext.removeAttribute('disabled');
            if (controlStepArray.length === 1) anotherStep();
          }
        });

        labelRadio.classList.add('quiz-radio__label');
        labelRadio.setAttribute('for', name + '-' + i);
        labelRadio.innerText = values[i];

        divRadioItem.appendChild(inputRadio);
        divRadioItem.appendChild(labelRadio);
        divRadio.appendChild(divRadioItem);
      }

      return divRadio;
    };

    const selectReturn = (name, labelText, values) => {

      let divSelect = document.createElement('div');
      divSelect.classList.add('quiz-select');

      let labelBlock = document.createElement('label');
      labelBlock.setAttribute('for', name);
      labelBlock.classList.add('quiz-select__label');
      labelBlock.innerText = labelText;

      let select = document.createElement('select');
      select.classList.add('quiz-select__select');
      select.setAttribute('name', name);
      select.setAttribute('id', name);

      for (let i = 0; i < values.length; i++) {
        let option = document.createElement('option');
        option.value = values[i];
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

      divSelect.appendChild(labelBlock);
      divSelect.appendChild(select);

      return divSelect;
    };

    const finishFormReturn = () => {
      controlFinishArray = [];

      const submit = document.createElement('button');
      const controlFinish = (element) => valuesFinish[element];

      for (let i = 0; i < finishArray.length; i++) {
        if (finishArray[i].impotent) controlFinishArray.push(finishArray[i].name);
      }

      const valuesQuiz = Object.values(valuesArray);

      let hidden = document.createElement('input');
      hidden.setAttribute('type', 'hidden');
      hidden.setAttribute('name', 'answers');
      hidden.setAttribute('value', JSON.stringify(valuesQuiz));
      quizBlock.appendChild(hidden);

      for (let i = 0; i < finishArray.length; i++) {
        if (finishArray[i].object === 'input') {

          let endFormDiv = document.createElement('div'),
            endFormInput = document.createElement('input'),
            endFormLabel = document.createElement('label');

          endFormDiv.classList.add('quiz-input');

          endFormInput.setAttribute('type', finishArray[i].type);
          endFormInput.setAttribute('name', finishArray[i].name);
          endFormInput.setAttribute('id', finishArray[i].name);
          endFormInput.classList.add('quiz-input__input');

          endFormLabel.setAttribute('for', finishArray[i].name);
          endFormLabel.classList.add('quiz-input__label');
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

            if (controlFinishArray.every(controlFinish)) {
              submit.removeAttribute('disabled');
            } else {
              submit.setAttribute('disabled', 'disabled');
            }
          });

          endFormDiv.appendChild(endFormInput);
          endFormDiv.appendChild(endFormLabel);
          divElements.appendChild(endFormDiv);

        } else if (finishArray[i].object === 'submit') {

          submit.setAttribute('type', 'submit');
          submit.setAttribute('name', finishArray[i].name);
          submit.setAttribute('title', finishArray[i].text);
          submit.classList.add('quiz-button', 'quiz-button_submit');
          submit.innerText = finishArray[i].text;
          submit.setAttribute('disabled', 'disabled');

          divButtons.appendChild(submit);

        } else if (finishArray[i].object === 'agreed') {

          let agreed = document.createElement('div');
          agreed.classList.add('quiz-agreed');
          agreed.innerHTML = finishArray[i].text;

          divFooter.appendChild(agreed);

        }
      }

    };

    let stepArray = stepsArray[index],
      stepTitle = stepArray.title,
      stepText = 'Шаг ' + (index + 1) + '/' + stepsArray.length,
      stepElements = stepArray.elements,

      divForm = document.createElement('div'),
      divHeader = document.createElement('div'),
      divTitle = document.createElement('div'),
      divStep = document.createElement('div'),
      divBody = document.createElement('div'),
      divElements = document.createElement('div'),
      divFooter = document.createElement('div'),
      divButtons = document.createElement('div'),
      buttonPrev,
      buttonNext;

    Array.from(stepArray.elements).forEach((elem) => {
      controlStepArray.push(elem.name);
    });

    divForm.classList.add('quiz-form');
    divForm.style.opacity = '0';
    divHeader.classList.add('quiz-form__header');
    divTitle.classList.add('quiz-form__title');
    divTitle.innerText = stepTitle;
    divStep.classList.add('quiz-form__step');
    divStep.innerText = stepText;
    divBody.classList.add('quiz-form__body');
    divElements.classList.add('quiz-form__elements');
    divFooter.classList.add('quiz-form__footer');
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