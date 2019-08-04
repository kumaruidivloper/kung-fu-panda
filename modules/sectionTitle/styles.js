import { css } from 'emotion';
import media from '../../utils/media';

export const sectionTitle = css`
    & > h1,h2 {
        word-wrap: break-word;
    }
    & > .o-copy__20bold {
        ${media.md`
        font-size: 1rem;
        line-height: 1.25rem;
        `}
    }
`;
