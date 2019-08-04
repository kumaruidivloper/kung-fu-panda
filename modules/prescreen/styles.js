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
