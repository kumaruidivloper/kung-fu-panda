import React from 'react';
import PropTypes from 'prop-types';
import * as emo from './wishListSuccess.emotion';
import { scrollIntoView } from '../../../../utils/scroll';

class WishListSuccess extends React.PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  componentDidMount() {
    setTimeout(this.scrollIntoView, 30);
  }

  scrollIntoView() {
    const { successScrollIntoView } = this.props;

    if (successScrollIntoView) {
      const el = this.wrapperRef.current;
      if (el) {
        scrollIntoView(el, true);
      }
    }
  }

  render() {
    const { wishListName, itemImageUrl } = this.props;
    return (
      <div className={emo.wrapper} ref={this.wrapperRef}>
        <emo.H6 className="mb-2">This item has been added to</emo.H6>
        <emo.Text className="o-copy__14reg mb-1">{wishListName}</emo.Text>
        {!!itemImageUrl && (
          <emo.ImageWrapper>
            <emo.Image src={itemImageUrl} />
          </emo.ImageWrapper>
        )}
      </div>
    );
  }
}

WishListSuccess.propTypes = {
  wishListName: PropTypes.string,
  itemImageUrl: PropTypes.string,
  successScrollIntoView: PropTypes.bool
};

export default WishListSuccess;
