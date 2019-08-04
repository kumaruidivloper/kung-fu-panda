import { validateShippingForm } from './DefaultShippingForm.validate.shipping';

const validate = (values, props) => {
  const errors = {};
  const shippingErrors = validateShippingForm(values, props);

  return { ...errors, ...shippingErrors };
};

export default validate;
