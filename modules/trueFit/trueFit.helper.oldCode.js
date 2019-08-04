// <!-- GTM JS Block :: Start -->
// <script>
//   try{
//     //-----Development - Only use this line for UAT----//
//       var env = 'staging';
//     //-----Production - Only use this line for Prod----//
//     //  var env = 'prod';

//     (function(){ var a={};
//               function g(l){ a[l]=function(r,e,o){ var w=window,d=document,p=[],t,s,x;
//                                                   w.tfcapi=t=w.tfcapi||function(){ t.q=t.q||[];
//                                                                                   t.q.push(arguments);};
//                                                   o&&o.forceMobile===true&&p.push('deviceType=mobile');
//                                                   o&&o.autoCalculate===false&&p.push('autoCalculate=false');
//                                                   x=d.getElementsByTagName('script')[0];
//                                                   s=d.createElement('script');
//                                                   s.type='text/javascript';
//                                                   s.async=true; s.src='//'+r+(e==='dev'||e==='staging'?'-'+e:'')+'-cdn'+
//                                                     (d.location.protocol==='https:'?'s':'')+'.truefitcorp.com/fitrec/'+r+'/js/'+l+'.js?'+p.join('&');
//                                                   x.parentNode.insertBefore(s,x);}}
//               g('fitrec');
//                                 g('tracker');
//               return a;
//               // Don't change anything above this line
//              }
//     )().fitrec('asp',env);
//   } catch (e) {console.log('TrueFit JS' + e.message);}
// </script>
// <script>
//   try{
//     var psku;
//     var psku = _dl.products_detail_view[0].bundle_sku ? _dLayer.products_detail_view[0].bundle_sku : _dl.products_detail_view[0].parent_sku;
//     if ({{authentication_status}} == 'authenticated'){
//       var reg = 'true';
//       var user_id = {{customer_id}};
//     } else {
//       var reg = 'false';
//       var user_id = '';
//     };
//     var container = document.getElementById("trueFitRec"),parent = container.parentNode;
//     var tfDiv = document.createElement("div");
//     tfDiv.setAttribute('class','tfc-fitrec-product');
//     tfDiv.setAttribute('id',psku);
//     tfDiv.setAttribute('data-registered',reg);
//     tfDiv.setAttribute('data-locale','en_US');
//     tfDiv.setAttribute('data-userid',user_id);
//     parent.replaceChild(tfDiv,container);
//   } catch (e) {console.log('TrueFit test' + e.message);}
// </script>
// <script>
// //function is_in_stock (sizeValue) {
// //  return true;
// //}

