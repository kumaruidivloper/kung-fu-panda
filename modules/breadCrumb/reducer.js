import { UPDATE_BREADCRUMB, INIT_STATE } from './constants';

const initialState = {
    previousLink: '',
    previousIndex: 0,
    breadCrumb: [],
    name: ''
};

function breadCrumb(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BREADCRUMB:
      return { ...state, ...action.payload };
    case INIT_STATE:
      return state;
    default:
      return state;
  }
}

export default breadCrumb;
