"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_visit_visit-action-items_delete-visit-action-item_component_tsx"],{

/***/ "./src/visit/visit-action-items/delete-visit-action-item.component.tsx":
/*!*****************************************************************************!*\
  !*** ./src/visit/visit-action-items/delete-visit-action-item.component.tsx ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);




var DeleteVisitActionItem = function(param) {
    var patientUuid = param.patientUuid, visit = param.visit, compact = param.compact;
    var _visit_encounters;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var isTablet = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useLayoutType)() === 'tablet';
    var responsiveSize = isTablet ? 'lg' : 'sm';
    var deleteVisit = function() {
        var dispose = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showModal)('delete-visit-dialog', {
            patientUuid: patientUuid,
            visit: visit,
            closeModal: function() {
                return dispose();
            }
        });
    };
    if (visit === null || visit === void 0 ? void 0 : (_visit_encounters = visit.encounters) === null || _visit_encounters === void 0 ? void 0 : _visit_encounters.length) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.UserHasAccess, {
        privilege: "Delete Visits"
    }, compact ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
        onClick: deleteVisit,
        label: (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.getCoreTranslation)('delete'),
        kind: "ghost",
        size: responsiveSize
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.TrashCanIcon, {
        size: 16
    })) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        onClick: deleteVisit,
        kind: "danger--ghost",
        renderIcon: _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.TrashCanIcon,
        size: responsiveSize
    }, t('deleteVisit', 'Delete visit')));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeleteVisitActionItem);


/***/ })

}]);
//# sourceMappingURL=src_visit_visit-action-items_delete-visit-action-item_component_tsx.js.map