/**
 * Higher order component to handle error thrown from Server Side
 */
import React, { PureComponent } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

const errorHandler = WrappedComponent => {
  class ErrorComponent extends PureComponent {
    constructor(props) {
      super(props);
      console.log(props);
      console.log('inside the studio');
    }
    componentDidMount() {
      if (this.props.api.apiError) {
        console.error('Server Side Error in Component:', WrappedComponent.name, 'with error code', this.props.api.apiError);
      }
    }

    render() {
      const { api } = this.props;
      if (api.apiError) {
        return null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  hoistNonReactStatic(ErrorComponent, WrappedComponent);
  ErrorComponent.displayName = `ErrorHandler(${WrappedComponent.name})`;

  ErrorComponent.propTypes = {
    api: PropTypes.object
  };
  return ErrorComponent;
};

export default errorHandler;
