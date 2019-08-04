import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React from 'react';
import ReactDOM from 'react-dom';
import './iconReference.component.scss';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import * as styles from './css';

const readTextFile = file => {
  let result = '';
  const rawFile = new XMLHttpRequest();
  rawFile.open('GET', file, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        result = rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return result;
};

const findIconClassNames = cssText => {
  const matches = cssText.match(/\.icon(-[\d\w]+)+(?=[\s\,\{\:])/gi); // eslint-disable-line no-useless-escape
  const matchesArr = Object.keys(matches)
    .map(key => matches[key])
    .join('')
    .split('.');
  return matchesArr.filter((item, idx) => item && matchesArr.indexOf(item) === idx && item.trim().length !== 0);
};

class IconReference extends React.PureComponent {
  renderIconExamples(iconSelectors = []) {
    return iconSelectors.map(iconSelector => (
      <div key={iconSelector} className={styles.item}>
        <div className={styles.renderedIcon}>
          <span className={`academyicon ${iconSelector} academyicon--24px`} />
        </div>
        <div className={styles.selector}>{iconSelector}</div>
      </div>
    ));
  }

  render() {
    findIconClassNames(readTextFile('/assets/styles/vendor.css'));
    return (
      <div className="iconReference">
        <h3 className={styles.header}>ASO Icons</h3>
        <div className={styles.container}>{this.renderIconExamples(findIconClassNames(readTextFile('/assets/styles/vendor.css')))}</div>
      </div>
    );
  }
}

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<IconReference {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default IconReference;
