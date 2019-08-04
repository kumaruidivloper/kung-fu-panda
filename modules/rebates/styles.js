import { css } from 'react-emotion';

const cardStyle = css`
    font-family: Mallory;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: center;
    margin-bottom: 30px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
    padding-bottom: 0.01rem;
`;

const cardHead = css`
    height: 60px;
    background-color: #0055a6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.1), 0 2px 6px 0 rgba(0, 0, 0, 0.04), 0 1px 4px 0 rgba(0, 0, 0, 0.08), 0 3px 8px 0 rgba(0, 0, 0, 0.1);
`;

const headerText = css`
    height: 22px;
    font-size: 16px;
    color: #ffffff;
    line-height: 1.38;
    margin: 0;
`;

const cardText = css`
    font-size: 14px;
    line-height: 1.43;
    color: #0055a6;
    padding: 24px 0;
`;

const buttonStyle = css`
    width: 200px;
    height: 50px;
    margin: 0 auto;
    position: relative;
    display: block;
    background: #fff;
    border: solid 3px #0055a6;
    color: #0055a6;
    border-radius: 35px;
    padding: 12px 0;
    text-align: center;
    text-decoration: none;
    &:hover {
        background: #0055a6;
        color: #fff;
    }
`;

const expStyle = css`
    text-transform: lowercase;
    font-size: 16px;
    color: #333333;
    text-align: center;
    padding: 15px;
`;

export {
    cardStyle,
    cardHead,
    headerText,
    cardText,
    buttonStyle,
    expStyle
};
