import { css } from 'react-emotion';

const displayBlock = css`
  display: block;
`;

const submit = css`
  text-align: center;
`;

const clsBtn = css`
  background: none;
  border: none;
  font-size: 22px
  cursor: pointer;
  right: 16px;
  top: 16px;
  position: absolute;
`;

const proceedModal = css`
  padding: 4.68rem 6.25rem;
  .header,
  .subTitle {
    text-align: center;
    display: block;
  }
  .productInfo {
    img {
      max-height: 9.375rem;
      max-width: 100%;
    }
  }
  .section {
    border: 0.5px solid #cccccc;
  }
  .qtyInfo {
    text-align: right;
  }
  .options .option {
    position: relative;
    cursor: pointer;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    :focus {
      outline: none;
    }
  }
  .option {
    label {
      display: block;
    }
    .subSection {
      width: 90%;
      border: 0.5px solid #cccccc;
    }
    .academyicon {
      position: absolute;
      font-size: 3rem;
      color: #00bb11;
      right: 32px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }
  .options .option.active {
    border: 2px solid #0055a6;
  }
  .options .option:hover {
    border: 2px solid #0055a6;
  }
  @media screen and (max-width: 1024px) {
    .academyicon {
      right: 24px !important;
    }
    padding: 4.68rem 3rem;
    .productInfo {
      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
  @media screen and (max-width: 768px) {
    padding: 4.68rem 3rem;
  }
  @media screen and (max-width: 576px) {
    padding: 4.68rem 1rem;
    .productInfo {
      .qtyInfo {
        text-align: left;
      }
    }
    .option .subSection {
      width: 80%;
    }
    .option .academyicon {
      right: 16px;
    }
  }
`;

const overlay = css`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  z-index: 99;
`;

const modal = css`
  width: 100%;
  position: static;
  transform: none;
  margin: 0;
  background-color: #fff;
  overflow: auto;

  @media screen and (min-width: 768px) {
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    margin-top: 70px;
  }
`;

export { displayBlock, proceedModal, overlay, modal, submit, clsBtn };
