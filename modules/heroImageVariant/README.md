**heroImageVariant**

NOTE: This component is in `wip` state because there are requirements yet to be clarified.

This component is a variation of the existing `heroImage` component but the requirement and the layouts are completely different.
Following is the JSON schema required by this component which CMS has to send:

```json
{
  "background": {
    "image": "https://image.ibb.co/mPuDzS/Stocksy_comp_838778_crop.jpg"
  },
  "middle": {
    "image": "https://image.ibb.co/nDNGKS/Racing_guys_crop.jpg",
    "position": "right"
  },
  "foreground": {
    "image": "https://image.ibb.co/kqV0Dn/NIKE_FLYKNIT_RACER_526628_403_A_PREM.png",
    "position": "center"
  },
  "textContent": {
    "position": "left",
    "eyebrow": "Hiking & Trail shoes",
    "headline": "find your stride",
    "messaging": "Lace 'em up for your weekend hike, or clear out space for another trophy.",
    "ctaLabel": "Shop trail running",
    "ctaTarget": "www.google.com",
    "bgColor": "#0055a6"
  }
}
```

### __Explanation of the JSON schema__
1. **background:**
    - image: The image url to be rendered as background. This is for the container which sits in the back.
2. **middle:**
    - image: The image url to be rendered as background for the middle container.
    - position: The position of the container. Possible value is `left` or `right`.
3. **foreground:**
    - image: The image url to be rendered as background for the foreground container.
    - position: The position of the container. Possible value is `center` or `bottom`(only applicable for mobile).
4. **textContent:**
    - position: The position of the container holding the text content. Possible value is `left` or `right`.
    - eyebrow: The eyebrow text
    - headline: The heading of the content
    - messaging: The description/summary text content
    - ctaLabel: The label for the cta button
    - ctaTarget: The target for the cta button
    - bgColor: The background color for the textCotnent box. Possible values: `#0055A6 || #29be93`


### __Pending Implementation/Assumptions__

- If the JSON schema changes, component has to be refactored.
- CTA is not yet implemented as the requirement is not clear.
- Implementation of pending queries once resolved.
