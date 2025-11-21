"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_visit_visits-widget_visit-context_visit-context-header_component_tsx"],{

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-header.scss":
/*!****************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-header.scss ***!
  \****************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__visit-context-header__visitContextHeader___CkIQJ {\n  display: grid;\n  column-gap: 0.5rem;\n  padding: 0.5rem;\n  font-size: 0.75rem;\n  grid-template-areas: \"addingTo    visitType    changeVisitButton\" \"addingTo    visitInfo    visitInfo\";\n  grid-template-columns: max-content 1fr min-content;\n}\n\n.-esm-patient-chart__visit-context-header__activeVisit___u5NpZ {\n  background-color: #defbe6;\n}\n\n.-esm-patient-chart__visit-context-header__retroactiveVisit___8W99\\+ {\n  background-color: #f4f4f4;\n}\n\n.-esm-patient-chart__visit-context-header__addingTo___zHG3u {\n  grid-area: addingTo;\n}\n\n.-esm-patient-chart__visit-context-header__visitType___t41r2 {\n  font-size: 14px;\n  font-weight: 600;\n  grid-area: visitType;\n}\n\n.-esm-patient-chart__visit-context-header__changeVisitButton___bFURD {\n  grid-area: changeVisitButton;\n}\n.-esm-patient-chart__visit-context-header__changeVisitButton___bFURD .cds--btn {\n  min-height: 0;\n  padding: 0;\n}\n\n.-esm-patient-chart__visit-context-header__visitInfo___ANbKf {\n  grid-area: visitInfo;\n  display: flex;\n  align-items: center;\n  justify-items: center;\n}", "",{"version":3,"sources":["webpack://./src/visit/visits-widget/visit-context/visit-context-header.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAEA;EACE,aAAA;EACA,kBCiBW;EDhBX,eCgBW;EDfX,kBCoBW;EDnBX,sGACE;EAEF,kDAAA;AAHF;;AAMA;EACE,yBAAA;AAHF;;AAMA;EACE,yBAAA;AAHF;;AAMA;EACE,mBAAA;AAHF;;AAMA;EACE,eAAA;EACA,gBAAA;EACA,oBAAA;AAHF;;AAMA;EACE,4BAAA;AAHF;AAIE;EACE,aAAA;EACA,UAAA;AAFJ;;AAMA;EACE,oBAAA;EACA,aAAA;EACA,mBAAA;EACA,qBAAA;AAHF","sourcesContent":["@use '@carbon/layout';\n\n.visitContextHeader {\n  display: grid;\n  column-gap: layout.$spacing-03;\n  padding: layout.$spacing-03;\n  font-size: layout.$spacing-04;\n  grid-template-areas:\n    'addingTo    visitType    changeVisitButton'\n    'addingTo    visitInfo    visitInfo';\n  grid-template-columns: max-content 1fr min-content;\n}\n\n.activeVisit {\n  background-color: #defbe6;\n}\n\n.retroactiveVisit {\n  background-color: #f4f4f4;\n}\n\n.addingTo {\n  grid-area: addingTo;\n}\n\n.visitType {\n  font-size: 14px;\n  font-weight: 600;\n  grid-area: visitType;\n}\n\n.changeVisitButton {\n  grid-area: changeVisitButton;\n  :global(.cds--btn) {\n    min-height: 0;\n    padding: 0;\n  }\n}\n\n.visitInfo {\n  grid-area: visitInfo;\n  display: flex;\n  align-items: center;\n  justify-items: center;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"visitContextHeader": "-esm-patient-chart__visit-context-header__visitContextHeader___CkIQJ",
	"activeVisit": "-esm-patient-chart__visit-context-header__activeVisit___u5NpZ",
	"retroactiveVisit": "-esm-patient-chart__visit-context-header__retroactiveVisit___8W99+",
	"addingTo": "-esm-patient-chart__visit-context-header__addingTo___zHG3u",
	"visitType": "-esm-patient-chart__visit-context-header__visitType___t41r2",
	"changeVisitButton": "-esm-patient-chart__visit-context-header__changeVisitButton___bFURD",
	"visitInfo": "-esm-patient-chart__visit-context-header__visitInfo___ANbKf"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-info.scss":
/*!**************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-info.scss ***!
  \**************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/openmrs/node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_openmrs_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_openmrs_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".-esm-patient-chart__visit-context-info__visitContextInfoContainer___vuN7e {\n  display: flex;\n  align-items: center;\n  justify-items: center;\n}\n\n.-esm-patient-chart__visit-context-info__separator___niAOq,\n.-esm-patient-chart__visit-context-info__visitLocation___6Vt56 {\n  margin: 0.25rem;\n}", "",{"version":3,"sources":["webpack://./src/visit/visits-widget/visit-context/visit-context-info.scss","webpack://./../../node_modules/@carbon/layout/scss/generated/_spacing.scss"],"names":[],"mappings":"AAEA;EACE,aAAA;EACA,mBAAA;EACA,qBAAA;AADF;;AAIA;;EAEE,eCMW;ADPb","sourcesContent":["@use '@carbon/layout';\n\n.visitContextInfoContainer {\n  display: flex;\n  align-items: center;\n  justify-items: center;\n}\n\n.separator,\n.visitLocation {\n  margin: layout.$spacing-02;\n}\n","// Code generated by @carbon/layout. DO NOT EDIT.\n//\n// Copyright IBM Corp. 2018, 2023\n//\n// This source code is licensed under the Apache-2.0 license found in the\n// LICENSE file in the root directory of this source tree.\n//\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-01: 0.125rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-02: 0.25rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-03: 0.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-04: 0.75rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-05: 1rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-06: 1.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-07: 2rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-08: 2.5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-09: 3rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-10: 4rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-11: 5rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-12: 6rem !default;\n\n/// @type Number\n/// @access public\n/// @group @carbon/layout\n$spacing-13: 10rem !default;\n\n/// @type Map\n/// @access public\n/// @group @carbon/layout\n$spacing: (\n  spacing-01: $spacing-01,\n  spacing-02: $spacing-02,\n  spacing-03: $spacing-03,\n  spacing-04: $spacing-04,\n  spacing-05: $spacing-05,\n  spacing-06: $spacing-06,\n  spacing-07: $spacing-07,\n  spacing-08: $spacing-08,\n  spacing-09: $spacing-09,\n  spacing-10: $spacing-10,\n  spacing-11: $spacing-11,\n  spacing-12: $spacing-12,\n  spacing-13: $spacing-13,\n);\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"visitContextInfoContainer": "-esm-patient-chart__visit-context-info__visitContextInfoContainer___vuN7e",
	"separator": "-esm-patient-chart__visit-context-info__separator___niAOq",
	"visitLocation": "-esm-patient-chart__visit-context-info__visitLocation___6Vt56"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/visit/visits-widget/visit-context/visit-context-header.scss":
/*!*************************************************************************!*\
  !*** ./src/visit/visits-widget/visit-context/visit-context-header.scss ***!
  \*************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-header.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-header.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
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
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-header.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-header.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-header.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-header.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/visit-context/visit-context-info.scss":
/*!***********************************************************************!*\
  !*** ./src/visit/visits-widget/visit-context/visit-context-info.scss ***!
  \***********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js */ "../../node_modules/openmrs/node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-info.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-info.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_openmrs_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_openmrs_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_openmrs_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);


if (true) {
  if (!_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals || module.hot.invalidate) {
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
    var isNamedExport = !_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;
    var oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

    module.hot.accept(
      /*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-info.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-info.scss",
      __WEBPACK_OUTDATED_DEPENDENCIES__ => { /* harmony import */ _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../../../../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./visit-context-info.scss */ "../../node_modules/openmrs/node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../../node_modules/openmrs/node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!./src/visit/visits-widget/visit-context/visit-context-info.scss");
(function () {
        if (!isEqualLocals(oldLocals, isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals, isNamedExport)) {
                module.hot.invalidate();

                return;
              }

              oldLocals = isNamedExport ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__ : _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals;

              update(_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"]);
      })(__WEBPACK_OUTDATED_DEPENDENCIES__); }
    )
  }

  module.hot.dispose(function() {
    update();
  });
}



       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_openmrs_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_2_use_1_node_modules_openmrs_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_2_use_2_visit_context_info_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/visit/visits-widget/visit-context/visit-context-header.component.tsx":
