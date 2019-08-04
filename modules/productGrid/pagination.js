import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';
import styled, { css } from 'react-emotion';
import { PAGE_SIZE, ENTER_KEYCODE, SPACE_KEYCODE } from './constants';
import media from '../../utils/media';

const clsPagination = css`
  display: inline-block;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 0.5rem;
`;

const liItem = css`
  display: inline-block;
  cursor: pointer;
`;

const anchor = css`
  height: 48px;
  align-items: center;
  display: flex;
  justify-content: center;
  text-decoration: none;
  color: #333333;
  :active {
    color: white;
  }
`;
/*
const StyledButton = styled('button')`
  border: 0;
  color: #0556a4;
  border-radius: 0;
  cursor: pointer;
  background-color: #fff;
  border-left: 1px solid #9b9b9b;
  margin-left: 6px;
  padding: 0 6px;
`;
*/
const clsPageItem = css`
  ${liItem} width: 40px;
  height: 48px;
  border: solid 1px rgba(0, 85, 166, 0);
  a {
    ${anchor};
  }
  :hover {
    border-radius: 4px;
    background-color: rgba(0, 85, 166, 0.05);
    border: solid 1px #0055a6;
  }
  :active {
    border-radius: 4px;
    background-color: #0055a6;
    color: white;
  }
`;
const clsActivePageItem = css`
  a {
    width: 16px;
    height: 30px;
    border-bottom: 2px solid #0055a6;
    border-radius: 1.5px;
    margin: 5px auto 0;
    @media screen\0 {
      height: 39.5px;
    }
  }
`;
const clsPrevNextItem = css`
  ${liItem} width: 90px;
  border: solid 1px rgba(0, 85, 166, 0);
  font-family: 'Mallory-Book';
  font-size: 1rem;
  a {
    ${anchor};
  }
  :hover {
    border-radius: 4px;
    background-color: rgba(0, 85, 166, 0.05);
    border: solid 1px #0055a6;
  }
  :active {
    border-radius: 4px;
    background-color: #0055a6;
    color: white;
  }
  ${media.sm`
    width: 79px;
  `};
`;

const clsBreakEllipses = css`
  display: inline-block;
`;
const disabledClassName = css`
  opacity: 0.5;
  :hover {
    background: none;
    border: none;
    cursor: not-allowed;
  }
`;
const PaginationInfo = styled('div')`
  color: #333333;
  font-size: ${props => (props.isDesktop ? '14px' : '12px')};
`;

class Pagination extends React.PureComponent {
  constructor(props) {
    super(props);
    this.config = {
      previousLabel: '< Prev',
      nextLabel: 'Next >',
      breakClassName: clsBreakEllipses,
      pageClassName: clsPageItem,
      previousClassName: clsPrevNextItem,
      nextClassName: clsPrevNextItem,
      containerClassName: clsPagination,
      activeClassName: clsActivePageItem,
      disabledClassName
    };

    this.state = {
      showingTo: (props.pageSize || PAGE_SIZE),
      showingFrom: 1,
      pageNumber: 0
    };

    this.onKeyViewAll = this.onKeyViewAll.bind(this);
  }

  static getDerivedStateFromProps(newProps) {
    return {
      showingTo: newProps.pageNumber * (newProps.pageSize || PAGE_SIZE),
      showingFrom: ((newProps.pageNumber - 1) * (newProps.pageSize || PAGE_SIZE)) + 1, // prettier-ignore
      pageNumber: newProps.pageNumber - 1
    };
  }
  /**
   * Handles key events when clicking on Show All Results CTA
   * @param {*} e  event param for getting key code
   */
  onKeyViewAll(e) {
    if (e.keyCode === ENTER_KEYCODE || e.keyCode === SPACE_KEYCODE) {
      this.props.onViewAll();
    }
  }

  render() {
    const { totalPage, onPageChange, isDesktop, pageSize } = this.props;
    const pageCount = Math.ceil(+totalPage / (pageSize || PAGE_SIZE));
    const pageRangeDisplayed = isDesktop ? 4 : 1;
    return (
      <Fragment>
        {
          pageCount > 1 &&
          <div data-auid="listingPagination" className="d-flex justify-content-center">
            <ReactPaginate
              {...this.config}
              breakLabel={<span>...</span>}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={pageRangeDisplayed}
              onPageChange={onPageChange}
              forcePage={this.state.pageNumber}
            />
          </div>
        }
        <PaginationInfo isDesktop={isDesktop} className="d-flex justify-content-center align-items-center">
          <span data-auid="listingPagination_pageInfo">
            Showing {this.state.showingFrom === 0 ? 1 : this.state.showingFrom}-{this.state.showingTo > totalPage ? totalPage : this.state.showingTo}{' '}
            of {totalPage}
          </span>
          {/* Commenting out follow to defer it and will fix the show all in warranty period
            {totalPage > (pageSize || PAGE_SIZE) && (
              <StyledButton onKeyDown={this.onKeyViewAll} onClick={this.props.onViewAll} data-auid="viewallCta">
                Show All Results
              </StyledButton>
            )}
          */}
        </PaginationInfo>
      </Fragment>
    );
  }
}

Pagination.propTypes = {
  totalPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pageNumber: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool,
  onViewAll: PropTypes.func,
  showAll: PropTypes.bool
};

export default Pagination;
