const data = {
  orders: [
    {
      orderId: '10001',
      numberOfItems: '2',
      orderStatus: 'p',
      totals: {
        totalAdjustment: '0',
        totalShippingTax: '22.5',
        totalProductPrice: '100',
        orderCurrency: 'USD',
        orderLocale: 'en_US',
        totalShippingCharge: '10',
        orderTotal: '200',
        totalSalesTax: '20'
      },
      orderItems: [
        {
          orderItemId: '20001',
          unitPrice: '12',
          zipCode: '560066',
          quantity: '1',
          shipModeCode: 'UPS Ground',
          shipModeId: '10551',
          orderItemPrice: '123',
          skuId: '111083697',
          isfreeGift: '',
          productId: '4686067',
          skuDetails: {
            inventory: {
              store: [
                {
                  storeId: '1005',
                  availableQuantity: '2',
                  inventoryStatus: 'OUT_OF_STOCK'
                }
              ],
              online: [
                {
                  availableQuantity: '2',
                  inventoryStatus: 'OUT_OF_STOCK'
                }
              ]
            },
            skuInfo: {
              name: 'Mag M SS Laguna Madre:Grey:X Small',
              shortDescription: '',
              longDescription: "Just slip on the Magellan Outdoors Men's Laguna Madre Solid Short Sleeve Fishing Shirt, pack up your reel, rod and tackle box and you'll be ready to go. Made of lightweight, yet sturdy nylon, this short-sleeve shirt offers UPF 20+ protection from the sun's harmful rays. Plus, moisture-wicking fabric technology helps keep you cool and dry on especially hot days out on the water.",
              sellable: 'true',
              fullImage: '//assets.academy.com/mgen/68/20004268.jpg',
              thumbnail: '//assets.academy.com/mgen/68/20004268.jpg',
              imageAltDescription: 'Mag M SS Laguna Madre:Grey:X Small',
              skuAttributes: [
                {
                  name: 'color',
                  value: 'blue'
                },
                {
                  name: 'size',
                  value: '43'
                }
              ]
            },
            'availableShippingMethods:': [
              {
                shipmodeId: '10551',
                shipmodeDesc: 'UPS Ground',
                shippingType: 'SG',
                estimatedFromDate: '7-1',
                estimatedToDate: '7-4'
              },
              {
                shipmodeId: '10556',
                shipmodeDesc: 'Pickup In Store',
                shippingType: 'PICKUPINSTORE'
              },
              {
                shipmodeId: '10556',
                shipmodeDesc: 'Ship To Store',
                shippingType: 'STS',
                estimatedFromDate: '7-1',
                estimatedToDate: '7-4'
              }
            ]
          }
        }
      ],
      ShippingGroups: [
        {
          groupSeqNum: '1',
          shippingModes: [
            {
              shipmodeId: '11357',
              shipmodeDesc: 'FEDX 2 Day',
              shippingType: 'STANDARD',
              estimatedFromDate: '7-2',
              estimatedToDate: '7-5',
              saleShippingCharge: '50',
              baseShippingCharge: '60',
              isSelected: true
            },
            {
              shipmodeId: '11358',
              shipmodeDesc: 'FEDX 1 Day',
              shippingType: 'STANDARD',
              estimatedFromDate: '7-2',
              estimatedToDate: '7-5',
              saleShippingCharge: '50',
              baseShippingCharge: '60',
              isSelected: false
            }
          ],
          orderItems: [
            {
              orderItemId: '1000'
            },
            {
              orderItemId: '1001'
            }
          ]
        },
        {
          groupSeqNum: 2,
          shippingModes: [
            {
              storeId: '12345',
              shipmodeId: '11357',
              shipmodeDesc: 'PickupInStore',
              shippingType: 'PICKUPINSTORE',
              saleShippingCharge: '50',
              baseShippingCharge: '60'
            }
          ],
          orderItems: [
            {
              orderItemId: '1002'
            },
            {
              orderItemId: '1003'
            }
          ]
        }
      ],
      Addresses: {
        shippingAddress: {
          id: '3457',
          line1: '',
          line2: '',
          zipcode: '',
          type: 'BIlling',
          name: 'Home Address'
        }
      },
      payments: [],
      promotions: [
        {
          promotionId: '100533691',
          code: 'Test10',
          description: ''
        },
        {
          promotionId: '100533692',
          code: 'Test10',
          description: ''
        }
      ]
    }
  ]
};

export default data;
