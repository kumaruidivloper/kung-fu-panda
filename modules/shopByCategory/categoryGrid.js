import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

const StyledAnchor = styled('a')`
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 2px 2px 0 rgba(0, 0, 0, 0.04), 0 0 2px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
  text-align: center;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  &:hover {
    color: #333;
  }
`;

const StyledImg = styled('img')`
  width: 128px;
  height: 128px;
  @media (min-width: 576px) {
    width: 188px;
    height: 188px;
  }

  @media (min-width: 768px) and (max-width: 1111px) {
    width: 155px;
    height: 155px;
  }
`;

const StyledPara = styled('p')`
  text-decoration: none;
  text-transform: uppercase;
  color: #333;
`;

const CategoryGridComponent = props => {
  const { src, href, uniqueID, LinkTitle, auid, ...rest } = props;
  return (
    <div key={uniqueID} className="col-6 col-md-3 mb-md-1 mb-half">
      <StyledAnchor href={href} {...rest} data-auid={`shopByCategory_${auid}`}>
        <StyledImg aria-hidden="true" src={`${src}?wid=250&hei=250`} alt={LinkTitle} />
        <div className="d-flex align-items-center justify-content-center mt-2 mb-1 w-100 ">
          <StyledPara className="o-copy__16bold">{LinkTitle}</StyledPara>
        </div>
      </StyledAnchor>
    </div>
  );
};

CategoryGridComponent.propTypes = {
  /** Button type */
  src: PropTypes.string,
  /** Button status */
  href: PropTypes.string,
  /** Gets called when the user clicks on the button */
  LinkTitle: PropTypes.string,
  /** Button label */
  children: PropTypes.PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  auid: PropTypes.number,
  uniqueID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default CategoryGridComponent;
