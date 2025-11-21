"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_visit_visit-prompt_start-visit-dialog_component_tsx"],{

/***/ "./src/visit/visit-prompt/start-visit-dialog.component.tsx":
/*!*****************************************************************!*\
  !*** ./src/visit/visit-prompt/start-visit-dialog.component.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @openmrs/esm-patient-common-lib */ "webpack/sharing/consume/default/@openmrs/esm-patient-common-lib/@openmrs/esm-patient-common-lib");
/* harmony import */ var _openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./start-visit-dialog.scss */ "./src/visit/visit-prompt/start-visit-dialog.scss");





var StartVisitDialog = function(param) {
    var patientUuid = param.patientUuid, closeModal = param.closeModal, launchPatientChart = param.launchPatientChart;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_3__.useTranslation)().t;
    var handleStartNewVisit = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function() {
        if (launchPatientChart) {
            (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.launchPatientChartWithWorkspaceOpen)({
                patientUuid: patientUuid,
                workspaceName: 'start-visit-workspace-form',
                additionalProps: {
                    openedFrom: 'patient-chart-start-visit'
                }
            });
        } else {
            (0,_openmrs_esm_patient_common_lib__WEBPACK_IMPORTED_MODULE_1__.launchPatientWorkspace)('start-visit-workspace-form', {
                openedFrom: 'patient-chart-start-visit'
            });
        }
        closeModal();
    }, [
        closeModal,
        patientUuid,
        launchPatientChart
    ]);
    var modalHeaderText = t('noActiveVisit', 'No active visit');
    var modalBodyText = t('noActiveVisitNoRDEText', "You can't add data to the patient chart without an active visit. Would you like to start a new visit?");
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.ModalHeader, {
        closeModal: closeModal
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement("span", {
        className: _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_4__["default"].header
    }, modalHeaderText)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.ModalBody, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement("p", {
        className: _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_4__["default"].body
    }, modalBodyText)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.ModalFooter, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
        kind: "secondary",
        onClick: closeModal
    }, t('cancel', 'Cancel')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
        kind: "primary",
        onClick: handleStartNewVisit
    }, t('startNewVisit', 'Start new visit'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StartVisitDialog);


/***/ })

}]);
//# sourceMappingURL=src_visit_visit-prompt_start-visit-dialog_component_tsx.js.map