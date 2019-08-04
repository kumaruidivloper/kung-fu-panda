/* eslint-disable linebreak-style */
import styled, { css } from 'react-emotion';

export const WrapperDiv = styled('div')`
  background-color: #f4f4f4;
  padding: 4% 0px;
  height:250px;
`;

export const myLabel = css`
  font-size: 1.5rem;
  padding-left:15%;
`;

export const btn = css`
  line-height: 1rem;
  min-height: 3.1rem;
  margin-top: 6px;
`;

export const disabled = css`
background: grey;
background-color: none;
`;


export const errorRedColor = css`
  color: #c00000;
`;

export const modalHeader = css`
margin-top: 40px;
font-size; 23px;
`;

export const modalClosePart = css`
height: 22px;
width: 22px;
background: #fff; 
border: none; 
cursor: pointer; 
padding: 0; 
font-size: 19px; 
color: #585858; 
float: right;
margin: 20px;
`;

export const stepsPart = css`
background: none;
font-size: 14px;
border: 1px solid lightgrey;
border-radius: 5px;
padding: 4px 10px;
float:left;
line-height: 10px;
`;

export const stepsPartActive = css`
background: #0055aa;
font-size: 14px;
border-radius: 5px;
padding: 4px 11px;
border: 0;
float:left;
color: #fff;
line-height: 10px;
`;

export const lineBetween = css`
width: 40px;
margin: 14px 10px;
height: 1px;
background: lightgrey;
`;

export const stepTitle = css`
margin-top: 25px;
`;	

export const openAccount = css`
border: 1px solid lightgrey;
height: 150px;
overflow-y: scroll;
margin: 20px 0;
> p {
font-size: 12px;
padding: 10px;
}
`;

export const modalContentContainer = css`
clear: both;
`;

export const labelStyle = css`
  width: 100%;
  font-weight: bold;
  line-height: 1.43;
`;

export const errorStyles = css`
  color: red;
`;

export const cancelPart = css`
background: none;
border: 0;
color: blue;
line-height: 47px;
margin-right: 16px;
display: inline-block;
float: left;
`;

export const continueBut = css`
float: right;
`;

export const buttonWrapper = css`
float: right;
margin-bottom: 20px;
`;

export const isMobileColumn = css`
@media only screen and (max-width:768px){
position: relative;
width: 50%;
min-height: 1px;
padding-right: 16px;
padding-left: 16px;
}
`;

export const isMobileTextBox = css`
@media only screen and (max-width:768px){
width: 100%;
}
`;

export const mobilePaddingTextBox = css`
@media only screen and (max-width:768px){
padding: 0 !important;
}
`;

export const mobileModal = css`
@media only screen and (max-width:768px){
width: 95%;
margin-top: 10px;
}
`;

export const mobileFont = css`
> h5 { @media only screen and (max-width:768px){
font-size: 25px;
}
}
`;

export const stateDropdown = css`
  ul#customDropdownList li:first-child {
    display: block;
  }
`;
