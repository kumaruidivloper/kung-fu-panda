import { css } from 'react-emotion';

const mobileContainer = css`
    @media (max-width:576px) {
        margin-top: 72px;
        margin-bottom: 72px;
    }
`;

const cancelOrderButton = css`
    height: 3.75rem;
    width: 25rem;
`;

export {
    mobileContainer,
    cancelOrderButton
};
