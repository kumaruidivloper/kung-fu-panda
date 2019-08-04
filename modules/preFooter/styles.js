import { css } from 'emotion';

const fontStyles = css`
  font-family: 'Mallory-Book', 'Helvetica Neue', sans-serif;
  letter-spacing: inherit;
  line-height: inherit;
`;
const plr0 = css`
  padding: 0;
`;

export const prefoot = css`
  font-family: 'Mallory Book', 'Helvetica Neue', sans-serif;
  font-size: 1.1rem;

  h2 {
    ${fontStyles};
  }

  h4 {
    ${fontStyles} font-size: 1.1em;
  }

  a {
    ${fontStyles} color: #333;
    margin-right: 1em;
    margin-bottom: 0.5em;
    font-size: 0.875rem;
    color: #333333;
  }

  p {
    ${fontStyles} font-size: 0.875rem;
  }

  nav {
    padding: 15px;
  }

  ul {
    padding: 0;
  }

  li {
    display: inline-block;
  }

  #seocontainer {
    ${plr0};
    a {
      margin: 0;
    }
  }
  .featuredCategories {
    ${plr0};
  }
`;