/*!**********************************************************************************!*\
  !*** ./src/visit/visits-widget/visit-context/visit-context-header.component.tsx ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ "../../node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./visit-context-header.scss */ "./src/visit/visits-widget/visit-context/visit-context-header.scss");
/* harmony import */ var _visit_context_info_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./visit-context-info.component */ "./src/visit/visits-widget/visit-context/visit-context-info.component.tsx");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_7__);








var VisitContextHeader = function(param) {
    var patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.useTranslation)().t;
    var systemVisitEnabled = (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_7__.useSystemVisitSetting)().systemVisitEnabled;
    var isRdeEnabled = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useFeatureFlag)('rde');
    var showVisitContextHeader = systemVisitEnabled && isRdeEnabled;
    var _useVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.useVisit)(showVisitContextHeader ? patientUuid : null), currentVisit = _useVisit.currentVisit, isLoading = _useVisit.isLoading;
    var isActiveVisit = !Boolean(currentVisit && currentVisit.stopDatetime);
    var openVisitSwitcherModal = function() {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_1__.showModal)('visit-context-switcher', {
            patientUuid: patientUuid,
            closeModal: function() {
                return dispose();
            },
            size: 'sm'
        });
    };
    if (!showVisitContextHeader) {
        return null;
    }
    if (isLoading) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
            className: _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].visitContextHeader
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.Loading, {
            small: true
        }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_2___default()(_visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].visitContextHeader, isActiveVisit ? _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].activeVisit : _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].retroactiveVisit)
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].addingTo
    }, t('addingToVisit', 'Adding to:')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].visitType
    }, currentVisit.visitType.display), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].changeVisitButton
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
        kind: "ghost",
        size: "sm",
        onClick: openVisitSwitcherModal
    }, t('change', 'Change'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", {
        className: _visit_context_header_scss__WEBPACK_IMPORTED_MODULE_5__["default"].visitInfo
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_visit_context_info_component__WEBPACK_IMPORTED_MODULE_6__["default"], {
        visit: currentVisit
    })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitContextHeader);


