import styled, { css } from 'react-emotion';

export const Wrapper = styled('div')`
  text-align: left;
`;

export const Title = styled('label')``;

export const input = props => css`
  width: 209px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding-left: 16px;

  @media (max-width: 767px) {
    width: 100%;
  }

  ${props.hasError ? 'border-color: #c000000' : ''};
`;

export const Error = styled('div')`
  color: #c00000;

  @media (max-width: 767px) {
    margin-top: 4px;
  }
`;

export const button = css`
  padding: 0;
  min-height: 40px;
  height: 40px;
  min-width: 137px;
  width: 137px;
  margin-left: 15px;

  @media (max-width: 767px) {
    margin-left: 0;
    width: 100%;
  }
`;
