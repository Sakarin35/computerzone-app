"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/recommended/page",{

/***/ "(app-pages-browser)/./app/recommended/page.tsx":
/*!**********************************!*\
  !*** ./app/recommended/page.tsx ***!
  \**********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ RecommendedBuilds; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/image */ \"(app-pages-browser)/./node_modules/next/dist/api/image.js\");\n/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/ui/button */ \"(app-pages-browser)/./components/ui/button.tsx\");\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var _app_data_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/app/data/components */ \"(app-pages-browser)/./app/data/components.ts\");\n/* harmony import */ var _data_recommended_images__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../data/recommended-images */ \"(app-pages-browser)/./app/data/recommended-images.ts\");\n// /app/recommended/page.tsx\n/* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n\n\nconst getRandomComponent = (type, excludeId)=>{\n    const options = _app_data_components__WEBPACK_IMPORTED_MODULE_5__.componentOptions[type].filter((c)=>c.id !== excludeId);\n    return options[Math.floor(Math.random() * options.length)];\n};\nconst generateRecommendedBuilds = (selectedType, selectedId)=>{\n    const selectedComponent = _app_data_components__WEBPACK_IMPORTED_MODULE_5__.componentOptions[selectedType].find((c)=>c.id === selectedId);\n    if (!selectedComponent) {\n        return [];\n    }\n    const builds = [];\n    for(let i = 0; i < 3; i++){\n        const build = {\n            id: i + 1,\n            name: \"추천 PC \".concat(i + 1),\n            image: _data_recommended_images__WEBPACK_IMPORTED_MODULE_6__.recommendedImages[\"pc\".concat(i + 1)],\n            specs: Object.fromEntries(Object.keys(_app_data_components__WEBPACK_IMPORTED_MODULE_5__.componentOptions).map((key)=>{\n                const type = key;\n                return [\n                    type,\n                    type === selectedType ? selectedComponent : getRandomComponent(type)\n                ];\n            }))\n        };\n        builds.push(build);\n    }\n    return builds;\n};\nfunction RecommendedBuilds() {\n    _s();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    const searchParams = (0,next_navigation__WEBPACK_IMPORTED_MODULE_4__.useSearchParams)();\n    const [selectedBuild, setSelectedBuild] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const type = searchParams.get(\"type\");\n    const id = searchParams.get(\"id\");\n    const recommendedBuilds = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{\n        if (type && id) {\n            return generateRecommendedBuilds(type, id);\n        }\n        return [];\n    }, [\n        type,\n        id\n    ]);\n    const handleSelectBuild = (buildId)=>{\n        setSelectedBuild(buildId);\n    };\n    const handleProceed = ()=>{\n        if (selectedBuild !== null) {\n            const selectedPc = recommendedBuilds.find((build)=>build.id === selectedBuild);\n            if (selectedPc) {\n                const components = Object.entries(selectedPc.specs).reduce((acc, param)=>{\n                    let [key, value] = param;\n                    acc[key] = {\n                        name: value.name,\n                        price: value.price,\n                        description: value.description\n                    };\n                    return acc;\n                }, {});\n            }\n        }\n    };\n    const handleGoBack = ()=>{\n        router.push(\"/\");\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"min-h-screen bg-black text-white\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12\",\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                    className: \"text-2xl font-bold mb-8\",\n                    children: \"추천 PC\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                    lineNumber: 88,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                    className: \"text-gray-400 mb-8\",\n                    children: \"선택하신 부품을 포함한 추천 PC 구성입니다. 원하는 구성을 선택해 주세요.\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                    lineNumber: 89,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"grid md:grid-cols-2 lg:grid-cols-3 gap-8\",\n                    children: recommendedBuilds.map((build)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all \".concat(selectedBuild === build.id ? \"ring-2 ring-blue-500\" : \"\"),\n                            onClick: ()=>handleSelectBuild(build.id),\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"aspect-square relative\",\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_image__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                                        src: build.image.src || \"/placeholder.svg\",\n                                        alt: build.image.alt,\n                                        fill: true,\n                                        className: \"object-cover\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                        lineNumber: 101,\n                                        columnNumber: 17\n                                    }, this)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                    lineNumber: 100,\n                                    columnNumber: 15\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"p-6\",\n                                    children: [\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"flex justify-between items-center mb-4\",\n                                            children: [\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                    className: \"text-xl font-bold\",\n                                                    children: build.name\n                                                }, void 0, false, {\n                                                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                                    lineNumber: 110,\n                                                    columnNumber: 19\n                                                }, this),\n                                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                    className: \"text-xl font-bold\",\n                                                    children: [\n                                                        Object.values(build.specs).reduce((sum, component)=>sum + component.price, 0).toLocaleString(),\n                                                        \"원\"\n                                                    ]\n                                                }, void 0, true, {\n                                                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                                    lineNumber: 111,\n                                                    columnNumber: 19\n                                                }, this)\n                                            ]\n                                        }, void 0, true, {\n                                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                            lineNumber: 109,\n                                            columnNumber: 17\n                                        }, this),\n                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                            className: \"space-y-2 text-sm\",\n                                            children: Object.entries(build.specs).map((param)=>{\n                                                let [key, value] = param;\n                                                const component = value;\n                                                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                                    className: \"flex justify-between\",\n                                                    children: [\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                            className: \"font-medium text-gray-400\",\n                                                            children: [\n                                                                key.toUpperCase(),\n                                                                \":\"\n                                                            ]\n                                                        }, void 0, true, {\n                                                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                                            lineNumber: 128,\n                                                            columnNumber: 25\n                                                        }, this),\n                                                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                                            className: \"text-right ml-2\",\n                                                            children: component.name\n                                                        }, void 0, false, {\n                                                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                                            lineNumber: 129,\n                                                            columnNumber: 25\n                                                        }, this)\n                                                    ]\n                                                }, key, true, {\n                                                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                                    lineNumber: 127,\n                                                    columnNumber: 23\n                                                }, this);\n                                            })\n                                        }, void 0, false, {\n                                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                            lineNumber: 123,\n                                            columnNumber: 17\n                                        }, this)\n                                    ]\n                                }, void 0, true, {\n                                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                                    lineNumber: 108,\n                                    columnNumber: 15\n                                }, this)\n                            ]\n                        }, build.id, true, {\n                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                            lineNumber: 93,\n                            columnNumber: 13\n                        }, this))\n                }, void 0, false, {\n                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                    lineNumber: 91,\n                    columnNumber: 9\n                }, this),\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"mt-8 flex justify-end space-x-4\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__.Button, {\n                            onClick: handleGoBack,\n                            variant: \"outline\",\n                            className: \"px-8 py-2 bg-white text-black hover:bg-gray-200\",\n                            children: \"돌아가기\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                            lineNumber: 140,\n                            columnNumber: 11\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_ui_button__WEBPACK_IMPORTED_MODULE_3__.Button, {\n                            onClick: handleProceed,\n                            disabled: selectedBuild === null,\n                            className: \"px-8 py-2\",\n                            children: \"견적 선택하기\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                            lineNumber: 143,\n                            columnNumber: 11\n                        }, this)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n                    lineNumber: 139,\n                    columnNumber: 9\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n            lineNumber: 87,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"C:\\\\computerzone\\\\computerzone-app\\\\app\\\\recommended\\\\page.tsx\",\n        lineNumber: 86,\n        columnNumber: 5\n    }, this);\n}\n_s(RecommendedBuilds, \"vosa+RgARJ3vmxnSSjQjontJ5Pw=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_4__.useRouter,\n        next_navigation__WEBPACK_IMPORTED_MODULE_4__.useSearchParams\n    ];\n});\n_c = RecommendedBuilds;\nvar _c;\n$RefreshReg$(_c, \"RecommendedBuilds\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9yZWNvbW1lbmRlZC9wYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw0QkFBNEI7OztBQUdhO0FBQ1g7QUFDaUI7QUFDYTtBQUNnQjtBQUNkO0FBRTlELE1BQU1RLHFCQUFxQixDQUFDQyxNQUFxQkM7SUFDL0MsTUFBTUMsVUFBVUwsa0VBQWdCLENBQUNHLEtBQUssQ0FBQ0csTUFBTSxDQUFDLENBQUNDLElBQU1BLEVBQUVDLEVBQUUsS0FBS0o7SUFDOUQsT0FBT0MsT0FBTyxDQUFDSSxLQUFLQyxLQUFLLENBQUNELEtBQUtFLE1BQU0sS0FBS04sUUFBUU8sTUFBTSxFQUFFO0FBQzVEO0FBRUEsTUFBTUMsNEJBQTRCLENBQUNDLGNBQTZCQztJQUM5RCxNQUFNQyxvQkFBb0JoQixrRUFBZ0IsQ0FBQ2MsYUFBYSxDQUFDRyxJQUFJLENBQUMsQ0FBQ1YsSUFBTUEsRUFBRUMsRUFBRSxLQUFLTztJQUU5RSxJQUFJLENBQUNDLG1CQUFtQjtRQUN0QixPQUFPLEVBQUU7SUFDWDtJQUVBLE1BQU1FLFNBQVMsRUFBRTtJQUNqQixJQUFLLElBQUlDLElBQUksR0FBR0EsSUFBSSxHQUFHQSxJQUFLO1FBQzFCLE1BQU1DLFFBQVE7WUFDWlosSUFBSVcsSUFBSTtZQUNSRSxNQUFNLFNBQWUsT0FBTkYsSUFBSTtZQUNuQkcsT0FBT3JCLHVFQUFpQixDQUFDLEtBQVcsT0FBTmtCLElBQUksR0FBc0M7WUFDeEVJLE9BQU9DLE9BQU9DLFdBQVcsQ0FDdkJELE9BQU9FLElBQUksQ0FBQzFCLGtFQUFnQkEsRUFBRTJCLEdBQUcsQ0FBQyxDQUFDQztnQkFDakMsTUFBTXpCLE9BQU95QjtnQkFDYixPQUFPO29CQUFDekI7b0JBQU1BLFNBQVNXLGVBQWVFLG9CQUFvQmQsbUJBQW1CQztpQkFBTTtZQUNyRjtRQUVKO1FBQ0FlLE9BQU9XLElBQUksQ0FBQ1Q7SUFDZDtJQUVBLE9BQU9GO0FBQ1Q7QUFFZSxTQUFTWTs7SUFDdEIs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LE1BQU1aLEVBQUU7Ozs7Ozs7Ozs7OEJBNkNuQiw4REFBQ3lDO29CQUFJQyxXQUFVOztzQ0FDYiw4REFBQ3JELHlEQUFNQTs0QkFBQ3dELFNBQVNMOzRCQUFjZ0IsU0FBUTs0QkFBVWQsV0FBVTtzQ0FBa0Q7Ozs7OztzQ0FHN0csOERBQUNyRCx5REFBTUE7NEJBQUN3RCxTQUFTZDs0QkFBZTBCLFVBQVVoQyxrQkFBa0I7NEJBQU1pQixXQUFVO3NDQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9sRztHQTVHd0JwQjs7UUFDUGhDLHNEQUFTQTtRQUNIQyw0REFBZUE7OztLQUZkK0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vYXBwL3JlY29tbWVuZGVkL3BhZ2UudHN4PzU3YzAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gL2FwcC9yZWNvbW1lbmRlZC9wYWdlLnRzeFxuXCJ1c2UgY2xpZW50XCJcblxuaW1wb3J0IHsgdXNlU3RhdGUsIHVzZU1lbW8gfSBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IEltYWdlIGZyb20gXCJuZXh0L2ltYWdlXCJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJAL2NvbXBvbmVudHMvdWkvYnV0dG9uXCJcbmltcG9ydCB7IHVzZVJvdXRlciwgdXNlU2VhcmNoUGFyYW1zIH0gZnJvbSBcIm5leHQvbmF2aWdhdGlvblwiXG5pbXBvcnQgeyBjb21wb25lbnRPcHRpb25zLCB0eXBlIENvbXBvbmVudFR5cGUgfSBmcm9tIFwiQC9hcHAvZGF0YS9jb21wb25lbnRzXCJcbmltcG9ydCB7IHJlY29tbWVuZGVkSW1hZ2VzIH0gZnJvbSBcIi4uL2RhdGEvcmVjb21tZW5kZWQtaW1hZ2VzXCJcblxuY29uc3QgZ2V0UmFuZG9tQ29tcG9uZW50ID0gKHR5cGU6IENvbXBvbmVudFR5cGUsIGV4Y2x1ZGVJZD86IHN0cmluZykgPT4ge1xuICBjb25zdCBvcHRpb25zID0gY29tcG9uZW50T3B0aW9uc1t0eXBlXS5maWx0ZXIoKGMpID0+IGMuaWQgIT09IGV4Y2x1ZGVJZClcbiAgcmV0dXJuIG9wdGlvbnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3B0aW9ucy5sZW5ndGgpXVxufVxuXG5jb25zdCBnZW5lcmF0ZVJlY29tbWVuZGVkQnVpbGRzID0gKHNlbGVjdGVkVHlwZTogQ29tcG9uZW50VHlwZSwgc2VsZWN0ZWRJZDogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHNlbGVjdGVkQ29tcG9uZW50ID0gY29tcG9uZW50T3B0aW9uc1tzZWxlY3RlZFR5cGVdLmZpbmQoKGMpID0+IGMuaWQgPT09IHNlbGVjdGVkSWQpXG5cbiAgaWYgKCFzZWxlY3RlZENvbXBvbmVudCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgY29uc3QgYnVpbGRzID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICBjb25zdCBidWlsZCA9IHtcbiAgICAgIGlkOiBpICsgMSxcbiAgICAgIG5hbWU6IGDstpTsspwgUEMgJHtpICsgMX1gLFxuICAgICAgaW1hZ2U6IHJlY29tbWVuZGVkSW1hZ2VzW2BwYyR7aSArIDF9YCBhcyBrZXlvZiB0eXBlb2YgcmVjb21tZW5kZWRJbWFnZXNdLFxuICAgICAgc3BlY3M6IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgT2JqZWN0LmtleXMoY29tcG9uZW50T3B0aW9ucykubWFwKChrZXkpID0+IHtcbiAgICAgICAgICBjb25zdCB0eXBlID0ga2V5IGFzIENvbXBvbmVudFR5cGVcbiAgICAgICAgICByZXR1cm4gW3R5cGUsIHR5cGUgPT09IHNlbGVjdGVkVHlwZSA/IHNlbGVjdGVkQ29tcG9uZW50IDogZ2V0UmFuZG9tQ29tcG9uZW50KHR5cGUpXVxuICAgICAgICB9KSxcbiAgICAgICkgYXMgUmVjb3JkPENvbXBvbmVudFR5cGUsIHR5cGVvZiBzZWxlY3RlZENvbXBvbmVudD4sXG4gICAgfVxuICAgIGJ1aWxkcy5wdXNoKGJ1aWxkKVxuICB9XG5cbiAgcmV0dXJuIGJ1aWxkc1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWNvbW1lbmRlZEJ1aWxkcygpIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gdXNlU2VhcmNoUGFyYW1zKClcbiAgY29uc3QgW3NlbGVjdGVkQnVpbGQsIHNldFNlbGVjdGVkQnVpbGRdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4obnVsbClcblxuICBjb25zdCB0eXBlID0gc2VhcmNoUGFyYW1zLmdldChcInR5cGVcIikgYXMgQ29tcG9uZW50VHlwZVxuICBjb25zdCBpZCA9IHNlYXJjaFBhcmFtcy5nZXQoXCJpZFwiKVxuXG4gIGNvbnN0IHJlY29tbWVuZGVkQnVpbGRzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKHR5cGUgJiYgaWQpIHtcbiAgICAgIHJldHVybiBnZW5lcmF0ZVJlY29tbWVuZGVkQnVpbGRzKHR5cGUsIGlkKVxuICAgIH1cbiAgICByZXR1cm4gW11cbiAgfSwgW3R5cGUsIGlkXSlcblxuICBjb25zdCBoYW5kbGVTZWxlY3RCdWlsZCA9IChidWlsZElkOiBudW1iZXIpID0+IHtcbiAgICBzZXRTZWxlY3RlZEJ1aWxkKGJ1aWxkSWQpXG4gIH1cblxuICBjb25zdCBoYW5kbGVQcm9jZWVkID0gKCkgPT4ge1xuICAgIGlmIChzZWxlY3RlZEJ1aWxkICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZFBjID0gcmVjb21tZW5kZWRCdWlsZHMuZmluZCgoYnVpbGQpID0+IGJ1aWxkLmlkID09PSBzZWxlY3RlZEJ1aWxkKVxuICAgICAgaWYgKHNlbGVjdGVkUGMpIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50cyA9IE9iamVjdC5lbnRyaWVzKHNlbGVjdGVkUGMuc3BlY3MpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBba2V5LCB2YWx1ZV06IFtzdHJpbmcsIHsgbmFtZTogc3RyaW5nOyBwcmljZTogbnVtYmVyOyBkZXNjcmlwdGlvbjogc3RyaW5nIH1dKSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IHtcbiAgICAgICAgICAgICAgbmFtZTogdmFsdWUubmFtZSxcbiAgICAgICAgICAgICAgcHJpY2U6IHZhbHVlLnByaWNlLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogdmFsdWUuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSBhcyBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZzsgcHJpY2U6IG51bWJlcjsgZGVzY3JpcHRpb246IHN0cmluZyB9PixcbiAgICAgICAgKVxuICAgICAgICBcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBoYW5kbGVHb0JhY2sgPSAoKSA9PiB7XG4gICAgcm91dGVyLnB1c2goXCIvXCIpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWJsYWNrIHRleHQtd2hpdGVcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctN3hsIG14LWF1dG8gcHgtNCBzbTpweC02IGxnOnB4LTggcHktMTJcIj5cbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCBtYi04XCI+7LaU7LKcIFBDPC9oMj5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMCBtYi04XCI+7ISg7YOd7ZWY7IugIOu2gO2SiOydhCDtj6ztlajtlZwg7LaU7LKcIFBDIOq1rOyEseyeheuLiOuLpC4g7JuQ7ZWY64qUIOq1rOyEseydhCDshKDtg53tlbQg7KO87IS47JqULjwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgbWQ6Z3JpZC1jb2xzLTIgbGc6Z3JpZC1jb2xzLTMgZ2FwLThcIj5cbiAgICAgICAgICB7cmVjb21tZW5kZWRCdWlsZHMubWFwKChidWlsZCkgPT4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBrZXk9e2J1aWxkLmlkfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BiZy1ncmF5LTkwMCByb3VuZGVkLWxnIG92ZXJmbG93LWhpZGRlbiBjdXJzb3ItcG9pbnRlciB0cmFuc2l0aW9uLWFsbCAke1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkQnVpbGQgPT09IGJ1aWxkLmlkID8gXCJyaW5nLTIgcmluZy1ibHVlLTUwMFwiIDogXCJcIlxuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlU2VsZWN0QnVpbGQoYnVpbGQuaWQpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFzcGVjdC1zcXVhcmUgcmVsYXRpdmVcIj5cbiAgICAgICAgICAgICAgICA8SW1hZ2VcbiAgICAgICAgICAgICAgICAgIHNyYz17YnVpbGQuaW1hZ2Uuc3JjIHx8IFwiL3BsYWNlaG9sZGVyLnN2Z1wifVxuICAgICAgICAgICAgICAgICAgYWx0PXtidWlsZC5pbWFnZS5hbHR9XG4gICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyIG1iLTRcIj5cbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZFwiPntidWlsZC5uYW1lfTwvaDM+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtYm9sZFwiPlxuICAgICAgICAgICAgICAgICAgICB7T2JqZWN0LnZhbHVlcyhidWlsZC5zcGVjcylcbiAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgKHN1bSwgY29tcG9uZW50KSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzdW0gKyAoY29tcG9uZW50IGFzIHsgbmFtZTogc3RyaW5nOyBwcmljZTogbnVtYmVyOyBkZXNjcmlwdGlvbjogc3RyaW5nIH0pLnByaWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAudG9Mb2NhbGVTdHJpbmcoKX1cbiAgICAgICAgICAgICAgICAgICAg7JuQXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIgdGV4dC1zbVwiPlxuICAgICAgICAgICAgICAgICAge09iamVjdC5lbnRyaWVzKGJ1aWxkLnNwZWNzKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSB2YWx1ZSBhcyB7IG5hbWU6IHN0cmluZzsgcHJpY2U6IG51bWJlcjsgZGVzY3JpcHRpb246IHN0cmluZyB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2tleX0gY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbWVkaXVtIHRleHQtZ3JheS00MDBcIj57a2V5LnRvVXBwZXJDYXNlKCl9Ojwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcmlnaHQgbWwtMlwiPntjb21wb25lbnQubmFtZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTggZmxleCBqdXN0aWZ5LWVuZCBzcGFjZS14LTRcIj5cbiAgICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUdvQmFja30gdmFyaWFudD1cIm91dGxpbmVcIiBjbGFzc05hbWU9XCJweC04IHB5LTIgYmctd2hpdGUgdGV4dC1ibGFjayBob3ZlcjpiZy1ncmF5LTIwMFwiPlxuICAgICAgICAgICAg64+M7JWE6rCA6riwXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVQcm9jZWVkfSBkaXNhYmxlZD17c2VsZWN0ZWRCdWlsZCA9PT0gbnVsbH0gY2xhc3NOYW1lPVwicHgtOCBweS0yXCI+XG4gICAgICAgICAgICDqsqzsoIEg7ISg7YOd7ZWY6riwXG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlTWVtbyIsIkltYWdlIiwiQnV0dG9uIiwidXNlUm91dGVyIiwidXNlU2VhcmNoUGFyYW1zIiwiY29tcG9uZW50T3B0aW9ucyIsInJlY29tbWVuZGVkSW1hZ2VzIiwiZ2V0UmFuZG9tQ29tcG9uZW50IiwidHlwZSIsImV4Y2x1ZGVJZCIsIm9wdGlvbnMiLCJmaWx0ZXIiLCJjIiwiaWQiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJsZW5ndGgiLCJnZW5lcmF0ZVJlY29tbWVuZGVkQnVpbGRzIiwic2VsZWN0ZWRUeXBlIiwic2VsZWN0ZWRJZCIsInNlbGVjdGVkQ29tcG9uZW50IiwiZmluZCIsImJ1aWxkcyIsImkiLCJidWlsZCIsIm5hbWUiLCJpbWFnZSIsInNwZWNzIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJrZXlzIiwibWFwIiwia2V5IiwicHVzaCIsIlJlY29tbWVuZGVkQnVpbGRzIiwicm91dGVyIiwic2VhcmNoUGFyYW1zIiwic2VsZWN0ZWRCdWlsZCIsInNldFNlbGVjdGVkQnVpbGQiLCJnZXQiLCJyZWNvbW1lbmRlZEJ1aWxkcyIsImhhbmRsZVNlbGVjdEJ1aWxkIiwiYnVpbGRJZCIsImhhbmRsZVByb2NlZWQiLCJzZWxlY3RlZFBjIiwiY29tcG9uZW50cyIsImVudHJpZXMiLCJyZWR1Y2UiLCJhY2MiLCJ2YWx1ZSIsInByaWNlIiwiZGVzY3JpcHRpb24iLCJoYW5kbGVHb0JhY2siLCJkaXYiLCJjbGFzc05hbWUiLCJoMiIsInAiLCJvbkNsaWNrIiwic3JjIiwiYWx0IiwiZmlsbCIsImgzIiwic3BhbiIsInZhbHVlcyIsInN1bSIsImNvbXBvbmVudCIsInRvTG9jYWxlU3RyaW5nIiwidG9VcHBlckNhc2UiLCJ2YXJpYW50IiwiZGlzYWJsZWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/recommended/page.tsx\n"));

/***/ })

});