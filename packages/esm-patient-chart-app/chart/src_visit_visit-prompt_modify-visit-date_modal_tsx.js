"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_visit_visit-prompt_modify-visit-date_modal_tsx"],{

/***/ "./src/visit/visit-prompt/modify-visit-date.modal.tsx":
/*!************************************************************!*\
  !*** ./src/visit/visit-prompt/modify-visit-date.modal.tsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./start-visit-dialog.scss */ "./src/visit/visit-prompt/start-visit-dialog.scss");




var ModifyVisitDateConfirmationModal = function(param) {
    var onDiscard = param.onDiscard, onConfirmation = param.onConfirmation;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_2__.useTranslation)().t;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ModalHeader, {
        closeModal: onDiscard,
        title: t('modifyVisitDate', 'Modify visit date')
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ModalBody, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_3__["default"].body
    }, t('confirmModifyingVisitDateToAccomodateEncounter', 'The encounter date falls outside the designated visit date range. Would you like to modify the visit date to accommodate the new encounter date?'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.ModalFooter, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        kind: "secondary",
        onClick: onDiscard
    }, t('cancel', 'Cancel')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
        kind: "danger",
        onClick: onConfirmation
    }, t('confirm', 'Confirm'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModifyVisitDateConfirmationModal);


/***/ })

}]);
//# sourceMappingURL=src_visit_visit-prompt_modify-visit-date_modal_tsx.js.map