import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from '@academysports/fusion-components/dist/Link';
import Button from '@academysports/fusion-components/dist/Button';
import { cx } from 'react-emotion';
import { getLinkAsButtonStyleForModal } from '../../../apps/productDetailsGeneric/emo/linkAsButton';
import * as emo from './errorModalContent.emotion';

const CONTINUE_SHOPPING = 'CONTINUE SHOPPING';
const VIEW_PRODUCT_DETAILS = 'VIEW PRODUCT DETAILS';
const QUICK_VIEW_ERROR_TITLE = 'QUICK_VIEW_ERROR_TITLE';
const QUICK_VIEW_ERROR_MESSAGE = 'QUICK_VIEW_ERROR_MESSAGE';

const labels = labels || {};
const labelsDefaults = {};
labelsDefaults[QUICK_VIEW_ERROR_TITLE] = 'SWING AND A MISS.';
labelsDefaults[QUICK_VIEW_ERROR_MESSAGE] =
  "We're sorry something went wrong with the quickview for this item. But don't worry, it's still available - to see more information please visit the product details page.";

const linkAsButtonPrimaryStyle = getLinkAsButtonStyleForModal({ btntype: 'primary', isLink: true });

const errorModalContent = (props = {}) => (
  <Fragment>
    <div className="container m-6">
      <div className="row">
        <h4 className="col-12 mb-2 text-center">{labels[QUICK_VIEW_ERROR_TITLE] || labelsDefaults[QUICK_VIEW_ERROR_TITLE]}</h4>
        <div className="col-12 text-center subtitle-20 mb-3">{labels[QUICK_VIEW_ERROR_MESSAGE] || labelsDefaults[QUICK_VIEW_ERROR_MESSAGE]}</div>
      </div>
      <div className="row">
        <div className="col-6 text-right">
          <Button
            onClick={props.onClickContinueShopping}
            className={emo.button}
            size="S"
            btntype="secondary"
            auid="quick_view_error_modal_continue_shopping"
          >
            {labels.CONTINUE_SHOPPING || CONTINUE_SHOPPING}
          </Button>
        </div>
        <div className="col-6 text-left">
          <Link href={props.seoURL} className={cx(linkAsButtonPrimaryStyle, emo.button)} auid="quick_view_error_modal_view_product_details">
            {labels.VIEW_PRODUCT_DETAILS || VIEW_PRODUCT_DETAILS}
          </Link>
        </div>
      </div>
    </div>
  </Fragment>
);

errorModalContent.propTypes = {
  onClickContinueShopping: PropTypes.func,
  seoURL: PropTypes.string
};

export default errorModalContent;
