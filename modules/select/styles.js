import styled, { css } from 'react-emotion';

const SelectWrapper = styled('div')`
  position: relative;
`;

const Selection = css`
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2px;
  display: flex;
  align-items: center;

  i {
    flex-grow: 1;
    text-align: right;
  }
`;

const Options = styled.div(css`
  position: absolute;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  z-index: 99;
  background: #fff;
  transition: all 2s ease-out;
  max-height: 25rem;
  overflow-y: auto;
`);

const optionStyle = (selected, disabled) => css`
  padding: 10px 16px;
  cursor: pointer;
  outline: none;

  :hover,
  :focus {
    background: #0055a6;
    color: white;
  }

  background: ${selected && 'rgba(2, 85, 204, 0.2)'};
  background: ${disabled && '#f6f6f6 !important'};
  color: ${disabled && '#333333 !important'};
  cursor: ${disabled && 'not-allowed'};
`;

const Option = styled('div')``;

export { SelectWrapper, Selection, Options, Option, optionStyle };
