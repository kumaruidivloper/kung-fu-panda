import { css } from 'emotion';

export const header = css`
  margin-top: 35px;
  margin-bottom: 35px;
  margin-left: auto;
  margin-right: auto;
  width: 300px;
  padding: 25px;

  font-family: MalloryCond-Black;
  font-weight: bold;
  font-size: 32px;
  text-align: center;
  text-transform: uppercase;

  background-color: #005599;
  color: white;
`;

const flexContainer = css`
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-direction: normal;
  -moz-box-direction: normal;
  -webkit-box-orient: horizontal;
  -moz-box-orient: horizontal;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  -moz-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-align-content: flex-start;
  -ms-flex-line-pack: start;
  align-content: flex-start;
  -webkit-box-align: start;
  -moz-box-align: start;
  -webkit-align-items: flex-start;
  -ms-flex-align: start;
  align-items: flex-start;
`;

export const container = css`
  ${flexContainer};
  width: 90vw;
  margin: auto;
  margin-bottom: 150px;
`;

const flexItem = css`
  -webkit-box-ordinal-group: 1;
  -moz-box-ordinal-group: 1;
  -webkit-order: 0;
  -ms-flex-order: 0;
  order: 0;
  -webkit-box-flex: 0;
  -moz-box-flex: 0;
  -webkit-flex: 0 0 auto;
  -ms-flex: 0 0 auto;
  flex: 0 0 auto;
  -webkit-align-self: auto;
  -ms-flex-item-align: auto;
  align-self: auto;
`;

export const item = css`
  ${flexItem};
  position: relative;
  margin: 10px;
  border-radius: 3px;
  min-width: 100px;
  min-height: 100px;
  background-color: #f6f6f6;

  &:hover {
    background-color: rgba(176, 224, 230, 0.3);
  }
`;

export const renderedIcon = css`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const selector = css`
  font-family: Helvetica, sans-serif;
  font-size: 11px;
  position: absolute;
  min-width: 100px;
  text-align: center;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
`;
