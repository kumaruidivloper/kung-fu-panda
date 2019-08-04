import styled, { css } from 'react-emotion';

export const style = {
  StyledDiv: styled('button')`
    min-height: 62px;
    background: #fff;
    color: #4c4c4c;
    cursor: pointer;
    border: 0px;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    padding: 1.5rem 0.72rem;
    justify-content: space-between;
    background-color: #ffffff;
  `,
  AccordianWrapStyle: css`
    positioin: relative;
    display: flex;
    flex-direction: column;

    :first-child {
      border-top: 1px solid #e6e6e6;
    }
  `,
  hidden: css`
    display: none;
  `,
  AccordianContentStyle: css`
    background: #fff;
    min-height: 62px;
    padding: 1.5rem 1rem;
  `
};
