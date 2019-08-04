import { validatePaymentForm } from './DefaultPaymentForm.validate.creditcard';
import { validateBillingForm } from './DefaultPayementForm.validate.billing';
import { validateEmail } from './DefaultPaymentForm.validate.email';

const validate = (values, props) => {
  const errors = {};
  const isSameAsShipping = !!values.sameAsShipping;
  const paymentFormErrors = validatePaymentForm(values, props);
  const billingErrors = !isSameAsShipping ? validateBillingForm(values, props) : {};
  const phoneEmailErrors = validateEmail(values, props);

  return { ...errors, ...billingErrors, ...paymentFormErrors, ...phoneEmailErrors };
};

export default validate;