// var trueFitDictionary = {
//     "30/40 C/D" : true,
//     "34/35 D/DD" : true,
//     "34/36 C/D" : true,
//     "36 /38 C/D" : true,
//     "36/38 D/DD" : true,
//     "38/40 D/DD" : true,
//     "19/20 Junior" : true,
//     "0 Junior" : true,
//     "1/2 Junior" : true,
//     "3/4 Junior" : true,
//     "5/6 Junior" : true,
//     "7/8 Junior" : true,
//     "9/10 Junior" : true,
//     "11/12 Junior" : true,
//     "13/14 Junior" : true,
//     "15/16 Junior" : true,
//     "17/18 Junior" : true,
//     "10.5 Plus Youth" : true,
//     "10/12 Youth" : true,
//     "12.5 Plus Youth" : true,
//     "14.5 Plus Youth" : true,
//     "14/16 Youth" : true,
//     "16.5 Plus Youth" : true,
//     "18.5 Plus Youth" : true,
//     "18/20 Youth" : true,
//     "20.5 Youth Plus" : true,
//     "6/6X Youth" : true,
//     "8.5 Plus Youth" : true,
//     "16 Youth Regular" : true,
//     "19/20 Junior" : true,
//     "21/22 Junior" : true,
//     "0 Junior" : true,
//     "1/2 Junior" : true,
//     "3/4 Junior" : true,
//     "5/6 Junior" : true,
//     "7/8 Junior" : true,
//     "9/10 Junior" : true,
//     "11/12 Junior" : true,
//     "13/14 Junior" : true,
//     "15/16 Junior" : true,
//     "17/18 Junior" : true,
//     "12 Husky" : true,
//     "14 Husky" : true,
//     "16 Husky" : true,
//     "18 Husky" : true,
//     "20 Husky" : true,
//     "2 Toddler" : true,
//     "3 Toddler" : true,
//     "4 Toddler" : true,
//     "4 Youth" : true,
//     "5 Youth" : true,
//     "6 Youth" : true,
//     "7 Youth" : true,
//     "8 Youth" : true,
//     "10 Husky" : true,
//     "12 Youth" : true,
//     "14 Youth" : true,
//     "16 Youth" : true,
//     "18 Youth" : true,
//     "20 Youth" : true,
//     "10 Youth Regular" : true,
//     "6 Youth Regular" : true,
//     "8 Husky Youth" : true,
//     "8 Youth Regular" : true,
//     "12 Youth Regular" : true,
//     "12 Husky Youth" : true,
//     "14 Youth Regular" : true,
//     "16 Husky Youth" : true,
//     "14 Youth Regular" : true,
//     "16 Husky Youth" : true,
//     "18 Youth Regular" : true,
//     "20 Husky Youth" : true,
//     "20 Youth Regular" : true,
//     "10 Youth Slim" : true,
//     "12 Youth Slim" : true,
//     "14 Youth Slim" : true,
//     "16 Youth Slim" : true,
//     "18 Youth Slim" : true,
//     "20 Youth Slim" : true,
//     "4 Youth Slim" : true,
//     "5 Youth Regular" : true,
//     "5 Youth Slim" : true,
//     "6 Youth Slim" : true,
//     "7 Youth Regular" : true,
//     "7 Youth Slim" : true,
//     "8 Husky" : true,
//     "8 Youth Slim" : true,
//     "8 Husky Youth" : true,
//     "10 Husky" : true,
//     "14 Husky Youth" : true,
//     "18 Husky Youth" : true,
//     "4 Youth Regular" : true,
//     "Flex Fit" : true,
//     "One Size" : true,
//     "X Small" : true,
//     "Medium Tall" : true,
//     "Large Tall" : true,
//     "Large/X Large" : true,
//     "X Large" : true,
//     "X Large Tall" : true,
//     "X Large/XX Large" : true,
//     "XX Large" : true,
//     "XX Large Tall" : true,
//     "XXX Large" : true,
//     "XXX Large Tall" : true,
//     "XXXX Large" : true,
//     "XXXX Large Tall" : true,
//     "XXXX Large/XXXXXXX Large" : true,
//     "XXXXX Large" : true
// };

// function fitrec_selectSize() {
//     try{
//       tfcapi('event', 'tfc-fitrec-product', 'success', function (context) {
//             var selectSizeRecommendation = context.fitRecommendation.size;
//             var dictionaryCheck = '';
//             var sizeParser;
//             var matchPrimary;
//             if(selectSizeRecommendation.indexOf(' ') >= 0){
//                 dictionaryCheck = trueFitDictionary[selectSizeRecommendation];
//             }
//             if (dictionaryCheck == undefined) {
//                 sizeParser = context.fitRecommendation.size.split(" ");
//                 matchPrimary = sizeParser[0];
//                 var sizeRecommendationSecondary = sizeParser[1];
//             }
//             else {
//                 sizeParser = selectSizeRecommendation;
//                 matchPrimary = sizeParser;
//             }

//         jQuery(".primary .atrribute-list").find("a").each(function(){
//             var str = jQuery(this).find('.pdp-diff-item-wrap').text().trim().replace("inches", '');
//             if (str == matchPrimary) {
//                   jQuery(this).click();
//                   return false;
//             }
//           });

//         if(typeof sizeRecommendationSecondary != 'undefined'){
//           var matchSecondary = sizeRecommendationSecondary;
//           jQuery(".secondary .atrribute-list").find("a").each(function(){
//             var str = jQuery(this).find('.pdp-diff-item-wrap').text().trim().replace("inches", '');;
//             if (str == matchSecondary) {
//                   jQuery(this).click();
//                   return false;
//             }
//           });
//         }
//       })
//         //create logic to match sizes and if available return true else return false;
//         //return true;
//     } catch (e) {console.log('TrueFit AutoDiffSelect ' + e.message);}
// }
// fitrec_selectSize();

