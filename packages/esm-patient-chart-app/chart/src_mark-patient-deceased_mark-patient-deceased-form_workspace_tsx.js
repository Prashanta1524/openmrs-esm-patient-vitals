(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_mark-patient-deceased_mark-patient-deceased-form_workspace_tsx"],{

/***/ "../../node_modules/fuzzy/lib/fuzzy.js":
/*!*********************************************!*\
  !*** ../../node_modules/fuzzy/lib/fuzzy.js ***!
  \*********************************************/
/***/ ((module) => {

/*
 * Fuzzy
 * https://github.com/myork/fuzzy
 *
 * Copyright (c) 2012 Matt York
 * Licensed under the MIT license.
 */

(function() {

var root = this;

var fuzzy = {};

// Use in node or in browser
if (true) {
  module.exports = fuzzy;
} else {}

// Return all elements of `array` that have a fuzzy
// match against `pattern`.
fuzzy.simpleFilter = function(pattern, array) {
  return array.filter(function(str) {
    return fuzzy.test(pattern, str);
  });
};

// Does `pattern` fuzzy match `str`?
fuzzy.test = function(pattern, str) {
  return fuzzy.match(pattern, str) !== null;
};

// If `pattern` matches `str`, wrap each matching character
// in `opts.pre` and `opts.post`. If no match, return null
fuzzy.match = function(pattern, str, opts) {
  opts = opts || {};
  var patternIdx = 0
    , result = []
    , len = str.length
    , totalScore = 0
    , currScore = 0
    // prefix
    , pre = opts.pre || ''
    // suffix
    , post = opts.post || ''
    // String to compare against. This might be a lowercase version of the
    // raw string
    , compareString =  opts.caseSensitive && str || str.toLowerCase()
    , ch;

  pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

  // For each character in the string, either add it to the result
  // or wrap in template if it's the next string in the pattern
  for(var idx = 0; idx < len; idx++) {
    ch = str[idx];
    if(compareString[idx] === pattern[patternIdx]) {
      ch = pre + ch + post;
      patternIdx += 1;

      // consecutive characters should increase the score more than linearly
      currScore += 1 + currScore;
    } else {
      currScore = 0;
    }
    totalScore += currScore;
    result[result.length] = ch;
  }

  // return rendered string if we have a match for every char
  if(patternIdx === pattern.length) {
    // if the string is an exact match with pattern, totalScore should be maxed
    totalScore = (compareString === pattern) ? Infinity : totalScore;
    return {rendered: result.join(''), score: totalScore};
  }

  return null;
};

// The normal entry point. Filters `arr` for matches against `pattern`.
// It returns an array with matching values of the type:
//
//     [{
//         string:   '<b>lah' // The rendered string
//       , index:    2        // The index of the element in `arr`
//       , original: 'blah'   // The original element in `arr`
//     }]
//
// `opts` is an optional argument bag. Details:
//
//    opts = {
//        // string to put before a matching character
//        pre:     '<b>'
//
//        // string to put after matching character
//      , post:    '</b>'
//
//        // Optional function. Input is an entry in the given arr`,
//        // output should be the string to test `pattern` against.
//        // In this example, if `arr = [{crying: 'koala'}]` we would return
//        // 'koala'.
//      , extract: function(arg) { return arg.crying; }
//    }
fuzzy.filter = function(pattern, arr, opts) {
  if(!arr || arr.length === 0) {
    return [];
  }
  if (typeof pattern !== 'string') {
    return arr;
  }
  opts = opts || {};
  return arr
    .reduce(function(prev, element, idx, arr) {
      var str = element;
      if(opts.extract) {
        str = opts.extract(element);
      }
      var rendered = fuzzy.match(pattern, str, opts);
      if(rendered != null) {
        prev[prev.length] = {
            string: rendered.rendered
          , score: rendered.score
          , index: idx
          , original: element
        };
      }
      return prev;
    }, [])

    // Sort by score. Browsers are inconsistent wrt stable/unstable
    // sorting, so force stable by using the index in the case of tie.
    // See http://ofb.net/~sethml/is-sort-stable.html
    .sort(function(a,b) {
      var compare = b.score - a.score;
      if(compare) return compare;
      return a.index - b.index;
    });
};


}());



/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/mark-patient-deceased/mark-patient-deceased-form.scss":
/*!**********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/mark-patient-deceased/mark-patient-deceased-form.scss ***!
  \**********************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: 4rem;\n  --workspace-header-height: 3rem;\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n/* These color variables will be removed in a future release */\n.-esm-patient-chart__mark-patient-deceased-form__container___i0csf {\n  margin: 1rem;\n}\n.-esm-patient-chart__mark-patient-deceased-form__container___i0csf section {\n  margin: 1rem 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__heading___vfFsl {\n  font-size: var(--cds-productive-heading-03-font-size, 1.25rem);\n  font-weight: var(--cds-productive-heading-03-font-weight, 400);\n  line-height: var(--cds-productive-heading-03-line-height, 1.4);\n  letter-spacing: var(--cds-productive-heading-03-letter-spacing, 0);\n  color: #525252;\n  margin: 1rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__sectionTitle___MoR2g {\n  font-size: var(--cds-productive-heading-02-font-size, 1rem);\n  font-weight: var(--cds-productive-heading-02-font-weight, 600);\n  line-height: var(--cds-productive-heading-02-line-height, 1.375);\n  letter-spacing: var(--cds-productive-heading-02-letter-spacing, 0);\n  color: #525252;\n  margin: 0 0 0.5rem 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapper___DhRXo {\n  margin: 0.5rem 0;\n  border: 0.0625rem solid #e0e0e0;\n  background-color: #f4f4f4;\n}\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapper___DhRXo .cds--tile {\n  border: none !important;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__errorOutline___h5NdS {\n  outline: 1px solid #da1e28;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapper___DhRXo div:nth-child(3) > div:nth-child(2) {\n  position: relative;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapper___DhRXo div:nth-child(3) span * {\n  display: none;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__radioButtonGroup___vhZyb {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  margin-top: 0.5rem;\n  min-height: 4rem;\n  width: 100%;\n  font-size: var(--cds-body-short-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-short-01-font-weight, 400);\n  line-height: var(--cds-body-short-01-line-height, 1.28572);\n  letter-spacing: var(--cds-body-short-01-letter-spacing, 0.16px);\n  color: #525252;\n  background-color: #f4f4f4;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__radioButton___QhTm- {\n  padding: 0.25rem 1rem;\n  margin: 0.5rem 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__contentSwitcher___mO-NF {\n  height: 3rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__headerGridRow___THnI2 {\n  border-bottom: 0.0625rem solid #e0e0e0;\n  margin: 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__dataGridRow___6wepc {\n  display: grid;\n  grid-template-columns: 50% 10% 1fr;\n  margin: 0.5rem 1rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__form___JI72L {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__button___3ner\\+ {\n  height: 4rem;\n  display: flex;\n  align-content: flex-start;\n  align-items: baseline;\n  min-width: 50%;\n}\n.-esm-patient-chart__mark-patient-deceased-form__button___3ner\\+ .cds--inline-loading {\n  min-height: 1rem;\n}\n.-esm-patient-chart__mark-patient-deceased-form__button___3ner\\+ .cds--inline-loading__text {\n  font-size: unset;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapperTablet___EgGbS {\n  padding: 1.5rem 1rem;\n  background-color: #ffffff;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapperDesktop___Ra-df {\n  padding: 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__warningContainer___Ga-tH {\n  display: flex;\n  background-color: #fff8e1;\n  padding: 1rem;\n  align-items: center;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__warningIcon___1RaI\\+ {\n  display: flex;\n  align-self: center;\n  fill: #f1c21b;\n  margin-right: 0.5rem;\n  align-self: start;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__warningText___LlBV\\+ {\n  font-size: 0.875rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__datePicker___RQizm {\n  padding-bottom: 0.5rem;\n  width: 100%;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__errorMessage___OU3k5 {\n  font-size: var(--cds-label-02-font-size, 0.875rem);\n  font-weight: var(--cds-label-02-font-weight, 400);\n  line-height: var(--cds-label-02-line-height, 1.28572);\n  letter-spacing: var(--cds-label-02-letter-spacing, 0.16px);\n  color: #da1e28;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__nonCodedCauseOfDeath___kCrgg {\n  margin: 1rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__skeleton___FjLau .cds--structured-list-tbody .cds--structured-list-row:last-child {\n  border-bottom: none;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__tileContainer___Wh6iC {\n  background-color: #ffffff;\n  padding: 3rem 0;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__tile___kn74A {\n  margin: auto;\n  width: fit-content;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__tileContent___TUMbh {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__content___I\\+Mct {\n  font-size: var(--cds-heading-compact-02-font-size, 1rem);\n  font-weight: var(--cds-heading-compact-02-font-weight, 600);\n  line-height: var(--cds-heading-compact-02-line-height, 1.375);\n  letter-spacing: var(--cds-heading-compact-02-letter-spacing, 0);\n  color: #525252;\n  margin-bottom: 0.5rem;\n}\n\n.-esm-patient-chart__mark-patient-deceased-form__helper___mHhaj {\n  font-size: var(--cds-body-compact-01-font-size, 0.875rem);\n  font-weight: var(--cds-body-compact-01-font-weight, 400);\n  line-height: var(--cds-body-compact-01-line-height, 1.28572);\n  letter-spacing: var(--cds-body-compact-01-letter-spacing, 0.16px);\n  color: #525252;\n}", "",{"version":3,"sources":["webpack://./../../node_modules/@openmrs/esm-styleguide/src/_vars.scss","webpack://./src/mark-patient-deceased/mark-patient-deceased-form.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss","webpack://./../../node_modules/@carbon/type/scss/_styles.scss"],"names":[],"mappings":"AAkCA,0EAAA;AAoBA;EACE,mBAAA;EACA,mBAAA;EACA,mBAAA;EACA,yBAAA;EACA,+BAAA;EACA,oGAAA;EACA,2GAAA;ACpDF;;ADgEA,8DAAA;ACrEA;EACE,YC0BW;ADjBb;AAPE;EACE,cAAA;AASJ;;AALA;EEs1BI,8DAAA;EAAA,8DAAA;EAAA,8DAAA;EAAA,kEAAA;EFp1BF,cDPQ;ECQR,YCgBW;ADLb;;AARA;EEg1BI,2DAAA;EAAA,8DAAA;EAAA,gEAAA;EAAA,kEAAA;EF90BF,cDbQ;ECcR,oBAAA;AAcF;;AAXA;EACE,gBAAA;EACA,+BAAA;EACA,yBDzBM;ACuCR;AAZE;EACE,uBAAA;AAcJ;;AAVA;EACE,0BAAA;AAaF;;AAVA;EACE,kBAAA;AAaF;;AAVA;EACE,aAAA;AAaF;;AAVA;EACE,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,kBC7BW;ED8BX,gBCKW;EDJX,WAAA;EE8yBE,uDAAA;EAAA,sDAAA;EAAA,0DAAA;EAAA,+DAAA;EF5yBF,cD/CQ;ECgDR,yBDrDM;ACqER;;AAbA;EACE,qBAAA;EACA,gBAAA;AAgBF;;AAbA;EACE,YCbW;AD6Bb;;AAbA;EACE,sCAAA;EACA,SAAA;AAgBF;;AAbA;EACE,aAAA;EACA,kCAAA;EACA,mBAAA;AAgBF;;AAbA;EACE,aAAA;EACA,sBAAA;EACA,8BAAA;EACA,YAAA;AAgBF;;AAbA;EACE,YC9BW;ED+BX,aAAA;EACA,yBAAA;EACA,qBAAA;EACA,cAAA;AAgBF;AAdE;EACE,gBC9DS;AD8Eb;AAbE;EACE,gBAAA;AAeJ;;AAXA;EACE,oBAAA;EACA,yBDpGM;ACkHR;;AAXA;EACE,UAAA;AAcF;;AAXA;EACE,aAAA;EACA,yBD5FmB;EC6FnB,aClFW;EDmFX,mBAAA;AAcF;;AAXA;EACE,aAAA;EACA,kBAAA;EACA,aDrGmB;ECsGnB,oBCpGW;EDqGX,iBAAA;AAcF;;AAXA;EACE,mBAAA;AAcF;;AAXA;EACE,sBC7GW;ED8GX,WAAA;AAcF;;AAXA;EE4tBI,kDAAA;EAAA,iDAAA;EAAA,qDAAA;EAAA,0DAAA;EF1tBF,cDlHO;ACmIT;;AAdA;EACE,YC7GW;AD8Hb;;AAbE;EACE,mBAAA;AAgBJ;;AAZA;EACE,yBDnJM;ECoJN,eAAA;AAeF;;AAZA;EACE,YAAA;EACA,kBAAA;AAeF;;AAZA;EACE,aAAA;EACA,sBAAA;EACA,mBAAA;AAeF;;AAZA;EE6rBI,wDAAA;EAAA,2DAAA;EAAA,6DAAA;EAAA,+DAAA;EF3rBF,cDhKQ;ECiKR,qBCnJW;ADqKb;;AAfA;EEurBI,yDAAA;EAAA,wDAAA;EAAA,4DAAA;EAAA,iEAAA;EFrrBF,cDtKQ;AC2LV","sourcesContent":["@use '@carbon/layout';\n\n$ui-01: #f4f4f4;\n$ui-02: #ffffff;\n$ui-03: #e0e0e0;\n$ui-04: #8d8d8d;\n$ui-05: #161616;\n$text-02: #525252;\n$text-03: #a8a8a8;\n$ui-background: #ffffff;\n$color-gray-30: #c6c6c6;\n$color-gray-70: #525252;\n$color-gray-100: #161616;\n$color-blue-60-2: #0f62fe;\n$color-blue-10: #edf5ff;\n$color-yellow-50: #feecae;\n$carbon--red-50: #fa4d56;\n$inverse-link: #78a9ff;\n$support-02: #24a148;\n$inverse-support-03: #f1c21b;\n$warning-background: #fff8e1;\n$openmrs-background-grey: #f4f4f4;\n$danger: #da1e28;\n$interactive-01: #0f62fe;\n$field-01: #f4f4f4;\n$grey-2: #e0e0e0;\n$labeldropdown: #c6c6c6;\n\n$brand-primary-10: #d9fbfb;\n$brand-primary-20: #9ef0f0;\n$brand-primary-30: #3ddbd9;\n$brand-primary-40: #08bdba;\n$brand-primary-50: #009d9a;\n\n/* 60,70 and 80 are already declared as brand-01, 02 and 03 respectively */\n\n$brand-primary-90: #022b30;\n$brand-primary-100: #081a1c;\n\n@mixin brand-01($property) {\n  #{$property}: #005d5d;\n  #{$property}: var(--brand-01);\n}\n\n@mixin brand-02($property) {\n  #{$property}: #004144;\n  #{$property}: var(--brand-02);\n}\n\n@mixin brand-03($property) {\n  #{$property}: #007d79;\n  #{$property}: var(--brand-03);\n}\n\n:root {\n  --brand-01: #005d5d;\n  --brand-02: #004144;\n  --brand-03: #007d79;\n  --bottom-nav-height: #{layout.$spacing-10};\n  --workspace-header-height: #{layout.$spacing-09};\n  --tablet-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--bottom-nav-height));\n  --desktop-workspace-window-height: calc(100vh - var(--omrs-navbar-height) - var(--workspace-header-height));\n}\n\n$breakpoint-phone-min: 0px;\n$breakpoint-phone-max: 600px;\n$breakpoint-tablet-min: 601px;\n$breakpoint-tablet-max: 1023px;\n$breakpoint-small-desktop-min: 1024px;\n$breakpoint-small-desktop-max: 1439px;\n$breakpoint-large-desktop-min: 1440px;\n$breakpoint-large-desktop-max: 99999999px;\n\n/* These color variables will be removed in a future release */\n$brand-teal-01: #007d79;\n$brand-01: #005d5d;\n$brand-02: #004144;\n","@use '@carbon/layout';\n@use '@carbon/type';\n@use '~@openmrs/esm-styleguide/src/vars' as *;\n\n.container {\n  margin: layout.$spacing-05;\n\n  & section {\n    margin: layout.$spacing-05 0;\n  }\n}\n\n.heading {\n  @include type.type-style('productive-heading-03');\n  color: $text-02;\n  margin: layout.$spacing-05;\n}\n\n.sectionTitle {\n  @include type.type-style('productive-heading-02');\n  color: $text-02;\n  margin: 0 0 layout.$spacing-03 0;\n}\n\n.conceptAnswerOverviewWrapper {\n  margin: layout.$spacing-03 0;\n  border: 0.0625rem solid $grey-2;\n  background-color: $ui-01;\n\n  :global(.cds--tile) {\n    border: none !important;\n  }\n}\n\n.errorOutline {\n  outline: 1px solid $danger;\n}\n\n.conceptAnswerOverviewWrapper div:nth-child(3) > div:nth-child(2) {\n  position: relative;\n}\n\n.conceptAnswerOverviewWrapper div:nth-child(3) span * {\n  display: none;\n}\n\n.radioButtonGroup {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  margin-top: layout.$spacing-03;\n  min-height: layout.$spacing-10;\n  width: 100%;\n  @include type.type-style('body-short-01');\n  color: $text-02;\n  background-color: $ui-01;\n}\n\n.radioButton {\n  padding: layout.$spacing-02 layout.$spacing-05;\n  margin: layout.$spacing-03 0;\n}\n\n.contentSwitcher {\n  height: layout.$spacing-09;\n}\n\n.headerGridRow {\n  border-bottom: 0.0625rem solid $grey-2;\n  margin: 0;\n}\n\n.dataGridRow {\n  display: grid;\n  grid-template-columns: 50% 10% 1fr;\n  margin: layout.$spacing-03 layout.$spacing-05;\n}\n\n.form {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  height: 100%;\n}\n\n.button {\n  height: layout.$spacing-10;\n  display: flex;\n  align-content: flex-start;\n  align-items: baseline;\n  min-width: 50%;\n\n  :global(.cds--inline-loading) {\n    min-height: layout.$spacing-05;\n  }\n\n  :global(.cds--inline-loading__text) {\n    font-size: unset;\n  }\n}\n\n.conceptAnswerOverviewWrapperTablet {\n  padding: layout.$spacing-06 layout.$spacing-05;\n  background-color: $ui-02;\n}\n\n.conceptAnswerOverviewWrapperDesktop {\n  padding: 0;\n}\n\n.warningContainer {\n  display: flex;\n  background-color: $warning-background;\n  padding: layout.$spacing-05;\n  align-items: center;\n}\n\n.warningIcon {\n  display: flex;\n  align-self: center;\n  fill: $inverse-support-03;\n  margin-right: layout.$spacing-03;\n  align-self: start;\n}\n\n.warningText {\n  font-size: 0.875rem;\n}\n\n.datePicker {\n  padding-bottom: layout.$spacing-03;\n  width: 100%;\n}\n\n.errorMessage {\n  @include type.type-style('label-02');\n  color: $danger;\n}\n\n.nonCodedCauseOfDeath {\n  margin: layout.$spacing-05;\n}\n\n.skeleton {\n  :global(.cds--structured-list-tbody .cds--structured-list-row:last-child) {\n    border-bottom: none;\n  }\n}\n\n.tileContainer {\n  background-color: $ui-02;\n  padding: layout.$spacing-09 0;\n}\n\n.tile {\n  margin: auto;\n  width: fit-content;\n}\n\n.tileContent {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.content {\n  @include type.type-style('heading-compact-02');\n  color: $text-02;\n  margin-bottom: layout.$spacing-03;\n}\n\n.helper {\n  @include type.type-style('body-compact-01');\n  color: $text-02;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n","//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n// stylelint-disable number-max-precision\n\n@use 'sass:map';\n@use 'sass:math';\n@use '@carbon/grid/scss/config' as gridconfig;\n@use '@carbon/grid/scss/breakpoint' as grid;\n@use 'prefix' as *;\n@use 'font-family';\n@use 'scale';\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$caption-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$label-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-01: (\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$legal-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-01: (\n  font-size: scale.type-scale(1),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @deprecated\n/// @group @carbon/type\n$helper-text-02: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-01: $body-short-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-01: $body-long-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-short-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-compact-02: $body-short-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-long-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$body-02: $body-long-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-01: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(1),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.33333,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$code-02: (\n  font-family: font-family.font-family('mono'),\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.42857,\n  letter-spacing: 0.32px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.42857,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-01: (\n  font-size: scale.type-scale(2),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.28572,\n  letter-spacing: 0.16px,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-01: $productive-heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.5,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-02: (\n  font-size: scale.type-scale(3),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.375,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-compact-02: $productive-heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-03: $productive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-04: $productive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-05: $productive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-06: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  // Extra digit needed for precision in Chrome\n  line-height: 1.199,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-06: $productive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$productive-heading-07: (\n  font-size: scale.type-scale(12),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$heading-07: $productive-heading-07 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-01: $heading-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-02: $heading-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-03: (\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.4,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(5),\n      line-height: 1.4,\n    ),\n    max: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-03: $expressive-heading-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-04: (\n  font-size: scale.type-scale(7),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.28572,\n  letter-spacing: 0,\n  breakpoints: (\n    xlg: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n      font-weight: font-family.font-weight('regular'),\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      font-weight: font-family.font-weight('regular'),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-04: $expressive-heading-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-05: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      font-weight: font-family.font-weight('light'),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-05: $expressive-heading-05 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-heading-06: (\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-heading-06: $expressive-heading-06 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$expressive-paragraph-01: (\n  font-size: scale.type-scale(6),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.334,\n  letter-spacing: 0,\n  breakpoints: (\n    lg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n);\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-paragraph-01: $expressive-paragraph-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-01: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(5),\n  font-weight: font-family.font-weight('regular'),\n  line-height: 1.3,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(5),\n    ),\n    lg: (\n      font-size: scale.type-scale(6),\n      line-height: 1.334,\n    ),\n    xlg: (\n      font-size: scale.type-scale(7),\n      line-height: 1.28572,\n    ),\n    max: (\n      font-size: scale.type-scale(8),\n      line-height: 1.25,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-01: $quotation-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$quotation-02: (\n  font-family: font-family.font-family('serif'),\n  font-size: scale.type-scale(8),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.25,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(9),\n      line-height: 1.22,\n    ),\n    lg: (\n      font-size: scale.type-scale(10),\n      line-height: 1.19,\n    ),\n    xlg: (\n      font-size: scale.type-scale(11),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(13),\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-quotation-02: $quotation-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-01: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.17,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-01: $display-01 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-02: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('semibold'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(10),\n    ),\n    lg: (\n      font-size: scale.type-scale(12),\n    ),\n    xlg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n    ),\n    max: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-02: $display-02 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-03: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(12),\n      line-height: 1.18,\n    ),\n    lg: (\n      font-size: scale.type-scale(13),\n      line-height: 1.16,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(15),\n      line-height: 1.13,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(16),\n      line-height: 1.11,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-03: $display-03 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$display-04: (\n  font-size: scale.type-scale(10),\n  font-weight: font-family.font-weight('light'),\n  line-height: 1.19,\n  letter-spacing: 0,\n  breakpoints: (\n    md: (\n      font-size: scale.type-scale(14),\n      line-height: 1.15,\n    ),\n    lg: (\n      font-size: scale.type-scale(17),\n      line-height: 1.11,\n      letter-spacing: -0.64px,\n    ),\n    xlg: (\n      font-size: scale.type-scale(20),\n      line-height: 1.07,\n      letter-spacing: -0.64px,\n    ),\n    max: (\n      font-size: scale.type-scale(23),\n      line-height: 1.05,\n      letter-spacing: -0.96px,\n    ),\n  ),\n) !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$fluid-display-04: $display-04 !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/type\n$tokens: (\n  caption-01: $caption-01,\n  caption-02: $caption-02,\n  label-01: $label-01,\n  label-02: $label-02,\n  helper-text-01: $helper-text-01,\n  helper-text-02: $helper-text-02,\n  body-short-01: $body-short-01,\n  body-short-02: $body-short-02,\n  body-long-01: $body-long-01,\n  body-long-02: $body-long-02,\n  code-01: $code-01,\n  code-02: $code-02,\n  heading-01: $heading-01,\n  heading-02: $heading-02,\n  productive-heading-01: $productive-heading-01,\n  productive-heading-02: $productive-heading-02,\n  productive-heading-03: $productive-heading-03,\n  productive-heading-04: $productive-heading-04,\n  productive-heading-05: $productive-heading-05,\n  productive-heading-06: $productive-heading-06,\n  productive-heading-07: $productive-heading-07,\n  expressive-paragraph-01: $expressive-paragraph-01,\n  expressive-heading-01: $expressive-heading-01,\n  expressive-heading-02: $expressive-heading-02,\n  expressive-heading-03: $expressive-heading-03,\n  expressive-heading-04: $expressive-heading-04,\n  expressive-heading-05: $expressive-heading-05,\n  expressive-heading-06: $expressive-heading-06,\n  quotation-01: $quotation-01,\n  quotation-02: $quotation-02,\n  display-01: $display-01,\n  display-02: $display-02,\n  display-03: $display-03,\n  display-04: $display-04,\n  // V11 Tokens\n  legal-01: $legal-01,\n  legal-02: $legal-02,\n  body-compact-01: $body-compact-01,\n  body-compact-02: $body-compact-02,\n  heading-compact-01: $heading-compact-01,\n  heading-compact-02: $heading-compact-02,\n  body-01: $body-01,\n  body-02: $body-02,\n  heading-03: $heading-03,\n  heading-04: $heading-04,\n  heading-05: $heading-05,\n  heading-06: $heading-06,\n  heading-07: $heading-07,\n  fluid-heading-03: $fluid-heading-03,\n  fluid-heading-04: $fluid-heading-04,\n  fluid-heading-05: $fluid-heading-05,\n  fluid-heading-06: $fluid-heading-06,\n  fluid-paragraph-01: $fluid-paragraph-01,\n  fluid-quotation-01: $fluid-quotation-01,\n  fluid-quotation-02: $fluid-quotation-02,\n  fluid-display-01: $fluid-display-01,\n  fluid-display-02: $fluid-display-02,\n  fluid-display-03: $fluid-display-03,\n  fluid-display-04: $fluid-display-04,\n) !default;\n\n/// @param {Map} $map\n/// @access public\n/// @group @carbon/type\n@mixin properties($map) {\n  @each $name, $value in $map {\n    #{$name}: $value;\n  }\n}\n\n/// @param {Number} $value - Number with units\n/// @return {Number} Without units\n/// @access public\n/// @group @carbon/type\n@function strip-unit($value) {\n  @return math.div($value, $value * 0 + 1);\n}\n\n/// This helper includes fluid type styles for the given token value. Fluid type\n/// means that the `font-size` is computed using `calc()` in order to be\n/// determined by the screen size instead of a breakpoint. As a result, fluid\n/// styles should be used with caution in fixed width contexts.\n///\n/// In addition, we make use of %-based line-heights so that the line-height of\n/// each type style is computed correctly due to the dynamic nature of the\n/// `font-size`.\n///\n/// Most of the logic for this work comes from CSS Tricks:\n/// https://css-tricks.com/snippets/css/fluid-typography/\n///\n/// @param {Map} $type-styles - The value of a given type token\n/// @param {Map} $breakpoints [$grid-breakpoints] - Custom breakpoints to use\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type($type-styles, $breakpoints: gridconfig.$grid-breakpoints) {\n  // Include the initial styles for the given token by default without any\n  // media query guard. This includes `font-size` as a fallback in the case\n  // that a browser does not support `calc()`\n  @include properties(map.remove($type-styles, breakpoints));\n  // We also need to include the `sm` styles by default since they don't\n  // appear in the fluid styles for tokens\n  @include fluid-type-size($type-styles, sm, $breakpoints);\n\n  // Finally, we need to go through all the breakpoints defined in the type\n  // token and apply the properties and fluid type size for that given\n  // breakpoint\n  @each $name, $values in map.get($type-styles, breakpoints) {\n    @include grid.breakpoint($name) {\n      @include properties($values);\n      @include fluid-type-size($type-styles, $name, $breakpoints);\n    }\n  }\n}\n\n/// Computes the fluid `font-size` for a given type style and breakpoint\n/// @param {Map} $type-styles - The styles for a given token\n/// @param {String} $name - The name of the breakpoint to which we apply the fluid\n/// @param {Map} $breakpoints [$grid-breakpoints] - The breakpoints for the grid system\n/// @access public\n/// @group @carbon/type\n@mixin fluid-type-size(\n  $type-styles,\n  $name,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  // Get the information about the breakpoint we're currently working in. Useful\n  // for getting initial width information\n  $breakpoint: map.get($breakpoints, $name);\n\n  // Our fluid styles are captured under the 'breakpoints' property in our type\n  // styles map. These define what values to treat as `max-` variables below\n  $fluid-sizes: map.get($type-styles, breakpoints);\n  $fluid-breakpoint: ();\n  // Special case for `sm` because the styles for small are on the type style\n  // directly\n  @if $name == sm {\n    $fluid-breakpoint: map.remove($type-styles, breakpoints);\n  } @else {\n    $fluid-breakpoint: map.get($fluid-sizes, $name);\n  }\n\n  // Initialize our font-sizes to the default size for the type style\n  $max-font-size: map.get($type-styles, font-size);\n  $min-font-size: map.get($type-styles, font-size);\n  @if map.has-key($fluid-breakpoint, font-size) {\n    $min-font-size: map.get($fluid-breakpoint, font-size);\n  }\n\n  // Initialize our min and max width to the width of the current breakpoint\n  $max-vw: map.get($breakpoint, width);\n  $min-vw: map.get($breakpoint, width);\n\n  // We can use `breakpoint-next` to see if there is another breakpoint we can\n  // use to update `max-font-size` and `max-vw` with larger values\n  $next-breakpoint-available: grid.breakpoint-next($name, $breakpoints);\n  $next-fluid-breakpoint-name: null;\n\n  // We need to figure out what the next available fluid breakpoint is for our\n  // given $type-styles. In this loop we try and iterate through breakpoints\n  // until we either manually set $next-breakpoint-available to null or\n  // `breakpoint-next` returns null.\n  @while $next-breakpoint-available {\n    @if map.has-key($fluid-sizes, $next-breakpoint-available) {\n      $next-fluid-breakpoint-name: $next-breakpoint-available;\n      $next-breakpoint-available: null;\n    } @else {\n      $next-breakpoint-available: grid.breakpoint-next(\n        $next-breakpoint-available,\n        $breakpoints\n      );\n    }\n  }\n\n  // If we have found the next available fluid breakpoint name, then we know\n  // that we have values that we can use to set max-font-size and max-vw as both\n  // values derive from the next breakpoint\n  @if $next-fluid-breakpoint-name {\n    $next-fluid-breakpoint: map.get($breakpoints, $next-fluid-breakpoint-name);\n    $max-font-size: map.get(\n      map.get($fluid-sizes, $next-fluid-breakpoint-name),\n      font-size\n    );\n    $max-vw: map.get($next-fluid-breakpoint, width);\n\n    // prettier-ignore\n    font-size: calc(#{$min-font-size} +\n      #{strip-unit($max-font-size - $min-font-size)} *\n      ((100vw - #{$min-vw}) / #{strip-unit($max-vw - $min-vw)})\n    );\n  } @else {\n    // Otherwise, just default to setting the font size found from the type\n    // style or the given fluid breakpoint in the type style\n    font-size: $min-font-size;\n  }\n}\n\n// TODO move following variable and `custom-property` mixin into shared file for\n// both `@carbon/type` and `@carbon/themes`\n\n/// @access private\n/// @group @carbon/type\n@mixin custom-properties($name, $value) {\n  @each $property, $value in $value {\n    #{$property}: var(\n      --#{$custom-property-prefix}-#{$name}-#{$property},\n      #{$value}\n    );\n  }\n}\n\n/// Helper mixin to include the styles for a given token in any selector in your\n/// project. Also includes an optional fluid option that will enable fluid\n/// styles for the token if they are defined. Fluid styles will cause the\n/// token's font-size to be computed based on the viewport size. As a result, use\n/// with caution in fixed contexts.\n/// @param {String} $name - The name of the token to get the styles for\n/// @param {Boolean} $fluid [false] - Specify whether to include fluid styles for the\n/// @param {Map} $breakpoints [$grid-breakpoints] - Provide a custom breakpoint map to use\n/// @access public\n/// @group @carbon/type\n@mixin type-style(\n  $name,\n  $fluid: false,\n  $breakpoints: gridconfig.$grid-breakpoints\n) {\n  @if not map.has-key($tokens, $name) {\n    @error 'Unable to find a token with the name: `#{$name}`';\n  }\n\n  $token: map.get($tokens, $name);\n\n  // If $fluid is set to true and the token has breakpoints defined for fluid\n  // styles, delegate to the fluid-type helper for the given token\n  @if $fluid == true and map.has-key($token, 'breakpoints') {\n    @include fluid-type($token, $breakpoints);\n  } @else {\n    @include custom-properties($name, $token);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"container": "-esm-patient-chart__mark-patient-deceased-form__container___i0csf",
	"heading": "-esm-patient-chart__mark-patient-deceased-form__heading___vfFsl",
	"sectionTitle": "-esm-patient-chart__mark-patient-deceased-form__sectionTitle___MoR2g",
	"conceptAnswerOverviewWrapper": "-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapper___DhRXo",
	"errorOutline": "-esm-patient-chart__mark-patient-deceased-form__errorOutline___h5NdS",
	"radioButtonGroup": "-esm-patient-chart__mark-patient-deceased-form__radioButtonGroup___vhZyb",
	"radioButton": "-esm-patient-chart__mark-patient-deceased-form__radioButton___QhTm-",
	"contentSwitcher": "-esm-patient-chart__mark-patient-deceased-form__contentSwitcher___mO-NF",
	"headerGridRow": "-esm-patient-chart__mark-patient-deceased-form__headerGridRow___THnI2",
	"dataGridRow": "-esm-patient-chart__mark-patient-deceased-form__dataGridRow___6wepc",
	"form": "-esm-patient-chart__mark-patient-deceased-form__form___JI72L",
	"button": "-esm-patient-chart__mark-patient-deceased-form__button___3ner+",
	"conceptAnswerOverviewWrapperTablet": "-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapperTablet___EgGbS",
	"conceptAnswerOverviewWrapperDesktop": "-esm-patient-chart__mark-patient-deceased-form__conceptAnswerOverviewWrapperDesktop___Ra-df",
	"warningContainer": "-esm-patient-chart__mark-patient-deceased-form__warningContainer___Ga-tH",
	"warningIcon": "-esm-patient-chart__mark-patient-deceased-form__warningIcon___1RaI+",
	"warningText": "-esm-patient-chart__mark-patient-deceased-form__warningText___LlBV+",
	"datePicker": "-esm-patient-chart__mark-patient-deceased-form__datePicker___RQizm",
	"errorMessage": "-esm-patient-chart__mark-patient-deceased-form__errorMessage___OU3k5",
	"nonCodedCauseOfDeath": "-esm-patient-chart__mark-patient-deceased-form__nonCodedCauseOfDeath___kCrgg",
	"skeleton": "-esm-patient-chart__mark-patient-deceased-form__skeleton___FjLau",
	"tileContainer": "-esm-patient-chart__mark-patient-deceased-form__tileContainer___Wh6iC",
	"tile": "-esm-patient-chart__mark-patient-deceased-form__tile___kn74A",
	"tileContent": "-esm-patient-chart__mark-patient-deceased-form__tileContent___TUMbh",
	"content": "-esm-patient-chart__mark-patient-deceased-form__content___I+Mct",
	"helper": "-esm-patient-chart__mark-patient-deceased-form__helper___mHhaj"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/mark-patient-deceased/mark-patient-deceased-form.scss":
/*!*******************************************************************!*\
  !*** ./src/mark-patient-deceased/mark-patient-deceased-form.scss ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./mark-patient-deceased-form.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/mark-patient-deceased/mark-patient-deceased-form.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
    var isEqualLocals = function isEqualLocals(a, b, isNamedExport) {
  if (!a && b || a && !b) {
    return false;
  }
  var p;
  for (p in a) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (a[p] !== b[p]) {
      return false;
    }
  }
  for (p in b) {
    if (isNamedExport && p === "default") {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!a[p]) {
      return false;
    }
  }
  return true;
};
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./mark-patient-deceased-form.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/mark-patient-deceased/mark-patient-deceased-form.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./mark-patient-deceased-form.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/mark-patient-deceased/mark-patient-deceased-form.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/data.resource.ts":
/*!******************************!*\
  !*** ./src/data.resource.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   markPatientAlive: () => (/* binding */ markPatientAlive),
/* harmony export */   markPatientDeceased: () => (/* binding */ markPatientDeceased),
/* harmony export */   useCauseOfDeathConcept: () => (/* binding */ useCauseOfDeathConcept),
/* harmony export */   useCausesOfDeath: () => (/* binding */ useCausesOfDeath),
/* harmony export */   useConceptAnswers: () => (/* binding */ useConceptAnswers)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var swr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! swr */ "../../node_modules/swr/dist/index/index.mjs");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}



function useCausesOfDeath() {
    var _useCauseOfDeathConcept = useCauseOfDeathConcept(), isCauseOfDeathLoading = _useCauseOfDeathConcept.isCauseOfDeathLoading, isCauseOfDeathValidating = _useCauseOfDeathConcept.isCauseOfDeathValidating, causeOfDeathConcept = _useCauseOfDeathConcept.value;
    var _useConceptAnswers = useConceptAnswers(causeOfDeathConcept), isConceptLoading = _useConceptAnswers.isConceptLoading, isConceptAnswerValidating = _useConceptAnswers.isConceptAnswerValidating, conceptAnswers = _useConceptAnswers.conceptAnswers;
    return {
        causesOfDeath: conceptAnswers,
        isLoading: isCauseOfDeathLoading || isConceptLoading,
        isValidating: isConceptAnswerValidating || isCauseOfDeathValidating
    };
}
var changePatientDeathStatus = function(personUuid, payload) {
    var abortController = new AbortController();
    return (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.openmrsFetch)("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/person/").concat(personUuid), {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: payload,
        signal: abortController.signal
    });
};
function markPatientDeceased(deceasedDate, personUuid, selectedCauseOfDeathValue, nonCodedCauseOfDeath) {
    var payload = _object_spread({
        dead: true,
        deathDate: deceasedDate || null
    }, nonCodedCauseOfDeath ? {
        causeOfDeathNonCoded: nonCodedCauseOfDeath
    } : {
        causeOfDeath: selectedCauseOfDeathValue
    });
    return changePatientDeathStatus(personUuid, payload);
}
function markPatientAlive(personUuid) {
    return changePatientDeathStatus(personUuid, {
        causeOfDeath: null,
        causeOfDeathNonCoded: null,
        dead: false,
        deathDate: null
    });
}
function useConceptAnswers(conceptUuid) {
    var _data_data;
    var _useSWR = (0,swr__WEBPACK_IMPORTED_MODULE_2__["default"])("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/concept/").concat(conceptUuid), function(url) {
        return conceptUuid ? (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.openmrsFetch)(url) : undefined;
    }, {
        shouldRetryOnError: function shouldRetryOnError(err) {
            return _instanceof(err, Response) && err.status !== 404;
        }
    }), data = _useSWR.data, error = _useSWR.error, isLoading = _useSWR.isLoading, isValidating = _useSWR.isValidating;
    var _data_data_answers;
    return {
        conceptAnswers: (_data_data_answers = data === null || data === void 0 ? void 0 : (_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.answers) !== null && _data_data_answers !== void 0 ? _data_data_answers : [],
        isConceptLoading: isLoading,
        conceptError: error,
        isConceptAnswerValidating: isValidating
    };
}
function useCauseOfDeathConcept() {
    var _data_data;
    var _useSWR = (0,swr__WEBPACK_IMPORTED_MODULE_2__["default"])("".concat(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.restBaseUrl, "/systemsetting/concept.causeOfDeath"), _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.openmrsFetch, {
        shouldRetryOnError: function shouldRetryOnError(err) {
            return _instanceof(err, Response) && err.status !== 404;
        }
    }), data = _useSWR.data, error = _useSWR.error, isLoading = _useSWR.isLoading, isValidating = _useSWR.isValidating;
    var result = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        var _data_data;
        var _data_data_value;
        return {
            value: (_data_data_value = data === null || data === void 0 ? void 0 : (_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.value) !== null && _data_data_value !== void 0 ? _data_data_value : undefined,
            isCauseOfDeathLoading: isLoading,
            isCauseOfDeathValidating: isValidating,
            error: error
        };
    }, [
        data === null || data === void 0 ? void 0 : (_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.value,
        error,
        isLoading,
        isValidating
    ]);
    return result;
}


/***/ }),

