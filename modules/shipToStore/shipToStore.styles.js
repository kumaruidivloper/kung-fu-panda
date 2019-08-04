import { css } from 'react-emotion';

export const cardStyles = css`
  width: 3.125rem;
  height: 3.125rem;
  border: solid 1px #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  margin-bottom: 1rem;
`;

export const imageStyles = css`
  max-width: 100%;
  max-height: 100%;
`;

export const listStyle = css`
  ul {
    list-style-type: none;
    padding-left: 0.5rem;
  }
`;

export const pointerStyle = css`
  cursor: pointer;
  &: hover {
    color: #0056b3;
  }
`;

export const errorWrapper = css`
  border-radius: 4px;
  border: solid 1px #e30300;
  background-color: rgba(224, 0, 0, 0.03);
`;

export const pickupInstruction = css`
  cursor: pointer;
  &: hover {
    color: #0055a6;
    .storeLink {
      text-decoration: underline;
    }
  }
`;

export const changeLocation = css`
  color: #0055a6;
  &: hover {
    text-decoration: underline;
  }
`;

export const checkboxWrapper = css`
  input[type='checkbox'] {
    border: none;
  }
`;

export const checkboxWrapperFontSize16 = css`
  font-size: 1rem;
`;

export const iconColor = css`
  color: #0055a6;
`;

export const submitButton = css`
  width: 100%;
  @media (min-width: 768px) {
    width: auto;
  }
`;
