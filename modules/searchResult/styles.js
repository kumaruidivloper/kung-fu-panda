import { css } from 'emotion';
import media from '../../utils/media';
export const predictiveResultConatiner = css`
  background-color: rgba(5, 86, 164, 0.05);
  min-height: 62px;
  font-size: 1rem;
  font-family: Mallory-Book;
  letter-spacing: normal;
  padding-left: 0;
  color: #333333;
  ${media.sm`
    min-height: 86px;
    font-size: 0.875rem;
    line-height: 1.25;
  `};
`;
export const predictiveText = css`
  color: #0055a6;
  cursor: pointer;
`;
export const searchResultTitle = css`
  height: auto;
  font-family: Mallory-Book;
  font-size: 20px;
  line-height: 1.2;
  color: #333333;
  overflow-wrap: break-word;
  ${media.sm`
    font-size: 1rem;
    line-height: 1.25;
  `};
`;
export const searchResult = css`
  width: 100vw;
  margin-left: 140px;
  @media (max-width: 767px) {
    margin-left: 0px;
  }
`;
export const searchString = css`
  display: block;
  word-wrap: break-word;
`;

export const DYMText = css`
  font-family: Mallory-Bold;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #333333;
  letter-spacing: 0;
  font-weight: bold;

  @media (min-width: 768px) {
    font-size: 1.25rem;
    line-height: 1.5rem;
  }
`;
