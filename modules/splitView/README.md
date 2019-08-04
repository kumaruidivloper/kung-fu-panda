**splitView** **_WIP_**

### Attributes

| Attr                |         | type            | required | default value | description               | notes | src   |
|---------------------|---------|-----------------|----------|---------------|---------------------------|-------|-------|
| cms.headlineText    |         | string          | yes      | na            |                           |       | specs |
| cms.headlineSubText |         | string          | yes      | na            |                           |       | specs |
| cms.cta             |         | array of object | yes      | na            |                           |       | specs |
| *                   | ctaText | string          | yes      | na            |                           |       | specs |
| *                   | ctaPath | string          | yes      | na            |                           |       | specs |
| cms.desktopImage    |         | string          | yes      | na            |                           |       | specs |
| cms.mobileImage     |         | string          | yes      | na            |                           |       | specs |
| cms.imageAltText    |         | string          | yes      | na            |                           |       | specs |
| cms.color           |         | string          | no       | white         | accepts "white" or "gray" |       | specs |

### Notes from Specifications
* Minimum of 1, Maximum of 5. The system will balance CTA's in the event of an odd number (1, 3 or 5) and make the last one larger to span the width of both columns. Mobile would always be stacked.


