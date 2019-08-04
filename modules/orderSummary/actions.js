import { ZIP_VALIDATION_SUCCESS, ZIP_VALIDATION_FAILED, ZIP_VALIDATION } from './constants';

export const zipcodeValidation = data => ({
  type: ZIP_VALIDATION,
  data
});

export const zipcodeSuccess = data => ({
  type: ZIP_VALIDATION_SUCCESS,
  data
});

export const zipcodeFailure = data => ({
  type: ZIP_VALIDATION_FAILED,
  data
});
