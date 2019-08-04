import styled, { css } from 'react-emotion';

export const Wrapper = css`
  min-width: 236px;
  @media (max-width: 767px) {
    max-width: 98vh;
  }
`;

const removeButtonUserAgentStyleSheets = css`
  border: 0;
  padding: 0;
  background: none;
`;

export const Close = styled('button')`
${removeButtonUserAgentStyleSheets};
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 12px;
  color: #585858;
  line-height: 16px: 
  text-align: center;
  cursor: pointer;
`;
