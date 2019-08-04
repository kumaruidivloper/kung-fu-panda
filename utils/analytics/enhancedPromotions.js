/**
 *
 *
 * @param {string} element component's Name
 * @param {object} element component's cms data
 * @returns object which contain promotions array for heroCarouel
 */
export const enhancedPromotions = (element, cms) => {
  if (element === 'heroCarousel') {
    const promotions = [];
    for (let i = 0; i < cms.carouselPanel.length; i += 1) {
      const { name = cms.name, id = cms.id, dimension83 = cms.dimension83, position = cms.position, creative = cms.creative } = cms.carouselPanel[i];
      if (id || name) {
        promotions.push({ id: id || name, name: name || id, dimension83, position, creative });
      }
    }
    return promotions.length > 0 ? { ...cms, promotions } : cms;
  }
  return cms;
};
