import { css } from 'react-emotion';
import PropTypes from 'prop-types';
import Responsive from 'react-responsive';
import React, { Fragment } from 'react';
import SpecItem from './specItem';

// const detailsStyle = css`
//   margin-bottom: 1.5rem;
// `;

const specs = css`
  display: flex;
`;

const marginStyle = css`
  margin-top: 1.5rem;
`;

const specItem = css`
  width: 33%;
  box-sizing: border-box;
`;

const accordianView = css`
  padding: 0 1rem;
`;

class DetailsAndSpecs extends React.PureComponent {
  getTitle = key => {
    const { labels = {} } = this.props;
    return labels[key] || key;
  };

  handleValue(inVal) {
    const outArray = [];
    if (typeof inVal === 'string') {
      outArray.push(inVal);
      return outArray;
    } else if (typeof inVal === 'object' && !Array.isArray(inVal) && inVal !== null) {
      Object.keys(inVal).map(item => outArray.push(`${item}: ${inVal[item]}`));
      return outArray;
    } else if (Array.isArray(inVal)) {
      return inVal;
    }
    return null;
  }

  render() {
    const { description, productSpecifications: inSpec } = this.props;
    if (inSpec.length < 1) {
      if (description) {
        return (
          <div className={marginStyle}>
            <p className="mb-2" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        );
      }
      return null;
    }
    const firstSpec = inSpec[0][Object.keys(inSpec[0])];
    const firstItemList = this.handleValue(firstSpec.value);
    // }
    return (
      <Fragment>
        <Responsive minWidth={768}>
          <div>
            {description && (
              <div className={marginStyle}>
                <p className="mb-2" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
            {inSpec.length > 0 && (
              <Fragment>
                <div>
                  <SpecItem title={this.getTitle(firstSpec.key)} classes="feature" list={firstItemList} key={firstSpec.key} />
                </div>
                <div className={specs}>
                  {inSpec.slice(1, 4).map(item => {
                    const spec = item[Object.keys(item)];
                    const itemList = this.handleValue(spec.value);
                    return (
                      <div className={specItem} key={spec.key}>
                        <SpecItem title={this.getTitle(spec.key)} list={itemList} key={spec.key} />
                      </div>
                    );
                  })}
                </div>
                <div className={specs}>
                  {inSpec.slice(4).map(item => {
                    const spec = item[Object.keys(item)];
                    const itemList = this.handleValue(spec.value);
                    return (
                      <div className={specItem} key={spec.key}>
                        <SpecItem title={this.getTitle(spec.key)} list={itemList} key={spec.key} />
                      </div>
                    );
                  })}
                </div>
              </Fragment>
            )}
          </div>
        </Responsive>
        <Responsive maxWidth={767}>
          <div className={accordianView}>
            {description && (
              <div>
                <p dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
            <div>
              {inSpec.slice().map(item => {
                const spec = item[Object.keys(item)];
                const itemList = this.handleValue(spec.value);
                return <SpecItem title={this.getTitle(spec.key)} list={itemList} key={spec.key} />;
              })}
            </div>
          </div>
        </Responsive>
      </Fragment>
    );
  }
}

DetailsAndSpecs.propTypes = {
  productSpecifications: PropTypes.array.isRequired,
  description: PropTypes.string,
  labels: PropTypes.object
};

export default DetailsAndSpecs;
