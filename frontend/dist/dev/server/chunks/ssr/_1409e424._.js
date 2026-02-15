module.exports = [
"[project]/components/seeds/FilterDropdown.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FilterDropdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function FilterDropdown({ id, label, options, selected, selectedValues = [], open, onToggle, onSelect, onToggleValue, placeholder, variant = "default", minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, inputPrefix, inputSuffix, minLabel, maxLabel, multi = false }) {
    const selectedLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (multi && selectedValues.length > 0) {
            return `${label} (${selectedValues.length})`;
        }
        const found = options.find((option)=>option.value === selected);
        return found ? found.label : "";
    }, [
        options,
        selected,
        selectedValues,
        multi,
        label
    ]);
    const isInputVariant = variant !== "default";
    const isActive = isInputVariant ? Boolean(minPrice || maxPrice) : multi ? selectedValues.length > 0 : Boolean(selected);
    const buttonLabel = isInputVariant ? label : isActive ? selectedLabel || label : label;
    const isPrice = variant === "price";
    const isRange = variant === "range";
    const isNumber = variant === "number";
    const isInput = isPrice || isRange || isNumber;
    const showMax = !isNumber;
    const prefix = isPrice ? "€" : inputPrefix ?? "";
    const suffix = inputSuffix ?? "";
    const minTitle = minLabel ?? "Minimum";
    const maxTitle = maxLabel ?? "Maximum";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative z-[120]",
        "data-no-reveal": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onToggle(id),
                className: `inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs transition ${isActive ? "bg-pr_w text-pr_dg" : "bg-sr_dg text-pr_w"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: buttonLabel
                    }, void 0, false, {
                        fileName: "[project]/components/seeds/FilterDropdown.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-[10px] transition ${open ? "rotate-180" : ""}`,
                        children: "⌄"
                    }, void 0, false, {
                        fileName: "[project]/components/seeds/FilterDropdown.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/seeds/FilterDropdown.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute left-0 z-[130] mt-2 origin-top-left rounded-2xl bg-sr_dg p-3 text-xs text-pr_w shadow-lg transition ${isInput ? "w-64" : "w-44"} ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`,
                children: isInput ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `grid gap-4 ${showMax ? "grid-cols-2" : "grid-cols-1"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-pr_w/80",
                                    children: minTitle
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                    lineNumber: 106,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex items-center rounded-full bg-pr_w px-3 py-2",
                                    children: [
                                        prefix ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-pr_dg",
                                            children: prefix
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 109,
                                            columnNumber: 19
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            inputMode: "numeric",
                                            min: 0,
                                            value: minPrice ?? "",
                                            onChange: (event)=>onMinPriceChange?.(event.target.value),
                                            className: "w-full bg-transparent px-2 text-sm font-semibold text-pr_dg outline-none placeholder:text-pr_dg/40",
                                            placeholder: "0"
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, this),
                                        suffix ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-pr_dg",
                                            children: suffix
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 123,
                                            columnNumber: 19
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this),
                        showMax ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-pr_w/80",
                                    children: maxTitle
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex items-center rounded-full bg-pr_w px-3 py-2",
                                    children: [
                                        prefix ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-pr_dg",
                                            children: prefix
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 132,
                                            columnNumber: 21
                                        }, this) : null,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            inputMode: "numeric",
                                            min: 0,
                                            value: maxPrice ?? "",
                                            onChange: (event)=>onMaxPriceChange?.(event.target.value),
                                            className: "w-full bg-transparent px-2 text-sm font-semibold text-pr_dg outline-none placeholder:text-pr_dg/40",
                                            placeholder: "500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, this),
                                        suffix ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-semibold text-pr_dg",
                                            children: suffix
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                            lineNumber: 146,
                                            columnNumber: 21
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                    lineNumber: 130,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                            lineNumber: 128,
                            columnNumber: 15
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/seeds/FilterDropdown.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        !multi ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "w-full rounded-lg px-3 py-2 text-left text-pr_w/70 hover:bg-pr_w/10",
                            onClick: ()=>onSelect(id, ""),
                            children: placeholder ?? "Any"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/FilterDropdown.tsx",
                            lineNumber: 155,
                            columnNumber: 15
                        }, this) : null,
                        options.map((option)=>{
                            const isSelected = multi ? selectedValues.includes(option.value) : option.value === selected;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: `flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition ${isSelected ? "bg-pr_w/15" : "hover:bg-pr_w/10"}`,
                                onClick: ()=>multi ? onToggleValue?.(id, option.value) : onSelect(id, option.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: option.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                        lineNumber: 180,
                                        columnNumber: 19
                                    }, this),
                                    multi && isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                        lineNumber: 181,
                                        columnNumber: 42
                                    }, this) : null
                                ]
                            }, option.value, true, {
                                fileName: "[project]/components/seeds/FilterDropdown.tsx",
                                lineNumber: 168,
                                columnNumber: 17
                            }, this);
                        })
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/components/seeds/FilterDropdown.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/seeds/FilterDropdown.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
const baseStyles = "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const variants = {
    header: "bg-white text-pr_dg hover:bg-white/90",
    contact: "bg-pr_dg text-white hover:bg-pr_dg/90",
    primary: "bg-pr_dg text-white hover:bg-pr_dg/90",
    category: "bg-pr_y text-pr_dg hover:bg-pr_y/90"
};
function Button({ variant = "primary", className, type = "button", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/apiClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiFetch",
    ()=>apiFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authTokens.ts [app-ssr] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? process.env.NEXT_PUBLIC_API_URL ?? "";
function getStringToken(source, keys) {
    if (!source) return undefined;
    for (const key of keys){
        const value = source[key];
        if (typeof value === "string" && value.trim()) return value;
    }
    return undefined;
}
function extractAuthTokens(payload) {
    if (!payload || typeof payload !== "object") return {};
    const root = payload;
    const data = root.data && typeof root.data === "object" ? root.data : undefined;
    const rootTokens = root.tokens && typeof root.tokens === "object" ? root.tokens : undefined;
    const dataTokens = data?.tokens && typeof data.tokens === "object" ? data.tokens : undefined;
    const accessToken = getStringToken(root, [
        "accessToken",
        "access_token"
    ]) || getStringToken(data, [
        "accessToken",
        "access_token"
    ]) || getStringToken(rootTokens, [
        "accessToken",
        "access_token"
    ]) || getStringToken(dataTokens, [
        "accessToken",
        "access_token"
    ]);
    const refreshToken = getStringToken(root, [
        "refreshToken",
        "refresh_token"
    ]) || getStringToken(data, [
        "refreshToken",
        "refresh_token"
    ]) || getStringToken(rootTokens, [
        "refreshToken",
        "refresh_token"
    ]) || getStringToken(dataTokens, [
        "refreshToken",
        "refresh_token"
    ]);
    return {
        accessToken,
        refreshToken
    };
}
function buildCandidateUrls(path) {
    if ("TURBOPACK compile-time truthy", 1) return [
        `${API_BASE_URL}${path}`
    ];
    //TURBOPACK unreachable
    ;
}
async function fetchWithFallback(path, init, retryOnProxyError = true) {
    const urls = buildCandidateUrls(path);
    let lastError;
    for(let index = 0; index < urls.length; index += 1){
        const url = urls[index];
        try {
            const response = await fetch(url, init);
            if (retryOnProxyError && response.status >= 500 && index < urls.length - 1) {
                continue;
            }
            return response;
        } catch (error) {
            lastError = error;
            const hasNext = index < urls.length - 1;
            if (hasNext) continue;
            throw error;
        }
    }
    if (lastError instanceof Error) {
        throw lastError;
    }
    throw new Error("Failed to fetch");
}
async function apiFetch(input, init = {}, options = {}) {
    if (typeof input !== "string") {
        throw new Error("apiFetch currently expects a string path input");
    }
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    const headers = new Headers(init.headers || {});
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    const response = await fetchWithFallback(input, {
        ...init,
        headers
    });
    if (response.status !== 401) return response;
    const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRefreshToken"])();
    if (!refreshToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTokens"])();
        options.onUnauthorized?.();
        return response;
    }
    const refreshResponse = await fetchWithFallback("/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Support both backend payload variants while keeping backward compatibility.
        body: JSON.stringify({
            refreshToken,
            token: refreshToken
        })
    }, true);
    if (!refreshResponse.ok) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTokens"])();
        options.onUnauthorized?.();
        return response;
    }
    const data = extractAuthTokens(await refreshResponse.json().catch(()=>({})));
    if (data?.accessToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(data.accessToken);
        headers.set("Authorization", `Bearer ${data.accessToken}`);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearTokens"])();
        options.onUnauthorized?.();
        return response;
    }
    if (data?.refreshToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setRefreshToken"])(data.refreshToken);
    }
    return fetchWithFallback(input, {
        ...init,
        headers
    });
}
}),
"[project]/services/cart.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addCartItem",
    ()=>addCartItem,
    "clearCart",
    ()=>clearCart,
    "fetchCart",
    ()=>fetchCart,
    "removeCartItem",
    ()=>removeCartItem,
    "updateCartItem",
    ()=>updateCartItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.ts [app-ssr] (ecmascript)");
;
function buildApiError(fallbackMessage, status, payload) {
    const error = new Error(payload?.message || payload?.error || fallbackMessage);
    error.status = status;
    return error;
}
function ensureProductSlug(productSlug) {
    return productSlug.trim();
}
async function fetchCart() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])("/cart");
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to load cart", response.status, error);
    }
    return await response.json();
}
async function addCartItem(productSlug, qty = 1) {
    const normalizedProductSlug = ensureProductSlug(productSlug);
    if (!normalizedProductSlug) {
        throw buildApiError("Product is unavailable", 400);
    }
    const normalizedQty = Math.max(1, Math.trunc(qty || 1));
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])("/cart/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // Keep both keys for backend compatibility while migration settles.
            productId: normalizedProductSlug,
            productSlug: normalizedProductSlug,
            qty: normalizedQty
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to add item", response.status, error);
    }
    return response.json();
}
async function updateCartItem(productSlug, qty) {
    const normalizedProductSlug = ensureProductSlug(productSlug);
    if (!normalizedProductSlug) {
        throw buildApiError("Product slug is required", 400);
    }
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(`/cart/items/${encodeURIComponent(normalizedProductSlug)}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            qty
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to update item", response.status, error);
    }
    return response.json();
}
async function removeCartItem(productSlug) {
    const normalizedProductSlug = ensureProductSlug(productSlug);
    if (!normalizedProductSlug) {
        throw buildApiError("Product slug is required", 400);
    }
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(`/cart/items/${encodeURIComponent(normalizedProductSlug)}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to remove item", response.status, error);
    }
    return response.json();
}
async function clearCart() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])("/cart", {
        method: "DELETE"
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to clear cart", response.status, error);
    }
    return response.json();
}
}),
"[project]/components/cart/AddToCartButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddToCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$cart$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/cart.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/AuthProvider.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function AddToCartButton({ productId, qty = 1, label = "Add to Cart +", variant = "category", className }) {
    const disableAuth = ("TURBOPACK compile-time value", "false") === "true";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated, isInitializing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [justAdded, setJustAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleClick = async ()=>{
        if (isInitializing) return;
        if (!productId) return;
        if (!isAuthenticated && !disableAuth) {
            router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
            return;
        }
        try {
            setLoading(true);
            setFailed(false);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$cart$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addCartItem"])(productId, qty);
            setJustAdded(true);
            setTimeout(()=>setJustAdded(false), 1500);
        } catch (error) {
            setJustAdded(false);
            const status = typeof error === "object" && error !== null && "status" in error && typeof error.status === "number" ? error.status ?? 0 : 0;
            if ((status === 401 || status === 403) && !disableAuth) {
                router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
                return;
            }
            setFailed(true);
            setTimeout(()=>setFailed(false), 1500);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        variant: variant,
        className: className,
        disabled: loading || !productId || isInitializing,
        onClick: handleClick,
        type: "button",
        children: loading ? "Adding..." : isInitializing ? "Checking..." : justAdded ? "Added" : failed ? "Try again" : label
    }, void 0, false, {
        fileName: "[project]/components/cart/AddToCartButton.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ui/ProductCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$AddToCartButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/cart/AddToCartButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
function ProductCard({ title, description, price, isNew = true, badgeLabel = "New!", badgeClassName = "bg-pr_y text-pr_dg", href, showButton = true, imageUrl, productId }) {
    const resolvedHref = href ?? (productId ? `/products/${productId}` : undefined);
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    isNew && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold", badgeClassName),
                        children: badgeLabel
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, this),
                    imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imageUrl,
                        alt: title,
                        className: "h-[400px] w-full rounded-2xl object-cover"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 45,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[400px] rounded-2xl bg-pr_w/60"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 51,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/ProductCard.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-semibold text-pr_w",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-pr_w/70 line-clamp-2",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-lg font-semibold text-pr_w",
                        children: price
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ProductCard.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/ProductCard.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            resolvedHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: resolvedHref,
                className: "flex flex-1 flex-col",
                children: content
            }, void 0, false, {
                fileName: "[project]/components/ui/ProductCard.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this) : content,
            showButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$cart$2f$AddToCartButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                productId: productId,
                className: "mt-3 w-full",
                variant: "category"
            }, void 0, false, {
                fileName: "[project]/components/ui/ProductCard.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/ProductCard.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
"[project]/services/categories.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCategories",
    ()=>fetchCategories,
    "fetchCategoryFilters",
    ()=>fetchCategoryFilters
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? process.env.NEXT_PUBLIC_API_URL ?? "";
function getBaseUrl() {
    return API_BASE_URL;
}
async function fetchCategories() {
    const response = await fetch(`${getBaseUrl()}/categories`);
    if (!response.ok) {
        throw new Error("Failed to load categories");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}
async function fetchCategoryFilters(slug) {
    if (!slug) return [];
    const response = await fetch(`${getBaseUrl()}/categories/${slug}/filters`);
    if (!response.ok) {
        throw new Error("Failed to load category filters");
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}
}),
"[project]/services/products.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllProducts",
    ()=>fetchAllProducts,
    "fetchProductById",
    ()=>fetchProductById,
    "fetchProducts",
    ()=>fetchProducts,
    "formatPrice",
    ()=>formatPrice,
    "getPrimaryImageUrl",
    ()=>getPrimaryImageUrl
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? process.env.NEXT_PUBLIC_API_URL ?? "";
function getBaseUrl() {
    return API_BASE_URL;
}
function formatPrice(priceCents, currency = "EUR") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency
    }).format(priceCents / 100);
}
function getFilterValue(filters, keys) {
    if (!filters) return undefined;
    const entries = Object.entries(filters);
    const match = entries.find(([key])=>keys.some((candidate)=>key.toLowerCase() === candidate.toLowerCase()));
    const value = match?.[1]?.trim();
    return value || undefined;
}
function getFirstNumericValue(value) {
    if (!value) return undefined;
    const match = value.match(/-?\d+(\.\d+)?/);
    if (!match) return undefined;
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function normalizeFactsFromFilters(filters) {
    if (!filters) return undefined;
    const thcLevel = getFilterValue(filters, [
        "THC %",
        "THC"
    ]);
    const yieldValue = getFilterValue(filters, [
        "Yield g/m²",
        "Yield"
    ]);
    const floweringCycle = getFilterValue(filters, [
        "Seed to Harvest (weeks)",
        "Flowering Cycle",
        "Cycle"
    ]);
    const seedType = getFilterValue(filters, [
        "Seed Type",
        "Type"
    ]);
    if (!thcLevel && !yieldValue && !floweringCycle && !seedType) {
        return undefined;
    }
    return {
        thcLevel,
        yield: yieldValue,
        floweringCycle,
        seedType
    };
}
function normalizeGeneticBalanceFromFilters(filters) {
    if (!filters) return undefined;
    const indica = getFirstNumericValue(getFilterValue(filters, [
        "Indica %",
        "Indica"
    ]));
    const sativa = getFirstNumericValue(getFilterValue(filters, [
        "Sativa %",
        "Sativa"
    ]));
    if (indica === undefined && sativa === undefined) {
        return undefined;
    }
    return {
        ...indica !== undefined ? {
            indica,
            ba: indica
        } : {},
        ...sativa !== undefined ? {
            sativa,
            abo: sativa
        } : {}
    };
}
function normalizeCurrency(raw) {
    return raw.currency || "EUR";
}
function normalizePriceCents(raw) {
    if (typeof raw.priceCents === "number") return raw.priceCents;
    if (typeof raw.price === "number") {
        if (raw.price > 1000) return Math.round(raw.price);
        return Math.round(raw.price * 100);
    }
    if (typeof raw.price === "string") {
        const numeric = Number(raw.price.replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(numeric)) return 0;
        if (numeric > 1000) return Math.round(numeric);
        return Math.round(numeric * 100);
    }
    return 0;
}
function normalizeImages(images, fallback) {
    const rawImages = images ?? (fallback ? [
        fallback
    ] : []);
    return rawImages.map((image, index)=>{
        if (typeof image === "string") {
            return {
                id: `${index}`,
                url: image,
                sortOrder: index
            };
        }
        const url = image.url || image.src || image.path;
        if (!url) return null;
        return {
            id: image.id ?? `${index}`,
            url,
            sortOrder: typeof image.sortOrder === "number" ? image.sortOrder : typeof image.order === "number" ? image.order : index
        };
    }).filter(Boolean);
}
function normalizeCategory(raw) {
    if (!raw.category) return undefined;
    if (typeof raw.category === "string") {
        return {
            name: raw.category,
            slug: raw.category
        };
    }
    return {
        id: raw.category.id,
        name: raw.category.name,
        slug: raw.category.slug
    };
}
function normalizeContent(raw) {
    const description = raw.content?.description || raw.description || raw.shortDescription || raw.summary;
    const subtitle = raw.content?.subtitle;
    const keyFacts = raw.content?.keyFacts;
    const sections = raw.content?.sections?.filter((section)=>section.title || section.text).map((section)=>({
            title: section.title ?? "Details",
            text: section.text ?? ""
        }));
    const facts = raw.content?.facts;
    const effects = raw.content?.effects;
    const variants = raw.content?.variants?.filter((variant)=>variant.label);
    const geneticBalance = raw.content?.geneticBalance;
    if (!description && !keyFacts && !sections && !facts && !effects && !variants && !geneticBalance) return undefined;
    return {
        description,
        keyFacts,
        sections,
        subtitle,
        facts,
        effects,
        variants: variants?.map((variant)=>({
                label: variant.label ?? "",
                priceCents: variant.priceCents ?? 0
            })),
        geneticBalance
    };
}
function normalizeProduct(raw) {
    const id = raw.id || raw._id || raw.uuid || raw.productId || raw.product_id || raw.product?.id || raw.product?.uuid || raw.slug || "";
    const slug = raw.slug;
    const name = raw.name || raw.title || "Product";
    const normalizedContent = normalizeContent(raw);
    const factsFromFilters = normalizeFactsFromFilters(raw.filters);
    const balanceFromFilters = normalizeGeneticBalanceFromFilters(raw.filters);
    const mergedContent = normalizedContent || factsFromFilters || balanceFromFilters ? {
        ...normalizedContent ?? {},
        facts: normalizedContent?.facts || factsFromFilters ? {
            ...normalizedContent?.facts ?? {},
            ...factsFromFilters ?? {}
        } : undefined,
        geneticBalance: normalizedContent?.geneticBalance || balanceFromFilters ? {
            ...normalizedContent?.geneticBalance ?? {},
            ...balanceFromFilters ?? {}
        } : undefined
    } : undefined;
    return {
        id,
        slug,
        name,
        content: mergedContent,
        priceCents: normalizePriceCents(raw),
        currency: normalizeCurrency(raw),
        stockQty: raw.stockQty ?? raw.stock,
        images: normalizeImages(raw.images, raw.image),
        category: normalizeCategory(raw),
        soldCount: raw.soldCount ?? raw.sold,
        ratingAvg: raw.ratingAvg ?? raw.rating,
        reviewCount: raw.reviewCount ?? raw.reviews,
        filters: raw.filters ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
    };
}
function normalizeListResponse(data) {
    if (Array.isArray(data)) {
        return {
            page: 1,
            limit: data.length,
            total: data.length,
            items: data.map((item)=>normalizeProduct(item))
        };
    }
    const payload = data;
    if (payload?.items) {
        return {
            page: payload.page ?? 1,
            limit: payload.limit ?? payload.items.length,
            total: payload.total ?? payload.items.length,
            items: payload.items.map((item)=>normalizeProduct(item))
        };
    }
    if (Array.isArray(payload?.data)) {
        return {
            page: payload?.page ?? 1,
            limit: payload?.limit ?? payload.data.length,
            total: payload?.total ?? payload.data.length,
            items: payload.data.map((item)=>normalizeProduct(item))
        };
    }
    if (payload?.data && Array.isArray(payload.data.items)) {
        return {
            page: payload.data.page ?? payload.page ?? 1,
            limit: payload.data.limit ?? payload.limit ?? payload.data.items.length,
            total: payload.data.total ?? payload.total ?? payload.data.items.length,
            items: payload.data.items.map((item)=>normalizeProduct(item))
        };
    }
    return {
        page: 1,
        limit: 0,
        total: 0,
        items: []
    };
}
async function fetchProducts(query, init) {
    const params = new URLSearchParams();
    params.set("page", String(query.page));
    params.set("limit", String(query.limit));
    if (query.q) params.set("q", query.q);
    if (query.category) params.set("category", query.category);
    if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
    if (query.sort) params.set("sort", query.sort);
    if (query.filters) {
        Object.entries(query.filters).forEach(([key, value])=>{
            if (value === undefined || value === null || value === "") return;
            params.set(key, String(value));
        });
    }
    const response = await fetch(`${getBaseUrl()}/products?${params.toString()}`, {
        ...init
    });
    if (!response.ok) {
        throw new Error("Failed to load products");
    }
    const data = await response.json();
    return normalizeListResponse(data);
}
async function fetchAllProducts(query, init) {
    const limit = 32;
    let page = 1;
    let total = 0;
    const items = [];
    do {
        const response = await fetchProducts({
            page,
            limit,
            q: query?.q,
            category: query?.category,
            minPrice: query?.minPrice,
            maxPrice: query?.maxPrice,
            sort: query?.sort,
            filters: query?.filters
        }, init);
        items.push(...response.items);
        total = response.total;
        page += 1;
    }while (items.length < total)
    return items;
}
async function fetchProductById(slug, init) {
    const response = await fetch(`${getBaseUrl()}/products/${slug}`, {
        ...init
    });
    if (!response.ok) {
        throw new Error("Failed to load product");
    }
    const data = await response.json();
    const rawProduct = data.data ?? data;
    return normalizeProduct(rawProduct);
}
function getPrimaryImageUrl(images) {
    if (!images || images.length === 0) return "";
    return images.slice().sort((a, b)=>a.sortOrder - b.sortOrder)[0]?.url ?? "";
}
}),
"[project]/app/(shop)/seeds/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SeedsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seeds/FilterDropdown.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ProductCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/categories.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/products.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const filterOptions = {
    sorting: [
        {
            label: "Featured",
            value: "featured"
        },
        {
            label: "Price: Low to High",
            value: "price-asc"
        },
        {
            label: "Price: High to Low",
            value: "price-desc"
        }
    ],
    price: []
};
const sortMap = {
    featured: "createdAt:desc",
    "price-asc": "price:asc",
    "price-desc": "price:desc"
};
function getPriceValue(price) {
    const numeric = Number(price.replace("€", "").trim());
    return Number.isNaN(numeric) ? 0 : numeric;
}
function getTextValue(item) {
    if (item.text) return item.text;
    return `${item.title} ${item.description}`.toLowerCase();
}
function toTitleCase(value) {
    return value.replace(/-/g, " ").replace(/\b\w/g, (char)=>char.toUpperCase());
}
function slugifyFilterKey(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function extractNumbers(value) {
    if (typeof value === "number") return [
        value
    ];
    if (!value) return [];
    const matches = value.match(/(\d+(\.\d+)?)/g);
    if (!matches) return [];
    return matches.map((match)=>Number(match)).filter((num)=>Number.isFinite(num));
}
function toRange(value) {
    const numbers = extractNumbers(value);
    if (numbers.length === 0) return undefined;
    if (numbers.length === 1) return {
        min: numbers[0],
        max: numbers[0]
    };
    return {
        min: Math.min(...numbers),
        max: Math.max(...numbers)
    };
}
function getFilterRange(item, slug) {
    const facts = item.facts;
    const balance = item.geneticBalance ?? {};
    if (slug === "thc") return toRange(facts?.thcLevel);
    if (slug === "yield") return toRange(facts?.yield);
    if (slug === "cycle") return toRange(facts?.floweringCycle);
    if (slug === "height") return toRange(facts?.height ?? facts?.plantHeight);
    if (slug === "indica") return toRange(balance.indica ?? balance["ba"] ?? balance["indica"] ?? balance["Indica"]);
    if (slug === "sativa") return toRange(balance.sativa ?? balance["abo"] ?? balance["sativa"] ?? balance["Sativa"]);
    const fallback = facts?.[slug] ?? (typeof balance[slug] === "number" ? balance[slug] : undefined);
    return toRange(fallback);
}
const selectorOptionsBySlug = {
    thc: [
        {
            label: "0–10%",
            min: 0,
            max: 10
        },
        {
            label: "10–20%",
            min: 10,
            max: 20
        },
        {
            label: "20–30%",
            min: 20,
            max: 30
        },
        {
            label: "30%+",
            min: 30
        }
    ],
    yield: [
        {
            label: "0–400 g/m²",
            min: 0,
            max: 400
        },
        {
            label: "400–500 g/m²",
            min: 400,
            max: 500
        },
        {
            label: "500–650 g/m²",
            min: 500,
            max: 650
        },
        {
            label: "650+ g/m²",
            min: 650
        }
    ],
    height: [
        {
            label: "0–60 cm",
            min: 0,
            max: 60
        },
        {
            label: "60–120 cm",
            min: 60,
            max: 120
        },
        {
            label: "120–180 cm",
            min: 120,
            max: 180
        },
        {
            label: "180+ cm",
            min: 180
        }
    ],
    cycle: [
        {
            label: "0–8 weeks",
            min: 0,
            max: 8
        },
        {
            label: "8–10 weeks",
            min: 8,
            max: 10
        },
        {
            label: "10–12 weeks",
            min: 10,
            max: 12
        },
        {
            label: "12+ weeks",
            min: 12
        }
    ],
    indica: [
        {
            label: "0–40%",
            min: 0,
            max: 40
        },
        {
            label: "40–60%",
            min: 40,
            max: 60
        },
        {
            label: "60–100%",
            min: 60,
            max: 100
        }
    ],
    sativa: [
        {
            label: "0–40%",
            min: 0,
            max: 40
        },
        {
            label: "40–60%",
            min: 40,
            max: 60
        },
        {
            label: "60–100%",
            min: 60,
            max: 100
        }
    ]
};
function SeedsPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [openFilter, setOpenFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sorting, setSorting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [minPrice, setMinPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [maxPrice, setMaxPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categorySelection, setCategorySelection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [categoryFilters, setCategoryFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filtersLoading, setFiltersLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filtersError, setFiltersError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [filterValues, setFilterValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [filterSelections, setFilterSelections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [multiSelections, setMultiSelections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [categoryParam, setCategoryParam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const filterKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>JSON.stringify(filterValues), [
        filterValues
    ]);
    const pageTitle = categoryParam ? toTitleCase(categoryParam) : "All Products";
    const breadcrumbLabel = categoryParam ? pageTitle : "All Categories";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const syncCategoryFromUrl = ()=>{
            const value = new URLSearchParams(window.location.search).get("category")?.toLowerCase() ?? "";
            setCategoryParam(value);
        };
        syncCategoryFromUrl();
        window.addEventListener("popstate", syncCategoryFromUrl);
        return ()=>window.removeEventListener("popstate", syncCategoryFromUrl);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClick = (event)=>{
            const target = event.target;
            if (!target.closest("[data-filter-root]")) {
                setOpenFilter(null);
            }
        };
        document.addEventListener("click", handleClick);
        return ()=>document.removeEventListener("click", handleClick);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = window.setTimeout(()=>{
            setSearchQuery(search.trim());
        }, 300);
        return ()=>window.clearTimeout(timer);
    }, [
        search
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCategories"])().then((data)=>{
            if (!mounted) return;
            setCategories(data);
        }).catch(()=>{
            if (!mounted) return;
            setCategories([]);
        });
        return ()=>{
            mounted = false;
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCategorySelection(categoryParam);
    }, [
        categoryParam
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        if (!categoryParam) {
            setCategoryFilters([]);
            setFilterValues({});
            setFilterSelections({});
            setMultiSelections({});
            setFiltersError("");
            setFiltersLoading(false);
            return;
        }
        setFiltersLoading(true);
        setFiltersError("");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCategoryFilters"])(categoryParam).then((filters)=>{
            if (!mounted) return;
            setCategoryFilters(filters);
            setFiltersError("");
        }).catch(()=>{
            if (!mounted) return;
            setCategoryFilters([]);
            setFiltersError("No filters available for this category.");
        }).finally(()=>{
            if (!mounted) return;
            setFiltersLoading(false);
        });
        return ()=>{
            mounted = false;
        };
    }, [
        categoryParam
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setCurrentPage(1);
    }, [
        sorting,
        minPrice,
        maxPrice,
        searchQuery,
        categoryParam,
        filterKey,
        filterSelections,
        multiSelections
    ]);
    const filterOptionsBySlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const optionsMap = {};
        categoryFilters.forEach((filter)=>{
            optionsMap[filter.slug] = new Set();
        });
        items.forEach((item)=>{
            const filters = item.filters ?? {};
            Object.entries(filters).forEach(([key, rawValue])=>{
                const slug = slugifyFilterKey(key);
                if (!(slug in optionsMap)) return;
                const value = rawValue?.toString().trim();
                if (!value || value.toLowerCase() === "n/a") return;
                if (value.includes(",")) {
                    value.split(",").map((entry)=>entry.trim()).filter(Boolean).forEach((entry)=>optionsMap[slug].add(entry));
                } else {
                    optionsMap[slug].add(value);
                }
            });
        });
        return Object.fromEntries(Object.entries(optionsMap).map(([slug, set])=>[
                slug,
                Array.from(set)
            ]));
    }, [
        items,
        categoryFilters
    ]);
    const priceRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            min: minPrice ? Number(minPrice) : undefined,
            max: maxPrice ? Number(maxPrice) : undefined
        };
    }, [
        minPrice,
        maxPrice
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        const loadProducts = async ()=>{
            setLoading(true);
            setError("");
            try {
                const filtersQuery = {};
                if (categoryFilters.length > 0) {
                    categoryFilters.forEach((filter)=>{
                        const slug = filter.slug;
                        if (filter.type === "range" || filter.type === "number") {
                            const value = filterValues[slug];
                            if (value?.min) filtersQuery[`${slug}Min`] = value.min;
                            if (value?.max) filtersQuery[`${slug}Max`] = value.max;
                            return;
                        }
                        if (filter.type === "multi") {
                            const selectedValues = multiSelections[slug];
                            if (selectedValues && selectedValues.length > 0) {
                                filtersQuery[slug] = selectedValues.join(",");
                            }
                            return;
                        }
                        const selectedValue = filterSelections[slug];
                        if (selectedValue) {
                            if (filter.type === "boolean") {
                                const normalized = selectedValue.toLowerCase();
                                filtersQuery[slug] = normalized === "yes" || normalized === "true" ? "true" : "false";
                            } else {
                                filtersQuery[slug] = selectedValue;
                            }
                        }
                    });
                }
                const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllProducts"])({
                    q: searchQuery || undefined,
                    category: categoryParam || undefined,
                    sort: sortMap[sorting],
                    minPrice: priceRange.min !== undefined ? Math.round(priceRange.min * 100) : undefined,
                    maxPrice: priceRange.max !== undefined ? Math.round(priceRange.max * 100) : undefined,
                    filters: filtersQuery
                });
                if (!isMounted) return;
                const mapped = items.filter((item)=>Boolean(item.slug)).map((item)=>({
                        productId: item.slug,
                        slug: item.slug,
                        title: item.name,
                        description: item.content?.description ?? "Premium product",
                        price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatPrice"])(item.priceCents, item.currency),
                        imageUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrimaryImageUrl"])(item.images),
                        category: item.category?.slug ?? item.category?.name,
                        priceValue: item.priceCents / 100,
                        text: `${item.name} ${item.content?.description ?? ""}`.toLowerCase(),
                        createdAt: item.createdAt,
                        soldCount: item.soldCount ?? 0,
                        facts: item.content?.facts,
                        geneticBalance: item.content?.geneticBalance,
                        filters: item.filters
                    }));
                setItems(mapped);
                setTotal(mapped.length);
            } catch  {
                if (!isMounted) return;
                setItems([]);
                setTotal(0);
                setError("Failed to load products.");
            } finally{
                if (isMounted) setLoading(false);
            }
        };
        loadProducts();
        return ()=>{
            isMounted = false;
        };
    }, [
        sorting,
        priceRange,
        categoryParam,
        searchQuery,
        categoryFilters,
        filterValues,
        filterSelections,
        multiSelections
    ]);
    const filteredItems = items;
    const showSkeletons = loading && items.length === 0;
    const orderedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (filteredItems.length === 0) return [];
        const byDate = [
            ...filteredItems
        ].sort((a, b)=>{
            const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
            const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
            return bDate - aDate;
        });
        const newest = byDate.slice(0, 4);
        const remainingAfterNew = filteredItems.filter((item)=>!newest.some((newItem)=>newItem.productId === item.productId));
        const popular = [
            ...remainingAfterNew
        ].sort((a, b)=>(b.soldCount ?? 0) - (a.soldCount ?? 0)).slice(0, 4);
        const rest = remainingAfterNew.filter((item)=>!popular.some((popItem)=>popItem.productId === item.productId));
        return [
            ...newest,
            ...popular,
            ...rest
        ];
    }, [
        filteredItems
    ]);
    const totalPages = 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-pr_dg text-pr_w",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-pr_w/60",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "hover:text-pr_w",
                            children: "Home"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this),
                        " ",
                        "/",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/products",
                            className: "hover:text-pr_w",
                            children: breadcrumbLabel
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 476,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 471,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "mt-2 text-3xl font-semibold",
                    children: pageTitle
                }, void 0, false, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 480,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative z-[120] mt-4 flex flex-wrap gap-2",
                    "data-filter-root": true,
                    "data-no-reveal": "true",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            id: "category",
                            label: "Category",
                            options: [
                                {
                                    label: "All Categories",
                                    value: ""
                                },
                                ...categories.map((category)=>({
                                        label: category.name,
                                        value: category.slug
                                    }))
                            ],
                            selected: categorySelection,
                            open: openFilter === "category",
                            onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                            onSelect: (id, value)=>{
                                setCategorySelection(value);
                                const params = new URLSearchParams(window.location.search);
                                if (value) {
                                    params.set("category", value);
                                } else {
                                    params.delete("category");
                                }
                                setCategoryParam(value.toLowerCase());
                                router.push(`/products${params.toString() ? `?${params}` : ""}`);
                                setOpenFilter(null);
                            },
                            placeholder: "Category"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 487,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            id: "sorting",
                            label: "Sorting",
                            options: filterOptions.sorting,
                            selected: sorting,
                            open: openFilter === "sorting",
                            onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                            onSelect: (id, value)=>{
                                setSorting(value);
                                setOpenFilter(null);
                            },
                            placeholder: "Sorting"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 514,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            id: "price",
                            label: "Price",
                            options: filterOptions.price,
                            selected: "",
                            open: openFilter === "price",
                            onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                            onSelect: ()=>null,
                            placeholder: "Price",
                            variant: "price",
                            minPrice: minPrice,
                            maxPrice: maxPrice,
                            onMinPriceChange: (value)=>{
                                setMinPrice(value);
                            },
                            onMaxPriceChange: (value)=>{
                                setMaxPrice(value);
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 527,
                            columnNumber: 11
                        }, this),
                        !categoryParam ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center text-xs text-pr_w/60",
                            children: "Select a category to see more filters"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 547,
                            columnNumber: 13
                        }, this) : filtersLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center text-xs text-pr_w/60",
                            children: "Loading filters..."
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 551,
                            columnNumber: 13
                        }, this) : categoryFilters.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center text-xs text-pr_w/60",
                            children: filtersError || "No filters for this category."
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 555,
                            columnNumber: 13
                        }, this) : null,
                        categoryFilters.map((filter)=>(()=>{
                                const selectorOptions = selectorOptionsBySlug[filter.slug];
                                const derivedOptions = filterOptionsBySlug[filter.slug] ?? [];
                                const apiOptions = filter.options?.map((option)=>option.value) ?? [];
                                if (filter.type === "multi") {
                                    const options = apiOptions.length > 0 ? apiOptions : derivedOptions.length > 0 ? derivedOptions : selectorOptions?.map((option)=>option.label) ?? [];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        id: filter.slug,
                                        label: filter.name,
                                        options: options.map((option)=>({
                                                label: option,
                                                value: option
                                            })),
                                        selected: "",
                                        selectedValues: multiSelections[filter.slug] ?? [],
                                        open: openFilter === filter.slug,
                                        onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                        onSelect: ()=>null,
                                        onToggleValue: (id, value)=>{
                                            setMultiSelections((prev)=>{
                                                const current = prev[filter.slug] ?? [];
                                                const exists = current.includes(value);
                                                const next = exists ? current.filter((entry)=>entry !== value) : [
                                                    ...current,
                                                    value
                                                ];
                                                return {
                                                    ...prev,
                                                    [filter.slug]: next
                                                };
                                            });
                                            setOpenFilter(null);
                                        },
                                        placeholder: filter.name,
                                        multi: true
                                    }, filter.slug, false, {
                                        fileName: "[project]/app/(shop)/seeds/page.tsx",
                                        lineNumber: 575,
                                        columnNumber: 19
                                    }, this);
                                }
                                if (filter.type === "boolean") {
                                    const options = apiOptions.length > 0 ? apiOptions : derivedOptions.length > 0 ? derivedOptions : [
                                        "Yes",
                                        "No"
                                    ];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        id: filter.slug,
                                        label: filter.name,
                                        options: options.map((option)=>({
                                                label: option,
                                                value: option
                                            })),
                                        selected: filterSelections[filter.slug] ?? "",
                                        open: openFilter === filter.slug,
                                        onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                        onSelect: (id, value)=>{
                                            setFilterSelections((prev)=>({
                                                    ...prev,
                                                    [filter.slug]: value
                                                }));
                                            setOpenFilter(null);
                                        },
                                        placeholder: filter.name
                                    }, filter.slug, false, {
                                        fileName: "[project]/app/(shop)/seeds/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 19
                                    }, this);
                                }
                                if (filter.type === "select") {
                                    const options = apiOptions.length > 0 ? apiOptions : derivedOptions.length > 0 ? derivedOptions : selectorOptions?.map((option)=>option.label) ?? [];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        id: filter.slug,
                                        label: filter.name,
                                        options: options.map((option)=>({
                                                label: option,
                                                value: option
                                            })),
                                        selected: filterSelections[filter.slug] ?? "",
                                        open: openFilter === filter.slug,
                                        onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                        onSelect: (id, value)=>{
                                            setFilterSelections((prev)=>({
                                                    ...prev,
                                                    [filter.slug]: value
                                                }));
                                            setOpenFilter(null);
                                        },
                                        placeholder: filter.name
                                    }, filter.slug, false, {
                                        fileName: "[project]/app/(shop)/seeds/page.tsx",
                                        lineNumber: 641,
                                        columnNumber: 19
                                    }, this);
                                }
                                if (filter.type === "number") {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        id: filter.slug,
                                        label: filter.name,
                                        options: [],
                                        selected: "",
                                        open: openFilter === filter.slug,
                                        onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                        onSelect: ()=>null,
                                        placeholder: filter.name,
                                        variant: "number",
                                        minPrice: filterValues[filter.slug]?.min ?? "",
                                        onMinPriceChange: (value)=>setFilterValues((prev)=>({
                                                    ...prev,
                                                    [filter.slug]: {
                                                        ...prev[filter.slug],
                                                        min: value
                                                    }
                                                })),
                                        inputSuffix: filter.name.includes("%") ? "%" : ""
                                    }, filter.slug, false, {
                                        fileName: "[project]/app/(shop)/seeds/page.tsx",
                                        lineNumber: 666,
                                        columnNumber: 19
                                    }, this);
                                }
                                if (selectorOptions && selectorOptions.length > 0) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        id: filter.slug,
                                        label: filter.name,
                                        options: selectorOptions.map((option)=>({
                                                label: option.label,
                                                value: option.label
                                            })),
                                        selected: filterSelections[filter.slug] ?? "",
                                        open: openFilter === filter.slug,
                                        onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                        onSelect: (id, value)=>{
                                            setFilterSelections((prev)=>({
                                                    ...prev,
                                                    [filter.slug]: value
                                                }));
                                            if (!value) {
                                                setFilterValues((prev)=>({
                                                        ...prev,
                                                        [filter.slug]: {}
                                                    }));
                                                setOpenFilter(null);
                                                return;
                                            }
                                            const match = selectorOptions.find((option)=>option.label === value);
                                            setFilterValues((prev)=>({
                                                    ...prev,
                                                    [filter.slug]: {
                                                        min: match?.min?.toString(),
                                                        max: match?.max?.toString()
                                                    }
                                                }));
                                            setOpenFilter(null);
                                        },
                                        placeholder: filter.name
                                    }, filter.slug, false, {
                                        fileName: "[project]/app/(shop)/seeds/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 19
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$FilterDropdown$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    id: filter.slug,
                                    label: filter.name,
                                    options: [],
                                    selected: "",
                                    open: openFilter === filter.slug,
                                    onToggle: (id)=>setOpenFilter(openFilter === id ? null : id),
                                    onSelect: ()=>null,
                                    placeholder: filter.name,
                                    variant: "range",
                                    minPrice: filterValues[filter.slug]?.min ?? "",
                                    maxPrice: filterValues[filter.slug]?.max ?? "",
                                    onMinPriceChange: (value)=>setFilterValues((prev)=>({
                                                ...prev,
                                                [filter.slug]: {
                                                    ...prev[filter.slug],
                                                    min: value
                                                }
                                            })),
                                    onMaxPriceChange: (value)=>setFilterValues((prev)=>({
                                                ...prev,
                                                [filter.slug]: {
                                                    ...prev[filter.slug],
                                                    max: value
                                                }
                                            })),
                                    inputSuffix: filter.name.includes("%") ? "%" : ""
                                }, filter.slug, false, {
                                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                                    lineNumber: 736,
                                    columnNumber: 17
                                }, this);
                            })()),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex min-w-[180px] flex-1 items-center rounded-full bg-pr_w px-4 py-2 text-xs text-pr_dg sm:min-w-[220px] sm:max-w-[260px]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: search,
                                onChange: (event)=>setSearch(event.target.value),
                                placeholder: "Search products",
                                className: "w-full bg-transparent text-xs font-semibold text-pr_dg outline-none placeholder:text-pr_dg/50"
                            }, void 0, false, {
                                fileName: "[project]/app/(shop)/seeds/page.tsx",
                                lineNumber: 773,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 772,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 482,
                    columnNumber: 9
                }, this),
                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-xs text-pr_y/90",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 784,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
                    children: showSkeletons ? Array.from({
                        length: 8
                    }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-[520px] rounded-2xl bg-white/5"
                        }, `product-skeleton-${index}`, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 790,
                            columnNumber: 17
                        }, this)) : orderedItems.map((seed)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            title: seed.title,
                            description: seed.description,
                            price: seed.price,
                            isNew: false,
                            productId: seed.productId,
                            href: `/products/${seed.slug}`,
                            imageUrl: seed.imageUrl
                        }, seed.slug, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 796,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 787,
                    columnNumber: 9
                }, this),
                !loading && orderedItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-6 text-sm text-pr_w/70",
                    children: "No products found."
                }, void 0, false, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 810,
                    columnNumber: 11
                }, this) : null,
                totalPages > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-12 flex items-center justify-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setCurrentPage((prev)=>Math.max(1, prev - 1)),
                            disabled: currentPage === 1 || totalPages === 1,
                            className: "flex h-12 w-20 items-center justify-center rounded-full bg-pr_w text-pr_dg transition disabled:opacity-50",
                            children: "←"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 815,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center rounded-full bg-pr_w px-3 py-2 text-sm text-pr_dg",
                            children: Array.from({
                                length: totalPages
                            }, (_, index)=>index + 1).map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setCurrentPage(page),
                                    className: `mx-1 flex h-10 w-16 items-center justify-center rounded-full transition ${page === currentPage ? "bg-pr_dg text-pr_w" : "text-pr_dg/70 hover:text-pr_dg"}`,
                                    children: page
                                }, page, false, {
                                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                                    lineNumber: 828,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 825,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setCurrentPage((prev)=>Math.min(totalPages, prev + 1)),
                            disabled: currentPage === totalPages || totalPages === 1,
                            className: "flex h-12 w-20 items-center justify-center rounded-full bg-pr_w text-pr_dg transition disabled:opacity-50",
                            children: "→"
                        }, void 0, false, {
                            fileName: "[project]/app/(shop)/seeds/page.tsx",
                            lineNumber: 843,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(shop)/seeds/page.tsx",
                    lineNumber: 814,
                    columnNumber: 11
                }, this) : null
            ]
        }, void 0, true, {
            fileName: "[project]/app/(shop)/seeds/page.tsx",
            lineNumber: 470,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(shop)/seeds/page.tsx",
        lineNumber: 469,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_1409e424._.js.map