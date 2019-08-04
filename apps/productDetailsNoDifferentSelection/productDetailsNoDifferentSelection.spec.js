import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import ProductDetailsNoDifferentSelection from './productDetailsNoDifferentSelection.component';
import JSONData from '../../../mock_server/routes/productAPI/multiSKU.json';
import { getProductItem } from '../../utils/productDetailsUtils';

const initialState = { gtmDataLayer: [] };
const mockStore = configureStore();
const productItem = getProductItem(JSONData, {});

describe('<ProductDetailsNoDifferentSelection />', () => {
  it('renders <ProductDetailsNoDifferentSelection /> component', () => {
    const wrapper = shallow(<ProductDetailsNoDifferentSelection isCSR={false} api={JSONData} />);
    expect(wrapper).to.have.length(1);
  });

  it('test with mock productItem', () => {
    const wrapper = shallow(<ProductDetailsNoDifferentSelection isCSR={false} api={JSONData} productItem={productItem} />);
    expect(wrapper).to.have.length(1);
  });

  it('test with full mount', () => {
    const productItemNext = {
      ...productItem,
      identifiersMap: {}
    };
    const wrapper = mount(
      <Provider store={mockStore(initialState)}>
        <ProductDetailsNoDifferentSelection isCSR={false} api={JSONData} productItem={productItemNext} />
      </Provider>
    );
    expect(wrapper).to.have.length(1);
  });

  it('test with client side rendering', () => {
    const wrapper = shallow(<ProductDetailsNoDifferentSelection productItem={productItem} />);
    expect(wrapper).to.have.length(1);
  });

  it('test with getInitialProps method cmsPageInfo', () => {
    ProductDetailsNoDifferentSelection.getInitialProps({ cmsPageInfo: { previewId: 3678641 }, env: { API_HOSTNAME: 'http://35.188.171.242/' } }).then(
      response => {
        console.log('response received..', response);
      }
    );
    const wrapper = shallow(<ProductDetailsNoDifferentSelection productItem={productItem} />);
    expect(wrapper).to.have.length(1);
  });

  it('test with getInitialProps method pageInfo', () => {
    const pageInfo = { previewId: 3678641 };
    ProductDetailsNoDifferentSelection.getInitialProps({ pageInfo, env: { API_HOSTNAME: 'http://35.188.171.242/' } }).then(response => {
      console.log('response received..', response);
    });
    const wrapper = shallow(<ProductDetailsNoDifferentSelection pageInfo={pageInfo} productItem={productItem} />);
    expect(wrapper).to.have.length(1);
  });

  it('test mixedMedia meta data', () => {
    const mixedMediaProductItem = {
      ...productItem,
      mixedMediaMetaData: {
        set: {
          pv: '1.0',
          type: 'media_set',
          n: 'academy/mms_103564001',
          item: [
            { i: { n: 'academy/103563990_GREEN_0_0_0_c2' }, s: { n: 'academy/103563990_GREEN_0_0_0_c2' }, dx: '1500', dy: '1500', iv: 'BxDRd1' },
            { i: { n: 'academy/103564010_BLUE_0_0_0_c4' }, s: { n: 'academy/103564010_BLUE_0_0_0_c4' }, dx: '1500', dy: '1500', iv: 'uEbRt3' },
            {
              v: {
                path: 'academy/_media_/a3f/a3f7c8b1-5705-4d30-acf7-a0e4006df25d.mp4',
                dx: '1920',
                dy: '1080',
                bitrate: '10452125',
                id: 'academy/PROD_AP_150_MagellanOutdoors_109359375_Eagle%20Bluff%20Reversible_Buck%20Ventures_converted',
                suffix: 'mp4'
              },
              i: { n: 'academy/PROD_AP_150_MagellanOutdoors_109359375_Eagle%20Bluff%20Reversible_Buck%20Ventures_converted' },
              s: { n: 'academy/PROD_AP_150_MagellanOutdoors_109359375_Eagle%20Bluff%20Reversible_Buck%20Ventures_converted' },
              type: 'video',
              iv: '2xlRA2',
              userdata: [
                {
                  Audio_Codec: 'AAC LC',
                  Audio_Sample_Rate: '44.1',
                  Number_Audio_Channels: '2',
                  Video_Codec: 'AVC',
                  Video_Frame_Rate: '29.970',
                  Video_Length: '15.849'
                },
                {
                  Audio_Codec: 'AAC LC',
                  Audio_Sample_Rate: '44.1',
                  Number_Audio_Channels: '2',
                  Video_Codec: 'AVC',
                  Video_Frame_Rate: '29.970',
                  Video_Length: '15.849'
                }
              ]
            }
          ]
        }
      }
    };
    const wrapper = shallow(<ProductDetailsNoDifferentSelection isCSR={false} productItem={mixedMediaProductItem} api={JSONData} />);
    expect(wrapper).to.have.length(1);
  });
});
