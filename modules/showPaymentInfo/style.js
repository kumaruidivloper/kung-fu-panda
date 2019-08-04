import { css } from 'react-emotion';

export const headingBox = css`
  border-bottom: 1px solid #cccccc;
`;

export const editBtn = css`
  color:#0055a6;
`;

export const bodyDiv = css`
padding-right: 4rem;
@media (max-width: 768px) {
  padding-right: 2rem;
}
@media (max-width: 576px) {
  flex-direction: column;
  padding-right: 0;
}
`;
