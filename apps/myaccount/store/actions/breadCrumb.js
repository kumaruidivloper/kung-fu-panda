import { BREAD_CRUMB } from './../../myaccount.constants';

export function breadCrumbAction(data) {
  return {
    type: BREAD_CRUMB,
    data
  };
}
