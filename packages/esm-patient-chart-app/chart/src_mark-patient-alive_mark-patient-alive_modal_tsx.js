"use strict";
(globalThis["webpackChunk_openmrs_esm_patient_chart_app"] = globalThis["webpackChunk_openmrs_esm_patient_chart_app"] || []).push([["src_mark-patient-alive_mark-patient-alive_modal_tsx"],{

/***/ "./src/data.resource.ts":
/*!******************************!*\
  !*** ./src/data.resource.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/mark-patient-alive/mark-patient-alive.modal.tsx":
/*!*************************************************************!*\
  !*** ./src/mark-patient-alive/mark-patient-alive.modal.tsx ***!
  \*************************************************************/
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
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @openmrs/esm-framework */ "webpack/sharing/consume/default/@openmrs/esm-framework/@openmrs/esm-framework");
/* harmony import */ var _openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _data_resource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../data.resource */ "./src/data.resource.ts");





var MarkPatientAlive = function(param) {
    var closeModal = param.closeModal, patientUuid = param.patientUuid;
    var t = (0,react_i18next__WEBPACK_IMPORTED_MODULE_1__.useTranslation)().t;
    var handleSubmit = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function() {
        closeModal();
        (0,_data_resource__WEBPACK_IMPORTED_MODULE_4__.markPatientAlive)(patientUuid).then(function() {
            closeModal();
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showSnackbar)({
                title: t('markAliveSuccessfully', 'Patient marked alive successfully')
            });
            window.location.reload();
        }).catch(function(error) {
            (0,_openmrs_esm_framework__WEBPACK_IMPORTED_MODULE_3__.showSnackbar)({
                title: t('errorMarkingPatientAlive', 'Error marking patient alive'),
                kind: 'error',
                isLowContrast: false,
                subtitle: error === null || error === void 0 ? void 0 : error.message
            });
        });
    }, [
        closeModal,
        patientUuid,
        t
    ]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalHeader, {
        closeModal: closeModal,
        title: t('markPatientAlive', 'Mark patient alive')
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalBody, null, t('markPatientAliveConfirmation', 'Are you sure you want to mark this patient alive?')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.ModalFooter, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
        kind: "secondary",
        onClick: closeModal
    }, t('no', 'No')), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_carbon_react__WEBPACK_IMPORTED_MODULE_2__.Button, {
        onClick: handleSubmit
    }, t('yes', 'Yes'))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MarkPatientAlive);


/***/ })

}]);
//# sourceMappingURL=src_mark-patient-alive_mark-patient-alive_modal_tsx.js.map