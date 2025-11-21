"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_visit_visit-prompt_delete-visit-dialog_component_tsx"],{

/***/ "./src/visit/hooks/useDeleteVisit.hook.tsx":
/*!*************************************************!*\
  !*** ./src/visit/hooks/useDeleteVisit.hook.tsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useDeleteVisit: () => (/* binding */ useDeleteVisit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _visits_widget_visit_resource__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../visits-widget/visit.resource */ "./src/visit/visits-widget/visit.resource.tsx");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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




function useDeleteVisit(visit) {
    var onVisitDelete = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {}, onVisitRestore = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {};
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var mutateVisit = (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.useVisitContextStore)().mutateVisit;
    var _useState = _sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false), 2), isDeletingVisit = _useState[0], setIsDeletingVisit = _useState[1];
    var restoreDeletedVisit = function() {
        (0,_visits_widget_visit_resource__WEBPACK_IMPORTED_MODULE_3__.restoreVisit)(visit === null || visit === void 0 ? void 0 : visit.uuid).then(function() {
            var _visit_visitType;
            var _visit_visitType_display;
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                title: t('visitRestored', 'Visit restored'),
                subtitle: t('visitRestoredSuccessfully', '{{visit}} restored successfully', {
                    visit: (_visit_visitType_display = visit === null || visit === void 0 ? void 0 : (_visit_visitType = visit.visitType) === null || _visit_visitType === void 0 ? void 0 : _visit_visitType.display) !== null && _visit_visitType_display !== void 0 ? _visit_visitType_display : t('visit', 'Visit')
                }),
                kind: 'success'
            });
            mutateVisit();
            onVisitRestore === null || onVisitRestore === void 0 ? void 0 : onVisitRestore();
        }).catch(function() {
            var _visit_visitType;
            var _visit_visitType_display;
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                title: t('visitNotRestored', "Visit couldn't be restored"),
                subtitle: t('errorWhenRestoringVisit', 'Error occurred when restoring {{visit}}', {
                    visit: (_visit_visitType_display = visit === null || visit === void 0 ? void 0 : (_visit_visitType = visit.visitType) === null || _visit_visitType === void 0 ? void 0 : _visit_visitType.display) !== null && _visit_visitType_display !== void 0 ? _visit_visitType_display : t('visit', 'Visit')
                }),
                kind: 'error'
            });
        });
    };
    var initiateDeletingVisit = function() {
        setIsDeletingVisit(true);
        (0,_visits_widget_visit_resource__WEBPACK_IMPORTED_MODULE_3__.deleteVisit)(visit === null || visit === void 0 ? void 0 : visit.uuid).then(function() {
            var _visit_visitType, _visit_visitType1;
            mutateVisit();
            var _visit_visitType_display, _visit_visitType_display1;
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                title: t('visitDeleted', '{{visit}} deleted', {
                    visit: (_visit_visitType_display = visit === null || visit === void 0 ? void 0 : (_visit_visitType = visit.visitType) === null || _visit_visitType === void 0 ? void 0 : _visit_visitType.display) !== null && _visit_visitType_display !== void 0 ? _visit_visitType_display : t('visit', 'Visit')
                }),
                subtitle: t('visitDeletedSuccessfully', '{{visit}} deleted successfully', {
                    visit: (_visit_visitType_display1 = visit === null || visit === void 0 ? void 0 : (_visit_visitType1 = visit.visitType) === null || _visit_visitType1 === void 0 ? void 0 : _visit_visitType1.display) !== null && _visit_visitType_display1 !== void 0 ? _visit_visitType_display1 : t('visit', 'Visit')
                }),
                kind: 'success',
                actionButtonLabel: t('undo', 'Undo'),
                onActionButtonClick: restoreDeletedVisit
            });
            onVisitDelete === null || onVisitDelete === void 0 ? void 0 : onVisitDelete();
        }).catch(function() {
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_2__.showSnackbar)({
                title: t('errorDeletingVisit', 'Error deleting visit'),
                kind: 'error',
                subtitle: t('errorOccurredDeletingVisit', 'An error occurred when deleting visit')
            });
        }).finally(function() {
            setIsDeletingVisit(false);
        });
    };
    return {
        initiateDeletingVisit: initiateDeletingVisit,
        isDeletingVisit: isDeletingVisit
    };
}


/***/ }),

/***/ "./src/visit/visit-prompt/delete-visit-dialog.component.tsx":
/*!******************************************************************!*\
  !*** ./src/visit/visit-prompt/delete-visit-dialog.component.tsx ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-i18next */ "webpack/sharing/consume/default/react-i18next/react-i18next");
/* harmony import */ var react_i18next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_i18next__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @carbon/react */ "webpack/sharing/consume/default/@carbon/react/@carbon/react");
/* harmony import */ var _carbon_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_carbon_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks_useDeleteVisit_hook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hooks/useDeleteVisit.hook */ "./src/visit/hooks/useDeleteVisit.hook.tsx");
/* harmony import */ var _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./start-visit-dialog.scss */ "./src/visit/visit-prompt/start-visit-dialog.scss");





var DeleteVisitDialog = function(param) {
    var closeModal = param.closeModal, patientUuid = param.patientUuid, visit = param.visit;
    var _visit_visitType;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var _useDeleteVisit = (0,_hooks_useDeleteVisit_hook__WEBPACK_IMPORTED_MODULE_3__.useDeleteVisit)(visit, closeModal), isDeletingVisit = _useDeleteVisit.isDeletingVisit, initiateDeletingVisit = _useDeleteVisit.initiateDeletingVisit;
    var _visit_visitType_display;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalHeader, {
        closeModal: closeModal,
        title: t('deleteVisitDialogHeader', 'Are you sure you want to delete this visit?')
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalBody, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", {
        className: _start_visit_dialog_scss__WEBPACK_IMPORTED_MODULE_4__["default"].body
    }, t('confirmDeleteVisitText', 'Deleting this {{visit}} will delete its associated encounters.', {
        visit: (_visit_visitType_display = visit === null || visit === void 0 ? void 0 : (_visit_visitType = visit.visitType) === null || _visit_visitType === void 0 ? void 0 : _visit_visitType.display) !== null && _visit_visitType_display !== void 0 ? _visit_visitType_display : t('visit', 'Visit')
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalFooter, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
        kind: "secondary",
        onClick: closeModal
    }, t('cancel', 'Cancel')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
        kind: "danger",
        onClick: initiateDeletingVisit,
        disabled: isDeletingVisit
    }, !isDeletingVisit ? t('deleteVisit', 'Delete visit') : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.InlineLoading, {
        description: t('deletingVisit', 'Deleting visit')
    }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DeleteVisitDialog);


/***/ })

}]);
//# sourceMappingURL=src_visit_visit-prompt_delete-visit-dialog_component_tsx.js.map