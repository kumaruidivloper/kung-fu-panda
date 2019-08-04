/* global dataLayer */
/* eslint complexity: ['warn', 20] */
import React from 'react';
import axios from 'axios';
import './higherOrder.component.scss';
import StorageManager from '../../utils/StorageManager';

const HigherOrder = WrappedComponent =>
  class extends React.PureComponent {
    propTypes = {
      cms: {}
    };

    constructor(props) {
      super(props);
      this.state = {
        diffcms: null,
        isApiFailed: false,
        id: StorageManager.getCookie('correlationId')
      };
      if (this.props.cms.targetMboxID) {
        this.fetchApiJSON();
      }
      this.pushToDL = this.pushToDL.bind(this);
    }

    pushToDL(mboxId = 'Mbox ID', experienceId = 'Experience ID') {
      dataLayer.push({
        event: 'targetComponents',
        eventCategory: 'adobe target tests',
        eventAction: mboxId,
        eventLabel: experienceId
      });
    }

    fetchApiJSON() {
      axios
        .post(`https://academysportsandoutd.tt.omtrdc.net/rest/v1/mbox/${this.state.id}?client=academysportsandoutd`, {
          mbox: this.props.cms.targetMboxID
        })
        .then(
          response => {
            if (response.data && response.data.content) {
              const str1 = response.data.content;
              let finalStr1;
              try {
                finalStr1 = JSON.parse(str1)['cms-content'];
              } catch (er) {
                console.error(er);
                finalStr1 = undefined;
              }
              if (finalStr1) {
                this.setState({
                  diffcms: finalStr1
                });
              }
            }
            return false;
          },
          err => {
            const { response } = err;
            this.setState({
              isApiFailed: true
            });
            console.error(`ERROR :: AdobeTarget API failed :: ${(response && response.statusCode) || err}`);
            return false;
          }
        )
        .catch(err => {
          this.setState({
            isApiFailed: true
          });
          const { response } = err;
          console.error(`ERROR :: AdobeTarget API failed :: ${(response && response.statusCode) || err}`);
          return false;
        });
    }

    render() {
      const { cms, ...others } = this.props;
      const { isApiFailed } = this.state;
      if (cms.targetMboxID && this.state.diffcms) {
        return <WrappedComponent cms={this.state.diffcms} {...others} />;
      } else if (cms.targetMboxID && isApiFailed) {
        return <WrappedComponent {...this.props} />;
      } else if (!cms.targetMboxID) {
        return <WrappedComponent {...this.props} />;
      }
      return false;
    }
  };

export default HigherOrder;
