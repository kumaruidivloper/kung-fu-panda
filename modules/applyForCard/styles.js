import styled, { css } from 'react-emotion';

export const WrapperDiv = styled('div')`
  background-color: #f4f4f4;
  padding: 4% 0px;
  height:auto;
`;

export const btn = css`
  line-height: 0.5rem;
  min-height: 3.1rem;
  margin-top: 6px;
`;

export const anchorLink = css`
  text-decoration: none;
  margin-left: 3%;
`;

export const align = css`
  padding: 2%;
`;


export const panel = css`
  width: 400px;
  height: 200px;
  border-radius:5px;
  background-color: #0055A6;
  webkit-transform: perspective(700px) rotateY(-45deg);
  -ms-transform: perspective(700px) rotateY(-45deg);
  transform: perspective(700px) rotateY(-45deg);
  margin-left: 25%;
  margin-top: 3rem;
`;