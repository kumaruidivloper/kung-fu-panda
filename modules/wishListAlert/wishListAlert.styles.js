import { css } from 'react-emotion';

const wishListAlertRed = css`
  border-radius: 0.25rem;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
  > div > span {
    color: #e30300;
  }
`;

const wishListAlertSuccess = css`
  border-radius: 0.25rem;
  background-color: rgba(30, 170, 30, 0.03);
  border: solid 1px #1eaa1e;
`;

const undoBtn = css`
  color: #0055a6;
`;

const Btn = css`
  border: none;
  box-shadow: none;
  background: none;
  :active {
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
  }
  :focus {
    background-color: none;
  }
`;

const closeBtn = css`
  float: right;
  border: none;
  box-shadow: none;
  background: none;
  color: #e30300;
  :active {
    border: none;
    background-color: none;
  }
  :hover {
    background-color: none;
  }
  :focus {
    background-color: none;
  }
`;

const greenCloseBtn = css`
  ${closeBtn} color: #00bb11;
`;

const redColor = css`
  color: #ee0000;
`;

export { wishListAlertRed, undoBtn, closeBtn, greenCloseBtn, Btn, wishListAlertSuccess, redColor };
