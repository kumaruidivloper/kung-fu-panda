import { css } from 'react-emotion';

const acceptedPaymentDisplay = css`
    .cards {
        height: 26px;
        width: 47px;
        margin-right: 8.5px;
    }
    @media screen and (max-width: 576px) {
        padding: 0px;
        margin: 0px;
        max-width: 100%;
    }
`;

const rowDiv = css`
    background-color: #ffffff;
    border-top: 0.0625rem solid #cccccc;
`;

const verticalDiv = css`
    border-right: 0.0625rem solid #cccccc;
    &:last-child {
        border-right: none;
    }
    @media screen and (max-width: 576px) {
        border-right: none;
    }
`;

const iconLock = css`
    width: 1.25rem;
    height: 1.375rem;
    color: #0055a6;
    
    @media screen and (max-width: 576px) {
        display:none;
    }
    
`;

const freeInStoreReturns = css`
    text-align: center;
    @media screen and (max-width: 576px) {
        text-align: left;
    }
`;

const policyLinks = css`
    span > span {
        margin: 0 0.25rem;
    }
`;

export { rowDiv, verticalDiv, iconLock, freeInStoreReturns, policyLinks, acceptedPaymentDisplay };