// function fitrec_setColorId(newColorId, newAvailableSizes) {
//   tfcapi('update', 'tfc-fitrec-product', {
//     products: {
//         'styleId1': {
//           colorId: newColorId,
//           availableSizes: newAvailableSizes
//       }
//     }
//   });
// }

// function fetchColorID () {
//   try{
//       var currentColorValue = jQuery(".atrribute-list:first").find(".checked");
//       if (currentColorValue.length > 0){
//         var colorValue = currentColorValue.data("value");
//         var colorAttId = currentColorValue.data("id");
//         jQuery('.tfc-fitrec-product').attr('data-colorid',colorValue);
//       }

//       var allSpitCombined = "";
//       for (var i = 0; i < PdpDiffSelection.enableList[colorAttId].length; i++) {
//           var splitItem = PdpDiffSelection.enableList[colorAttId][i];
//           splitItem = splitItem.replace(colorAttId + "-", "");
//           var splitItemArr = splitItem.split("-");
//           var splitItemCombined = "";
//           for (var x = 0; x < splitItemArr.length; x++) {
//               var v = jQuery("a[data-id=" + splitItemArr[x] + "]").data("value").toString().replace('&quot;', '"');

//               if (x<splitItemArr.length-1) {
//                   splitItemCombined += v+" ";
//               }
//               else {
//                   splitItemCombined += v;
//               }
//           }
//           if (i<PdpDiffSelection.enableList[colorAttId].length-1) {
//               allSpitCombined += splitItemCombined+":";
//           }
//           else {
//               allSpitCombined += splitItemCombined;
//           }
//       }
//       jQuery('.tfc-fitrec-product').attr('data-availablesizes',allSpitCombined);
//       fitrec_setColorId(colorValue,allSpitCombined);
//   }
//   catch (e) {
//     console.log('TrueFit fetchColorID' + e.message);
//   }

// }

// var trueFitInterval;
// var intervalFlag = false;
// tfcapi('event','tfc-fitrec-product','render',function(){
//     if (intervalFlag === false) {
//         intervalFlag = true;
//         trueFitInterval = setInterval(function() {
//             console.debug("truefit interval");
//             if (PdpDiffSelection != undefined) {
//               if(PdpDiffSelection.preSelectionFlag == false) {
//                     console.debug("preSelectionFlag is false");
//                     var trueFitWidget = jQuery(".tfc-fitrec-product");
//                     console.debug("trueFitWidget: ", trueFitWidget);
//                     if(trueFitWidget.length>0) {
//                         console.debug("trueFitWidget: ", trueFitWidget.length);
//                         clearInterval(trueFitInterval);
//                         fetchColorID();
//                     }
//                 }
//             }
//         }, 250);
//     }

// /* later */
// })

// tfcapi('event','tfc-fitrec-register','addtobag',function(e) {

//   var size = e.size;
//   console.log('size is ' + size);
//   // Try to select the size
//   //if(!fitrec_selectSize(size)) {
//     // The size the user was recommended does not match one on the retailer’s site
//     // If you get into this case, that typically points to a data/catalog issue

//     // ... Display an appropriate error message ...
//     //console.log('add to bag Error 1');
//   //}
//   //else if(!is_in_stock(size)) {
//     // The size the user was recommended is out of stock
//     // This will only ever happen if data-availablesizes is not set appropriately
//     // ... Display an appropriate error message ...
//     //console.log('add to bag Error 2');
//   //}
//   //else {
//     // ... Try to add the item to cart ...
//     var item2add2bag = jQuery('#catalog-entry-id').attr('data-id');
//     productDisplayJS.Add2ShopCartAjax('entitledItem_'+item2add2bag, document.getElementById('quantity_'+item2add2bag).value, false);
//   //}
// });
// </script>
// <!-- GTM JS Block :: End -->
