// import React from 'react';
// import { expect } from 'chai';
// import { shallow, mount } from 'enzyme';
// import Drawer from '@academysports/fusion-components/dist/Drawer';
// import Facet from './facets';
// import Facets from './facets';

// describe('Facets', () => {
  // let props = {
  //   cms: { title: 'Title' },
  //   facets: [{
  //     id: '-1000',
  //     name: 'Brand',
  //     displaySequence: '-11.0',
  //     property: 'mfName_ntk_cs',
  //     labels: [
  //       {
  //         property: 'mfName_ntk_cs%3A%22New+Balance%22',
  //         name: 'New Balance',
  //         selected: false,
  //         count: '41',
  //         id: '-1002781011193266971089711099101'
  //       }
  //     ]
  //   }]
  // };
  // it('always renders the Facets component', () => {
  //   const Wrapper = mount(<Facets />);
  //   expect(Wrapper.length).to.eql(1);
  // });

  // let MountedFacets;

  // const ShallowFacet = () => {
  //   if (!MountedFacets) {
  //     MountedFacets = mount(<Facet {...props} />);
  //   }
  //   return MountedFacets;
  // };

  // console.log('Facets', ShallowFacet().getDOMNode());

  // it('always renders a div with title', () => {
  //   // const MountedFacets = shallow(<Facet {...props} />);
  //   const divs = ShallowFacet();
  //   console.log(divs);
  //   // console.log(MountedFacets().getDOMNode());
  //   // expect(ShallowFacet().find('h3')).to.have.length(1);
  // });
// });

// describe('facets have a drawer', () => {
//   props = Object.assign(props, {
//     facets:
//       {
//         id: '-1000',
//         name: 'Brand',
//         displaySequence: '-11.0',
//         property: 'mfName_ntk_cs',
//         labels: [
//           {
//             property: 'mfName_ntk_cs%3A%22New+Balance%22',
//             name: 'New Balance',
//             selected: false,
//             count: '41',
//             id: '-1002781011193266971089711099101'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22ASICS%22',
//             name: 'ASICS',
//             selected: true,
//             count: '34',
//             id: '-10026583736783'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22ASICS%C2%AE%22',
//             name: 'ASICS®',
//             selected: false,
//             count: '32',
//             id: '-10026583736783174'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Saucony%22',
//             name: 'Saucony',
//             selected: false,
//             count: '28',
//             id: '-1002839711799111110121'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Under+Armour%22',
//             name: 'Under Armour',
//             selected: false,
//             count: '26',
//             id: '-1002851101001011143265114109111117114'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Under+Armour%C2%AE%22',
//             name: 'Under Armour®',
//             selected: false,
//             count: '23',
//             id: '-1002851101001011143265114109111117114174'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Reebok%22',
//             name: 'Reebok',
//             selected: false,
//             count: '19',
//             id: '-10028210110198111107'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Mizuno%22',
//             name: 'Mizuno',
//             selected: false,
//             count: '18',
//             id: '-100277105122117110111'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Adidas%22',
//             name: 'Adidas',
//             selected: false,
//             count: '15',
//             id: '-10026510010510097115'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Fila%22',
//             name: 'Fila',
//             selected: false,
//             count: '10',
//             id: '-10027010510897'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22BCG%E2%84%A2%22',
//             name: 'BCG?',
//             selected: false,
//             count: '7',
//             id: '-10026667718482'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22SKECHERS%22',
//             name: 'SKECHERS',
//             selected: false,
//             count: '7',
//             id: '-10028375696772698283'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Salomon%22',
//             name: 'Salomon',
//             selected: false,
//             count: '6',
//             id: '-10028397108111109111110'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22adidas%22',
//             name: 'adidas',
//             selected: false,
//             count: '5',
//             id: '-10029710010510097115'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22361%22',
//             name: '361',
//             selected: false,
//             count: '3',
//             id: '-1002515449'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22BCG%22',
//             name: 'BCG',
//             selected: false,
//             count: '2',
//             id: '-1002666771'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22Merrell%C2%AE%22',
//             name: 'Merrell®',
//             selected: false,
//             count: '2',
//             id: '-100277101114114101108108174'
//           },
//           {
//             property: 'mfName_ntk_cs%3A%22PUMA%22',
//             name: 'PUMA',
//             selected: false,
//             count: '2',
//             id: '-100280857765'
//           }
//         ]
//       }

//   });


//   it('always renders a `Drawer` ', () => {
//     const MountedFacets = mount(<Facet {...props} />);
//     expect(ShallowFacet().find(Drawer)).to.have.length(1);
//   });
// });
