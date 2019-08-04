import { UPDATE_SEO_BLOCK, UPDATE_FEATURED_BLOCK, INIT_STATE } from './constants';

const initialState = { textBlock: { categoryespot: { marketingText: '' } }, linkBlock: '' };

function preFooter(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEO_BLOCK:
      return Object.assign({}, state, { textBlock: action.payload });
    case UPDATE_FEATURED_BLOCK:
      return Object.assign({}, state, { linkBlock: action.payload });
    case INIT_STATE:
      return { ...state, ...initialState };
    default:
      return state;
  }
}

export default preFooter;
