(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/apiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiFetch",
    ()=>apiFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authTokens.ts [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL ?? "";
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
    const accessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
    const headers = new Headers(init.headers || {});
    if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    const response = await fetchWithFallback(input, {
        ...init,
        headers
    });
    if (response.status !== 401) return response;
    const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRefreshToken"])();
    if (!refreshToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
        options.onUnauthorized?.();
        return response;
    }
    const data = extractAuthTokens(await refreshResponse.json().catch(()=>({})));
    if (data?.accessToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(data.accessToken);
        headers.set("Authorization", `Bearer ${data.accessToken}`);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
        options.onUnauthorized?.();
        return response;
    }
    if (data?.refreshToken) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRefreshToken"])(data.refreshToken);
    }
    return fetchWithFallback(input, {
        ...init,
        headers
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/cart.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.ts [app-client] (ecmascript)");
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
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/cart");
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
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/cart/items", {
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
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/cart/items/${encodeURIComponent(normalizedProductSlug)}`, {
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
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/cart/items/${encodeURIComponent(normalizedProductSlug)}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to remove item", response.status, error);
    }
    return response.json();
}
async function clearCart() {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/cart", {
        method: "DELETE"
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw buildApiError("Failed to clear cart", response.status, error);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/cart/AddToCartButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AddToCartButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/cart.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/AuthProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function AddToCartButton({ productId, qty = 1, label = "Add to Cart +", variant = "category", className }) {
    _s();
    const disableAuth = ("TURBOPACK compile-time value", "false") === "true";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated, isInitializing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [justAdded, setJustAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$cart$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addCartItem"])(productId, qty);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
_s(AddToCartButton, "vz2T9YDe1J/V+XbvWIiXhZkvfrQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = AddToCartButton;
var _c;
__turbopack_context__.k.register(_c, "AddToCartButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/RatingBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RatingBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function RatingBar({ label, value, total }) {
    const percent = Math.round(value / total * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 text-xs text-pr_dg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-20",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/seeds/RatingBar.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 flex-1 rounded-full bg-pr_dg/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-2 rounded-full bg-pr_lg",
                    style: {
                        width: `${percent}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/components/seeds/RatingBar.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/seeds/RatingBar.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-10 text-right text-pr_dg/60",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/seeds/RatingBar.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/seeds/RatingBar.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = RatingBar;
var _c;
__turbopack_context__.k.register(_c, "RatingBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ReviewCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function ReviewCard({ name, rating, text, images = [], createdAt, isMine, onDelete, onOpen }) {
    const visibleImages = images.slice(0, 3);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: onOpen ? "button" : undefined,
        tabIndex: onOpen ? 0 : undefined,
        onClick: onOpen,
        onKeyDown: (event)=>{
            if (!onOpen) return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen();
            }
        },
        className: "rounded-2xl bg-pr_w p-5 text-pr_dg" + (onOpen ? " cursor-pointer transition hover:shadow-sm" : ""),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-sm font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "h-5 w-5 rounded-full bg-sr_dg"
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewCard.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/seeds/ReviewCard.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            isMine && onDelete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: (event)=>{
                                    event.stopPropagation();
                                    onDelete();
                                },
                                className: "text-xs text-pr_dr",
                                children: "Delete"
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewCard.tsx",
                                lineNumber: 48,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-pr_dg/70",
                                children: [
                                    "★".repeat(rating),
                                    "☆".repeat(5 - rating)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewCard.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/seeds/ReviewCard.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/seeds/ReviewCard.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            createdAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-xs text-pr_dg/60",
                children: new Date(createdAt).toLocaleDateString()
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewCard.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-xs text-pr_dg/70",
                children: text
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewCard.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            visibleImages.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 grid grid-cols-3 gap-3",
                children: visibleImages.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: url,
                        alt: "",
                        className: "h-16 w-full rounded-lg object-cover"
                    }, `${url}-${index}`, false, {
                        fileName: "[project]/components/seeds/ReviewCard.tsx",
                        lineNumber: 74,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewCard.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/seeds/ReviewCard.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c = ReviewCard;
var _c;
__turbopack_context__.k.register(_c, "ReviewCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/Modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
function Modal({ isOpen, onClose, children, className }) {
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[120] flex items-center justify-center px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "Close modal",
                onClick: onClose,
                className: "absolute inset-0 bg-black/60"
            }, void 0, false, {
                fileName: "[project]/components/ui/Modal.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full max-w-5xl rounded-[32px] bg-pr_w p-6 text-pr_dg shadow-2xl", className),
                onClick: (event)=>event.stopPropagation(),
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/Modal.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/Modal.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/ImageLightbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ImageLightbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ImageLightbox({ images, isOpen, initialIndex = 0, onClose, title }) {
    _s();
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialIndex);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImageLightbox.useEffect": ()=>{
            if (isOpen) setIndex(initialIndex);
        }
    }["ImageLightbox.useEffect"], [
        isOpen,
        initialIndex
    ]);
    if (!isOpen || images.length === 0) return null;
    const current = images[index] ?? images[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        className: "max-w-6xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold",
                        children: title ?? "Photos"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ImageLightbox.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onClose,
                        className: "rounded-full bg-pr_dg px-4 py-2 text-xs font-semibold text-pr_w",
                        children: "Close"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ImageLightbox.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/ImageLightbox.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl bg-sr_dg/90 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: current,
                            alt: "",
                            className: "h-[360px] w-full rounded-2xl object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/ImageLightbox.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ImageLightbox.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 content-start",
                        children: images.map((img, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setIndex(idx),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border p-1 transition", idx === index ? "border-pr_dg" : "border-transparent hover:border-pr_dg/40"),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: img,
                                    alt: "",
                                    className: "h-28 w-full rounded-lg object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/ImageLightbox.tsx",
                                    lineNumber: 65,
                                    columnNumber: 15
                                }, this)
                            }, `${img}-${idx}`, false, {
                                fileName: "[project]/components/ui/ImageLightbox.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ImageLightbox.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/ImageLightbox.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/ImageLightbox.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_s(ImageLightbox, "Njy8vmbzKHnaioIgH508aZSDArk=");
_c = ImageLightbox;
var _c;
__turbopack_context__.k.register(_c, "ImageLightbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ReviewDetailModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ReviewDetailModal({ isOpen, onClose, review }) {
    _s();
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const images = review?.images ?? [];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReviewDetailModal.useEffect": ()=>{
            if (isOpen) setActiveIndex(0);
        }
    }["ReviewDetailModal.useEffect"], [
        isOpen,
        review?.images
    ]);
    if (!review) return null;
    const mainImage = images[activeIndex];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        className: "max-w-5xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onClose,
                    className: "rounded-full bg-pr_dg px-4 py-2 text-xs font-semibold text-pr_w",
                    children: "Close"
                }, void 0, false, {
                    fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl bg-sr_dg/90 p-4",
                        children: mainImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: mainImage,
                            alt: "",
                            className: "h-[320px] w-full rounded-2xl object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-[320px] w-full rounded-2xl bg-sr_dg"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                            lineNumber: 58,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 text-sm font-semibold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "h-8 w-8 rounded-full bg-sr_dg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                                lineNumber: 65,
                                                columnNumber: 15
                                            }, this),
                                            review.name
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-pr_dg/70",
                                        children: [
                                            "★".repeat(review.rating),
                                            "☆".repeat(5 - review.rating)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                        lineNumber: 68,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            review.createdAt ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-pr_dg/60",
                                children: new Date(review.createdAt).toLocaleDateString()
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-pr_dg/80",
                                children: review.text
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            images.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-3",
                                children: images.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setActiveIndex(index),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border p-1", index === activeIndex ? "border-pr_dg" : "border-transparent hover:border-pr_dg/40"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: image,
                                            alt: "",
                                            className: "h-20 w-full rounded-lg object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                            lineNumber: 96,
                                            columnNumber: 19
                                        }, this)
                                    }, `${image}-${index}`, false, {
                                        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                        lineNumber: 85,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/seeds/ReviewDetailModal.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(ReviewDetailModal, "16En7kR7TbAJMjBrm+xutVNIc5Q=");
_c = ReviewDetailModal;
var _c;
__turbopack_context__.k.register(_c, "ReviewDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ReviewFormModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewFormModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ReviewFormModal({ isOpen, onClose, rating, onRatingChange, text, onTextChange, images, onImagesChange, onSubmit, loading, error }) {
    _s();
    const [urlInput, setUrlInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleAddImage = ()=>{
        const trimmed = urlInput.trim();
        if (!trimmed) return;
        onImagesChange([
            ...images,
            trimmed
        ].slice(0, 5));
        setUrlInput("");
    };
    const handleRemove = (index)=>{
        onImagesChange(images.filter((_, idx)=>idx !== index));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        className: "max-w-4xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold",
                            children: "Write a review"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-sm text-pr_dg/70",
                            children: "Give your rate"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 flex gap-2",
                            children: Array.from({
                                length: 5
                            }, (_, index)=>index + 1).map((value)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>onRatingChange(value),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg transition", rating >= value ? "text-pr_dg" : "text-pr_dg/30"),
                                    children: "★"
                                }, value, false, {
                                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        value: text,
                        onChange: (event)=>onTextChange(event.target.value),
                        placeholder: "What should other customers know?",
                        className: "min-h-[140px] w-full rounded-2xl border border-pr_dg/30 bg-pr_w px-4 py-3 text-sm text-pr_dg outline-none"
                    }, void 0, false, {
                        fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-semibold",
                            children: "Share a photo"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 rounded-2xl border border-dashed border-pr_dg/40 p-4 text-sm text-pr_dg/60",
                            children: "Click here to upload your image (paste URL below)"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: urlInput,
                                    onChange: (event)=>setUrlInput(event.target.value),
                                    placeholder: "Image URL",
                                    className: "flex-1 rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: handleAddImage,
                                    className: "rounded-full bg-pr_dg px-4 py-2 text-sm font-semibold text-pr_w",
                                    children: "Add"
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        images.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 grid grid-cols-3 gap-3",
                            children: images.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: image,
                                            alt: "",
                                            className: "h-20 w-full rounded-xl object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                            lineNumber: 104,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>handleRemove(index),
                                            className: "absolute -right-2 -top-2 rounded-full bg-pr_dg px-2 py-1 text-xs text-pr_w",
                                            children: "×"
                                        }, void 0, false, {
                                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                            lineNumber: 109,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, `${image}-${index}`, true, {
                                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                                    lineNumber: 103,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-pr_dr",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                    lineNumber: 122,
                    columnNumber: 18
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "rounded-full border border-pr_dg/30 px-5 py-2 text-sm font-semibold text-pr_dg",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onSubmit,
                            disabled: loading,
                            className: "rounded-full bg-pr_dg px-5 py-2 text-sm font-semibold text-pr_w disabled:opacity-60",
                            children: loading ? "Creating..." : "Create"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/seeds/ReviewFormModal.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/seeds/ReviewFormModal.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/seeds/ReviewFormModal.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(ReviewFormModal, "uRBrX0hTbs69t32z9EUE3NTPrqM=");
_c = ReviewFormModal;
var _c;
__turbopack_context__.k.register(_c, "ReviewFormModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/reviews.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createReview",
    ()=>createReview,
    "deleteReview",
    ()=>deleteReview,
    "fetchReviewSummary",
    ()=>fetchReviewSummary,
    "fetchReviews",
    ()=>fetchReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiClient.ts [app-client] (ecmascript)");
;
function normalizeProductRef(productRef) {
    return productRef.trim();
}
async function fetchReviews(productId, page, limit) {
    const normalizedProductRef = normalizeProductRef(productId);
    if (!normalizedProductRef) {
        throw new Error("Product reference is required");
    }
    const resolvedProductId = encodeURIComponent(normalizedProductRef);
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${resolvedProductId}/reviews?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to load reviews");
    }
    return await response.json();
}
async function fetchReviewSummary(productId) {
    const normalizedProductRef = normalizeProductRef(productId);
    if (!normalizedProductRef) {
        throw new Error("Product reference is required");
    }
    const resolvedProductId = encodeURIComponent(normalizedProductRef);
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${resolvedProductId}/reviews/summary`);
    if (!response.ok) {
        throw new Error("Failed to load review summary");
    }
    return await response.json();
}
async function createReview(productId, data) {
    const normalizedProductRef = normalizeProductRef(productId);
    if (!normalizedProductRef) {
        throw new Error("Product reference is required");
    }
    const resolvedProductId = encodeURIComponent(normalizedProductRef);
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/products/${resolvedProductId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error?.message || error?.error || `Failed to submit review (${response.status})`);
    }
    return response.json();
}
async function deleteReview(reviewId) {
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])(`/reviews/${reviewId}`, {
        method: "DELETE"
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error?.message || error?.error || `Failed to delete review (${response.status})`);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ReviewsSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewsSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seeds/RatingBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seeds/ReviewCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ImageLightbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ImageLightbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seeds/ReviewDetailModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/seeds/ReviewFormModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/auth/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/reviews.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const emptySummary = {
    ratingAvg: 0,
    reviewCount: 0
};
const mockReviews = [
    {
        rating: 5,
        text: "Second time ordering from this store. Consistent quality, clear product information, and fast order processing.",
        createdAt: "2026-02-10T10:00:00Z",
        user: {
            name: "Alex M."
        },
        images: [
            {
                url: "https://picsum.photos/seed/review-1/300"
            },
            {
                url: "https://picsum.photos/seed/review-2/300"
            }
        ]
    },
    {
        rating: 3,
        text: "Product is okay and arrived on time. Nothing negative, but nothing outstanding either.",
        createdAt: "2026-02-05T12:00:00Z",
        user: {
            name: "Chris T."
        },
        images: [
            {
                url: "https://picsum.photos/seed/review-3/300"
            }
        ]
    },
    {
        rating: 4,
        text: "Reliable shop with good communication. Packaging was discreet and secure. Overall a smooth experience.",
        createdAt: "2026-02-01T09:00:00Z",
        user: {
            name: "Daniel S."
        },
        images: []
    }
];
const mockSummary = {
    ratingAvg: 4.5,
    reviewCount: 24
};
function ReviewsSection({ productId }) {
    _s();
    const disableAuth = ("TURBOPACK compile-time value", "false") === "true";
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [summary, setSummary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(emptySummary);
    const [reviews, setReviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [formRating, setFormRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(5);
    const [formText, setFormText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formImages, setFormImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [formLoading, setFormLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reviewModalData, setReviewModalData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isFormModalOpen, setIsFormModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pageCount = Math.max(1, Math.ceil(total / 3));
    const ratingBreakdown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewsSection.useMemo[ratingBreakdown]": ()=>{
            return reviews.reduce({
                "ReviewsSection.useMemo[ratingBreakdown]": (acc, review)=>{
                    const key = String(review.rating);
                    acc[key] = (acc[key] ?? 0) + 1;
                    return acc;
                }
            }["ReviewsSection.useMemo[ratingBreakdown]"], {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
            });
        }
    }["ReviewsSection.useMemo[ratingBreakdown]"], [
        reviews
    ]);
    const derivedSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewsSection.useMemo[derivedSummary]": ()=>{
            const reviewCount = summary.reviewCount || total || reviews.length;
            if (summary.reviewCount > 0) {
                return {
                    ratingAvg: summary.ratingAvg,
                    reviewCount
                };
            }
            if (reviews.length > 0) {
                const avg = reviews.reduce({
                    "ReviewsSection.useMemo[derivedSummary]": (sum, review)=>sum + review.rating
                }["ReviewsSection.useMemo[derivedSummary]"], 0) / reviews.length;
                return {
                    ratingAvg: avg,
                    reviewCount
                };
            }
            return {
                ratingAvg: 0,
                reviewCount
            };
        }
    }["ReviewsSection.useMemo[derivedSummary]"], [
        summary.reviewCount,
        summary.ratingAvg,
        total,
        reviews
    ]);
    const reviewImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReviewsSection.useMemo[reviewImages]": ()=>{
            return reviews.flatMap({
                "ReviewsSection.useMemo[reviewImages]": (review)=>review.images ?? []
            }["ReviewsSection.useMemo[reviewImages]"]).map({
                "ReviewsSection.useMemo[reviewImages]": (image)=>image.url
            }["ReviewsSection.useMemo[reviewImages]"]).slice(0, 6);
        }
    }["ReviewsSection.useMemo[reviewImages]"], [
        reviews
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReviewsSection.useEffect": ()=>{
            let isMounted = true;
            const load = {
                "ReviewsSection.useEffect.load": async ()=>{
                    setLoading(true);
                    try {
                        const [summaryData, reviewsData] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviewSummary"])(productId),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviews"])(productId, page, 3)
                        ]);
                        if (!isMounted) return;
                        if (summaryData.reviewCount === 0 && reviewsData.items.length > 0) {
                            const avg = reviewsData.items.reduce({
                                "ReviewsSection.useEffect.load": (sum, review)=>sum + review.rating
                            }["ReviewsSection.useEffect.load"], 0) / reviewsData.items.length;
                            setSummary({
                                ratingAvg: avg,
                                reviewCount: reviewsData.items.length
                            });
                        } else {
                            setSummary(summaryData);
                        }
                        setReviews(reviewsData.items);
                        setTotal(reviewsData.total);
                    } catch  {
                        if (!isMounted) return;
                        setSummary(mockSummary);
                        setReviews(mockReviews);
                        setTotal(mockReviews.length);
                    } finally{
                        if (isMounted) setLoading(false);
                    }
                }
            }["ReviewsSection.useEffect.load"];
            if (productId) {
                load();
            }
            return ({
                "ReviewsSection.useEffect": ()=>{
                    isMounted = false;
                }
            })["ReviewsSection.useEffect"];
        }
    }["ReviewsSection.useEffect"], [
        productId,
        page
    ]);
    const handleSubmit = async ()=>{
        if (!isAuthenticated && !disableAuth) {
            router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
            return;
        }
        if (formRating < 1 || formRating > 5) {
            setFormError("Rating must be between 1 and 5");
            return;
        }
        setFormError("");
        setFormLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createReview"])(productId, {
                rating: formRating,
                text: formText.trim() || undefined,
                images: formImages.length ? formImages : undefined
            });
            setFormText("");
            setFormRating(5);
            setFormImages([]);
            setPage(1);
            const [summaryData, reviewsData] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviewSummary"])(productId),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviews"])(productId, 1, 3)
            ]);
            if (summaryData.reviewCount === 0 && reviewsData.items.length > 0) {
                const avg = reviewsData.items.reduce((sum, review)=>sum + review.rating, 0) / reviewsData.items.length;
                setSummary({
                    ratingAvg: avg,
                    reviewCount: reviewsData.items.length
                });
            } else {
                setSummary(summaryData);
            }
            setReviews(reviewsData.items);
            setTotal(reviewsData.total);
            setIsFormModalOpen(false);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Failed to submit review");
        } finally{
            setFormLoading(false);
        }
    };
    const handleDelete = async (reviewId)=>{
        if (!reviewId) return;
        setFormError("");
        setFormLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteReview"])(reviewId);
            setPage(1);
            const [summaryData, reviewsData] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviewSummary"])(productId),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviews"])(productId, 1, 3)
            ]);
            setSummary(summaryData);
            setReviews(reviewsData.items);
            setTotal(reviewsData.total);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Failed to delete review");
        } finally{
            setFormLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-pr_w p-6 text-pr_dg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between text-sm font-semibold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Average Rate"
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 247,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    Number(derivedSummary.ratingAvg).toFixed(1),
                                                    " ★"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 248,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs text-pr_dg/60",
                                        children: [
                                            derivedSummary.reviewCount,
                                            " reviews"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "5 - Excellent",
                                                value: ratingBreakdown["5"],
                                                total: reviews.length || 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 254,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "4 - Very Good",
                                                value: ratingBreakdown["4"],
                                                total: reviews.length || 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 259,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "3 - Good",
                                                value: ratingBreakdown["3"],
                                                total: reviews.length || 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 264,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "2 - Fair",
                                                value: ratingBreakdown["2"],
                                                total: reviews.length || 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$RatingBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                label: "1 - Poor",
                                                value: ratingBreakdown["1"],
                                                total: reviews.length || 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 274,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-pr_w p-6 text-pr_dg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold",
                                        children: "Review this product"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs text-pr_dg/70",
                                        children: "Share your thoughts with other customers"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>{
                                            if (!isAuthenticated && !disableAuth) {
                                                router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
                                                return;
                                            }
                                            setIsFormModalOpen(true);
                                        },
                                        disabled: formLoading,
                                        className: "mt-4 w-full rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w disabled:opacity-60",
                                        children: formLoading ? "Submitting..." : isAuthenticated || disableAuth ? "Write a customer review" : "Sign in to review"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 287,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 282,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-pr_w p-6 text-pr_dg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold",
                                                children: "Review with images"
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 311,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setIsPhotoModalOpen(true),
                                                className: "rounded-full bg-sr_dg px-3 py-1 text-xs font-semibold text-pr_w",
                                                children: "See All Photos"
                                            }, void 0, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 312,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 grid grid-cols-3 gap-3",
                                        children: reviewImages.length > 0 ? reviewImages.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: url,
                                                alt: "",
                                                onClick: ()=>setIsPhotoModalOpen(true),
                                                className: "h-20 w-full rounded-lg object-cover"
                                            }, `${url}-${index}`, false, {
                                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                lineNumber: 323,
                                                columnNumber: 19
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-20 rounded-lg bg-sr_dg/90"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-20 rounded-lg bg-sr_dg/90"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-20 rounded-lg bg-sr_dg/90"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                                    lineNumber: 335,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 309,
                                columnNumber: 11
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-pr_w p-6 text-pr_dg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-pr_dg/70",
                                    children: "Loading reviews..."
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this) : reviews.length > 0 ? reviews.map((review, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    name: review.user?.name ?? "Anonymous",
                                    rating: review.rating,
                                    text: review.text ?? "No review text.",
                                    images: review.images?.map((image)=>image.url) ?? [],
                                    createdAt: review.createdAt,
                                    isMine: review.isMine,
                                    onDelete: review.id ? ()=>handleDelete(review.id) : undefined,
                                    onOpen: ()=>{
                                        setReviewModalData({
                                            name: review.user?.name ?? "Anonymous",
                                            rating: review.rating,
                                            text: review.text ?? "No review text.",
                                            images: review.images?.map((image)=>image.url) ?? [],
                                            createdAt: review.createdAt
                                        });
                                        setIsReviewModalOpen(true);
                                    }
                                }, review.id ?? `${review.user?.name ?? "user"}-${review.createdAt}-${index}`, false, {
                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                    lineNumber: 347,
                                    columnNumber: 15
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-pr_w p-6 text-pr_dg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-pr_dg/70",
                                    children: "No reviews yet."
                                }, void 0, false, {
                                    fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                    lineNumber: 370,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            pageCount > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setPage((prev)=>Math.max(1, prev - 1)),
                                        disabled: page === 1,
                                        className: "rounded-full border border-pr_dg/20 px-3 py-1 text-xs text-pr_dg disabled:opacity-50",
                                        children: "Prev"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-pr_dg/60",
                                        children: [
                                            "Page ",
                                            page,
                                            " of ",
                                            pageCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 384,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setPage((prev)=>Math.min(pageCount, prev + 1)),
                                        disabled: page === pageCount,
                                        className: "rounded-full border border-pr_dg/20 px-3 py-1 text-xs text-pr_dg disabled:opacity-50",
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                        lineNumber: 387,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/seeds/ReviewsSection.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ImageLightbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                images: reviewImages,
                isOpen: isPhotoModalOpen,
                onClose: ()=>setIsPhotoModalOpen(false),
                title: "Review photos"
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewDetailModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isReviewModalOpen,
                onClose: ()=>setIsReviewModalOpen(false),
                review: reviewModalData
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                lineNumber: 407,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$seeds$2f$ReviewFormModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isFormModalOpen,
                onClose: ()=>setIsFormModalOpen(false),
                rating: formRating,
                onRatingChange: setFormRating,
                text: formText,
                onTextChange: setFormText,
                images: formImages,
                onImagesChange: setFormImages,
                onSubmit: handleSubmit,
                loading: formLoading,
                error: formError
            }, void 0, false, {
                fileName: "[project]/components/seeds/ReviewsSection.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(ReviewsSection, "GaCxyKdPEaNCEJbFJm3ibLn+YNc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$auth$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ReviewsSection;
var _c;
__turbopack_context__.k.register(_c, "ReviewsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ReviewSummaryInline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReviewSummaryInline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/reviews.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ReviewSummaryInline({ productId, fallbackRating = 0 }) {
    _s();
    const [rating, setRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(fallbackRating);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReviewSummaryInline.useEffect": ()=>{
            let isMounted = true;
            const load = {
                "ReviewSummaryInline.useEffect.load": async ()=>{
                    try {
                        const summary = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$reviews$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchReviewSummary"])(productId);
                        if (!isMounted) return;
                        const value = Number(summary?.ratingAvg ?? fallbackRating);
                        setRating(Number.isFinite(value) ? value : fallbackRating);
                    } catch  {
                        if (!isMounted) return;
                        setRating(fallbackRating);
                    }
                }
            }["ReviewSummaryInline.useEffect.load"];
            if (productId) load();
            return ({
                "ReviewSummaryInline.useEffect": ()=>{
                    isMounted = false;
                }
            })["ReviewSummaryInline.useEffect"];
        }
    }["ReviewSummaryInline.useEffect"], [
        productId,
        fallbackRating
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            Number(rating ?? 0).toFixed(1),
            "★"
        ]
    }, void 0, true);
}
_s(ReviewSummaryInline, "TIv0QVPXsz1desry3jgOOiV4/qI=");
_c = ReviewSummaryInline;
var _c;
__turbopack_context__.k.register(_c, "ReviewSummaryInline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/seeds/ProductGallery.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ImageLightbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ImageLightbox.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ProductGallery({ title, images = [] }) {
    _s();
    const urls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ProductGallery.useMemo[urls]": ()=>images.map({
                "ProductGallery.useMemo[urls]": (image)=>image.url
            }["ProductGallery.useMemo[urls]"]).filter(Boolean)
    }["ProductGallery.useMemo[urls]"], [
        images
    ]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const openAt = (idx)=>{
        setIndex(idx);
        setIsOpen(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            urls.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>openAt(0),
                className: "block w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: urls[0],
                    alt: title,
                    className: "block h-[320px] w-full rounded-2xl object-cover sm:h-[420px]"
                }, void 0, false, {
                    fileName: "[project]/components/seeds/ProductGallery.tsx",
                    lineNumber: 28,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/seeds/ProductGallery.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[320px] w-full rounded-2xl bg-pr_w sm:h-[420px]"
            }, void 0, false, {
                fileName: "[project]/components/seeds/ProductGallery.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex gap-4",
                children: urls.length > 1 ? urls.slice(1, 4).map((url, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>openAt(idx + 1),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: url,
                            alt: "",
                            className: "h-16 w-16 rounded-xl object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/seeds/ProductGallery.tsx",
                            lineNumber: 45,
                            columnNumber: 15
                        }, this)
                    }, `${url}-${idx}`, false, {
                        fileName: "[project]/components/seeds/ProductGallery.tsx",
                        lineNumber: 40,
                        columnNumber: 13
                    }, this)) : [
                    0,
                    1,
                    2
                ].map((placeholder)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-16 w-16 rounded-xl bg-pr_w"
                    }, placeholder, false, {
                        fileName: "[project]/components/seeds/ProductGallery.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/seeds/ProductGallery.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ImageLightbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                images: urls,
                isOpen: isOpen,
                initialIndex: index,
                onClose: ()=>setIsOpen(false),
                title: title
            }, void 0, false, {
                fileName: "[project]/components/seeds/ProductGallery.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(ProductGallery, "lFrZ4EA6+TaX0RIxrtn1fDB8e78=");
_c = ProductGallery;
var _c;
__turbopack_context__.k.register(_c, "ProductGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_05cf41e0._.js.map