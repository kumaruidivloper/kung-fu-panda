import { scrollIntoView } from './scroll';

/**
 *
 * @param {object} errors form error fields
 * @param {array} forms Nodelist
 */
export const getFormFields = (errors, forms, offset) => {
  const formsArray = Array.from(forms);
  const allFormsFields = [];

  formsArray.forEach(formelement => {
    const allFormFields = Array.from(formelement.querySelectorAll('input'));
    allFormFields.forEach(inputElement => {
      allFormsFields.push(inputElement.name);
    });
  });
  scrollToFirstErrorElement(errors, allFormsFields, offset);
};

/**
 *
 * @param {object} errors form error fields
 * @param {array} allFormsFields all form input fields
 */
const scrollToFirstErrorElement = (errors, allFormsFields, offset) => {
  for (let i = 0; i < allFormsFields.length; i += 1) {
    if (errors[allFormsFields[i]] && document.getElementById(allFormsFields[i])) {
        scrollIntoView(document.getElementById(allFormsFields[i]), { offset });
        break;
    }
  }
};