/***/ }),

/***/ "./src/visit/visits-widget/visit-context/visit-context-info.component.tsx":
/*!********************************************************************************!*\
  !*** ./src/visit/visits-widget/visit-context/visit-context-info.component.tsx ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _carbon_react_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @carbon/react/icons */ "../../node_modules/@carbon/icons-react/es/generated/bucket-1.js");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _visit_context_info_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./visit-context-info.scss */ "./src/visit/visits-widget/visit-context/visit-context-info.scss");





var VisitContextInfo = function(param) {
    var visit = param.visit;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    if (!visit) {
        return null;
    }
    var isActive = !visit.stopDatetime;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
        className: _visit_context_info_scss__WEBPACK_IMPORTED_MODULE_3__["default"].visitContextInfoContainer
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null, isActive ? t('currentActiveVisit', 'Current active visit') : t('fromDateToDate', '{{fromDate}} - {{toDate}}', {
        fromDate: (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.formatDate)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.parseDate)(visit.startDatetime), {
            time: false
        }),
        toDate: (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.formatDate)((0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_0__.parseDate)(visit.stopDatetime), {
            time: false
        })
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
        className: _visit_context_info_scss__WEBPACK_IMPORTED_MODULE_3__["default"].separator
    }, "\xb7"), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_carbon_react_icons__WEBPACK_IMPORTED_MODULE_4__.Building, null), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", {
        className: _visit_context_info_scss__WEBPACK_IMPORTED_MODULE_3__["default"].visitLocation
    }, visit.location.display));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VisitContextInfo);


/***/ })

}]);
//# sourceMappingURL=src_visit_visits-widget_visit-context_visit-context-header_component_tsx.js.map