/***/ "./src/mark-patient-deceased/mark-patient-deceased-form.workspace.tsx":
/*!****************************************************************************!*\
  !*** ./src/mark-patient-deceased/mark-patient-deceased-form.workspace.tsx ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fuzzy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fuzzy */ "../../node_modules/fuzzy/lib/fuzzy.js");
/* harmony import */ var fuzzy__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fuzzy__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-hook-form */ "../../node_modules/react-hook-form/dist/index.esm.mjs");
/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! zod */ "../../node_modules/zod/v3/types.js");
/* harmony import */ var _hookform_resolvers_zod__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @hookform/resolvers/zod */ "../../node_modules/@hookform/resolvers/zod/dist/zod.mjs");
/* harmony import */ var _carbon_react_icons__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @carbon/react/icons */ "../../node_modules/@carbon/icons-react/es/generated/bucket-19.js");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _data_resource__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../data.resource */ "./src/data.resource.ts");
/* harmony import */ var _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./mark-patient-deceased-form.scss */ "./src/mark-patient-deceased/mark-patient-deceased-form.scss");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}













var MarkPatientDeceasedForm = function(param) {
    var closeWorkspace = param.closeWorkspace, patientUuid = param.patientUuid;
    var _errors_causeOfDeath, _errors_causeOfDeath1;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var isTablet = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.useLayoutType)() === 'tablet';
    var memoizedPatientUuid = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return {
            patientUuid: patientUuid
        };
    }, [
        patientUuid
    ]);
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(''), 2), searchTerm = _useState[0], setSearchTerm = _useState[1];
    var _useCausesOfDeath = (0,_data_resource__WEBPACK_IMPORTED_MODULE_8__.useCausesOfDeath)(), causesOfDeath = _useCausesOfDeath.causesOfDeath, isLoadingCausesOfDeath = _useCausesOfDeath.isLoading;
    var freeTextFieldConceptUuid = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.useConfig)().freeTextFieldConceptUuid;
    var filteredCausesOfDeath = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        if (!searchTerm) {
            return causesOfDeath;
        }
        return searchTerm ? fuzzy__WEBPACK_IMPORTED_MODULE_2___default().filter(searchTerm, causesOfDeath, {
            extract: function(causeOfDeathConcept) {
                return causeOfDeathConcept.display;
            }
        }).sort(function(r1, r2) {
            return r1.score - r2.score;
        }).map(function(result) {
            return result.original;
        }) : causesOfDeath;
    }, [
        searchTerm,
        causesOfDeath
    ]);
    var handleSearchTermChange = function(event) {
        setSearchTerm(event.target.value);
    };
    var schema = zod__WEBPACK_IMPORTED_MODULE_10__.object({
        causeOfDeath: zod__WEBPACK_IMPORTED_MODULE_10__.string().refine(function(causeOfDeath) {
            return !!causeOfDeath;
        }, {
            message: t('causeOfDeathIsRequired', 'Please select the cause of death')
        }),
        deathDate: zod__WEBPACK_IMPORTED_MODULE_10__.date().refine(function(date) {
            return !!date;
        }, {
            message: t('deathDateRequired', 'Please select the date of death')
        }),
        nonCodedCauseOfDeath: zod__WEBPACK_IMPORTED_MODULE_10__.string().optional()
    }).refine(function(data) {
        return !(data.causeOfDeath === freeTextFieldConceptUuid && !data.nonCodedCauseOfDeath);
    }, {
        message: t('nonCodedCauseOfDeathRequired', 'Please enter the non-coded cause of death'),
        path: [
            'nonCodedCauseOfDeath'
        ]
    });
    var _useForm = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_11__.useForm)({
        mode: 'onSubmit',
        resolver: (0,_hookform_resolvers_zod__WEBPACK_IMPORTED_MODULE_5__.zodResolver)(schema),
        defaultValues: {
            causeOfDeath: '',
            deathDate: new Date(),
            nonCodedCauseOfDeath: ''
        }
    }), control = _useForm.control, _useForm_formState = _useForm.formState, errors = _useForm_formState.errors, isSubmitting = _useForm_formState.isSubmitting, handleSubmit = _useForm.handleSubmit, watch = _useForm.watch;
    var causeOfDeathValue = watch('causeOfDeath');
    var onSubmit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function(data) {
        var causeOfDeath = data.causeOfDeath, deathDate = data.deathDate, nonCodedCauseOfDeath = data.nonCodedCauseOfDeath;
        (0,_data_resource__WEBPACK_IMPORTED_MODULE_8__.markPatientDeceased)(deathDate, patientUuid, causeOfDeath, nonCodedCauseOfDeath).then(function() {
            closeWorkspace();
            window.location.reload();
        }).catch(function(error) {
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.showSnackbar)({
                kind: 'error',
                isLowContrast: false,
                subtitle: error === null || error === void 0 ? void 0 : error.message,
                title: t('errorMarkingPatientDeceased', 'Error marking patient deceased')
            });
        });
    }, [
        closeWorkspace,
        patientUuid,
        t
    ]);
    var onError = function(errors) {
        return console.error(errors);
    };
    var _obj, _obj1;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Form, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].form,
        onSubmit: handleSubmit(onSubmit, onError)
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, isTablet && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Row, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].headerGridRow
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.ExtensionSlot, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].dataGridRow,
        name: "visit-form-header-slot",
        state: memoizedPatientUuid
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].container
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].warningContainer
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react_icons__WEBPACK_IMPORTED_MODULE_12__.WarningFilled, {
        "aria-label": t('warning', 'Warning'),
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].warningIcon,
        size: 20
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].warningText
    }, t('markDeceasedWarning', 'Marking the patient as deceased will end any active visits for this patient'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sectionTitle
    }, t('dateOfDeath', 'Date of death')), (causesOfDeath === null || causesOfDeath === void 0 ? void 0 : causesOfDeath.length) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.ResponsiveWrapper, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_11__.Controller, {
        name: "deathDate",
        control: control,
        render: function(param) {
            var field = param.field, fieldState = param.fieldState;
            var _fieldState_error, _fieldState_error1;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.OpenmrsDatePicker, _object_spread_props(_object_spread({}, field), {
                className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].datePicker,
                id: "deceasedDate",
                "data-testid": "deceasedDate",
                labelText: t('date', 'Date'),
                maxDate: new Date(),
                invalid: Boolean(fieldState === null || fieldState === void 0 ? void 0 : (_fieldState_error = fieldState.error) === null || _fieldState_error === void 0 ? void 0 : _fieldState_error.message),
                invalidText: fieldState === null || fieldState === void 0 ? void 0 : (_fieldState_error1 = fieldState.error) === null || _fieldState_error1 === void 0 ? void 0 : _fieldState_error1.message
            }));
        }
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.DatePickerSkeleton, null)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("section", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sectionTitle
    }, t('causeOfDeath', 'Cause of death')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(_mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].conceptAnswerOverviewWrapper, (_obj = {}, _define_property(_obj, _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].conceptAnswerOverviewWrapperTablet, isTablet), _define_property(_obj, _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].conceptAnswerOverviewWrapperDesktop, !isTablet), _define_property(_obj, _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].errorOutline, errors === null || errors === void 0 ? void 0 : (_errors_causeOfDeath = errors.causeOfDeath) === null || _errors_causeOfDeath === void 0 ? void 0 : _errors_causeOfDeath.message), _obj))
    }, isLoadingCausesOfDeath ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.StructuredListSkeleton, null) : null, (causesOfDeath === null || causesOfDeath === void 0 ? void 0 : causesOfDeath.length) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_7__.ResponsiveWrapper, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Search, {
        labelText: t('searchForCauseOfDeath', 'Search for a cause of death'),
        onChange: handleSearchTermChange,
        placeholder: t('searchForCauseOfDeath', 'Search for a cause of death')
    })) : null, (causesOfDeath === null || causesOfDeath === void 0 ? void 0 : causesOfDeath.length) && filteredCausesOfDeath.length > 0 ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_11__.Controller, {
        name: "causeOfDeath",
        control: control,
        render: function(param) {
            var onChange = param.field.onChange;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.RadioButtonGroup, {
                className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].radioButtonGroup,
                name: causeOfDeathValue === freeTextFieldConceptUuid ? 'freeTextFieldCauseOfDeath' : 'codedCauseOfDeath',
                orientation: "vertical",
                onChange: onChange
            }, filteredCausesOfDeath.map(function(param) {
                var uuid = param.uuid, display = param.display, name = param.name;
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.RadioButton, {
                    className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].radioButton,
                    id: name,
                    key: uuid,
                    labelText: display,
                    value: uuid
                });
            }));
        }
    }) : null, searchTerm && filteredCausesOfDeath.length === 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].tileContainer
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Tile, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].tile
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].tileContent
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].content
    }, t('noMatchingCodedCausesOfDeath', 'No matching coded causes of death')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].helper
    }, t('checkFilters', 'Check the filters above'))))), !isLoadingCausesOfDeath && !(causesOfDeath === null || causesOfDeath === void 0 ? void 0 : causesOfDeath.length) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_6__.EmptyState, {
        displayText: t('causeOfDeath_lower', 'cause of death concepts configured in the system'),
        headerTitle: t('causeOfDeath', 'Cause of death')
    }) : null), (errors === null || errors === void 0 ? void 0 : errors.causeOfDeath) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].errorMessage
    }, errors === null || errors === void 0 ? void 0 : (_errors_causeOfDeath1 = errors.causeOfDeath) === null || _errors_causeOfDeath1 === void 0 ? void 0 : _errors_causeOfDeath1.message))), causeOfDeathValue === freeTextFieldConceptUuid && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].nonCodedCauseOfDeath
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_hook_form__WEBPACK_IMPORTED_MODULE_11__.Controller, {
        name: "nonCodedCauseOfDeath",
        control: control,
        render: function(param) {
            var _param_field = param.field, onChange = _param_field.onChange, value = _param_field.value;
            var _errors_nonCodedCauseOfDeath;
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.TextInput, {
                id: "freeTextCauseOfDeath",
                invalid: !!(errors === null || errors === void 0 ? void 0 : errors.nonCodedCauseOfDeath),
                invalidText: errors === null || errors === void 0 ? void 0 : (_errors_nonCodedCauseOfDeath = errors.nonCodedCauseOfDeath) === null || _errors_nonCodedCauseOfDeath === void 0 ? void 0 : _errors_nonCodedCauseOfDeath.message,
                labelText: t('nonCodedCauseOfDeath', 'Non-coded cause of death'),
                onChange: onChange,
                placeholder: t('enterNonCodedCauseOfDeath', 'Enter non-coded cause of death'),
                value: value
            });
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.ButtonSet, {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()((_obj1 = {}, _define_property(_obj1, _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].tablet, isTablet), _define_property(_obj1, _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].desktop, !isTablet), _obj1))
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Button, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].button,
        kind: "secondary",
        onClick: closeWorkspace
    }, t('discard', 'Discard')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.Button, {
        className: _mark_patient_deceased_form_scss__WEBPACK_IMPORTED_MODULE_9__["default"].button,
        disabled: isSubmitting,
        kind: "primary",
        type: "submit"
    }, isSubmitting ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_4__.InlineLoading, {
        description: t('saving', 'Saving') + '...',
        role: "progressbar"
    }) : t('saveAndClose', 'Save and close'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MarkPatientDeceasedForm);


/***/ })

}]);
//# sourceMappingURL=src_mark-patient-deceased_mark-patient-deceased-form_workspace_tsx.js.map