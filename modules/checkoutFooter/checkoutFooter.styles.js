import { css } from 'react-emotion';

const footer = css`
    height: 16.5625rem;
    background-color: #585858;
    padding: 44px 0 53px 0;
    color: white;
    @media screen and (max-width: 576px){
        padding: 20px 0 51px 0;
        height: 27.5625rem;
    }
    a{
        color:white;
    }
    a:hover{
        color: white;
    }
    div{
        span{
            margin-right: .75rem;
        }
    }
`;

const contactWrapper = css`
    @media screen and (max-width: 576px) {
        padding-bottom: 1.6875rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid;
        border-color: rgba(255, 255, 255, .5);
    }
`;
const cardAcceptedStyle = css`
    height: 36px;
    width: 64px;
    background-color: white;
    color: black;
    margin-bottom: .75rem;
    border-radius: 4px;
`;

const spanStyling = css`
    margin: 0 .25rem 0 .25rem;
`;

const hrStyle = css`
    border: 0;
    width: 1.875rem;
    height: 2px;
    text-align: left;
    background-color: white;
    margin: 1.2rem 0 0.9375rem;

`;
const rowWrapper = css`
    padding-bottom: 1.6875rem;
    margin-bottom: 1.125rem;
    border-bottom: 1px solid;
    border-color: rgba(255, 255, 255, .5);
    @media screen and (max-width: 576px) {
        padding-bottom: .25rem;
    }
`;

const contactStyles = css`
    flex-direction: row;
    @media screen and (max-width: 576px){
        flex-direction: column; 
    }
`;

const phoneNumberStyles = css`
    @media screen and (max-width: 576px){
        padding-top: 1.3125rem;
    }
`;

const phoneNumberLinkStyles = css`
    @media screen and (min-width: 576px){
        pointer-events: none;
        cursor: default;
    } 
`;
export { footer, cardAcceptedStyle, spanStyling, hrStyle, contactStyles, phoneNumberStyles, contactWrapper, rowWrapper, phoneNumberLinkStyles };
