import { css } from 'react-emotion';

export const emptyContainer = css`
 border-radius: 0.25rem;
 background-color: #ffffff;
 box-shadow: 0 0.0625rem 0.1875rem 0 rgba(0, 0, 0, 0.1), 0 0.125rem 0.125rem 0 rgba(0, 0, 0, 0.04), 0 0 0.125rem 0 rgba(0, 0, 0, 0.1);
}
`;
export const backButton = css`
  font-size: 0.75rem;
  color: #0055a6;
  border: none;
  width: auto;
  background: none;
  padding-left: 0;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;
