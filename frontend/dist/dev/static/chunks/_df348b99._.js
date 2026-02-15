(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/authTokens.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_TOKENS_UPDATED_EVENT",
    ()=>AUTH_TOKENS_UPDATED_EVENT,
    "clearTokens",
    ()=>clearTokens,
    "getAccessToken",
    ()=>getAccessToken,
    "getRefreshToken",
    ()=>getRefreshToken,
    "setAccessToken",
    ()=>setAccessToken,
    "setRefreshToken",
    ()=>setRefreshToken
]);
const ACCESS_TOKEN_KEY = "evervale_access_token";
const REFRESH_TOKEN_KEY = "evervale_refresh_token";
const AUTH_TOKENS_UPDATED_EVENT = "evervale-auth-tokens-updated";
function emitAuthTokensUpdated() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.dispatchEvent(new Event(AUTH_TOKENS_UPDATED_EVENT));
}
function getAccessToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}
function getRefreshToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}
function setAccessToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    emitAuthTokensUpdated();
}
function setRefreshToken(token) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    emitAuthTokensUpdated();
}
function clearTokens() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    emitAuthTokensUpdated();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/auth/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authTokens.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL ?? "";
const DISABLE_AUTH = ("TURBOPACK compile-time value", "false") === "true";
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
function buildAuthCandidateUrls(path) {
    if ("TURBOPACK compile-time truthy", 1) return [
        `${API_BASE_URL}${path}`
    ];
    //TURBOPACK unreachable
    ;
}
async function fetchAuthWithFallback(path, init = {}) {
    const urls = buildAuthCandidateUrls(path);
    let lastError;
    for(let index = 0; index < urls.length; index += 1){
        const url = urls[index];
        try {
            const response = await fetch(url, init);
            if (response.status >= 500 && index < urls.length - 1) {
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
function AuthProvider({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [accessToken, setAccessTokenState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isInitializing, setIsInitializing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const init = {
                "AuthProvider.useEffect.init": async ()=>{
                    const storedAccess = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
                    const storedRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRefreshToken"])();
                    if (storedAccess) {
                        setAccessTokenState(storedAccess);
                        setIsInitializing(false);
                        return;
                    }
                    if (storedRefresh) {
                        try {
                            const response = await fetchAuthWithFallback("/auth/refresh", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                // Support both refresh payload formats.
                                body: JSON.stringify({
                                    refreshToken: storedRefresh,
                                    token: storedRefresh
                                })
                            });
                            if (response.ok) {
                                const data = extractAuthTokens(await response.json().catch({
                                    "AuthProvider.useEffect.init.data": ()=>({})
                                }["AuthProvider.useEffect.init.data"]));
                                if (data?.accessToken) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(data.accessToken);
                                    setAccessTokenState(data.accessToken);
                                    if (data?.refreshToken) {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRefreshToken"])(data.refreshToken);
                                    }
                                } else {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
                                    setAccessTokenState(null);
                                }
                            } else {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
                                setAccessTokenState(null);
                            }
                        } catch  {
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
                            setAccessTokenState(null);
                        }
                    }
                    setIsInitializing(false);
                }
            }["AuthProvider.useEffect.init"];
            init();
        }
    }["AuthProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const syncAuthState = {
                "AuthProvider.useEffect.syncAuthState": ()=>{
                    setAccessTokenState((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])());
                }
            }["AuthProvider.useEffect.syncAuthState"];
            const handleStorage = {
                "AuthProvider.useEffect.handleStorage": (event)=>{
                    if (!event.key || event.key.includes("evervale_")) {
                        syncAuthState();
                    }
                }
            }["AuthProvider.useEffect.handleStorage"];
            window.addEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_TOKENS_UPDATED_EVENT"], syncAuthState);
            window.addEventListener("storage", handleStorage);
            return ({
                "AuthProvider.useEffect": ()=>{
                    window.removeEventListener(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_TOKENS_UPDATED_EVENT"], syncAuthState);
                    window.removeEventListener("storage", handleStorage);
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const applyTokens = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[applyTokens]": (data)=>{
            if (data?.accessToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAccessToken"])(data.accessToken);
                setAccessTokenState(data.accessToken);
            }
            if (data?.refreshToken) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRefreshToken"])(data.refreshToken);
            }
        }
    }["AuthProvider.useCallback[applyTokens]"], []);
    const login = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[login]": async (email, password)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const normalizedEmail = email.trim().toLowerCase();
            const response = await fetchAuthWithFallback("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password
                })
            });
            if (!response.ok) {
                const error = await response.json().catch({
                    "AuthProvider.useCallback[login]": ()=>({})
                }["AuthProvider.useCallback[login]"]);
                throw new Error(error?.message || "Invalid credentials");
            }
            const data = await response.json();
            const tokens = extractAuthTokens(data);
            if (!tokens.accessToken) {
                throw new Error("Login succeeded but no access token was returned");
            }
            applyTokens(tokens);
        }
    }["AuthProvider.useCallback[login]"], [
        applyTokens
    ]);
    const register = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[register]": async (name, email, password)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const normalizedEmail = email.trim().toLowerCase();
            const response = await fetchAuthWithFallback("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: normalizedEmail,
                    password
                })
            });
            if (!response.ok) {
                const error = await response.json().catch({
                    "AuthProvider.useCallback[register]": ()=>({})
                }["AuthProvider.useCallback[register]"]);
                throw new Error(error?.message || "Registration failed");
            }
            const data = extractAuthTokens(await response.json().catch({
                "AuthProvider.useCallback[register].data": ()=>({})
            }["AuthProvider.useCallback[register].data"]));
            if (data?.accessToken) {
                applyTokens(data);
                return;
            }
            await login(normalizedEmail, password);
        }
    }["AuthProvider.useCallback[register]"], [
        applyTokens,
        login
    ]);
    const logout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuthProvider.useCallback[logout]": async ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRefreshToken"])();
            try {
                if (refreshToken) {
                    await fetchAuthWithFallback("/auth/logout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            refreshToken
                        })
                    });
                }
            } finally{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authTokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
                setAccessTokenState(null);
                router.push("/");
            }
        }
    }["AuthProvider.useCallback[logout]"], [
        router
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthProvider.useMemo[value]": ()=>({
                accessToken,
                isAuthenticated: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : Boolean(accessToken),
                isInitializing: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : isInitializing,
                login,
                register,
                logout
            })
    }["AuthProvider.useMemo[value]"], [
        accessToken,
        isInitializing,
        login,
        logout,
        register
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/auth/AuthProvider.tsx",
        lineNumber: 313,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "RwOZ2XLXYkZWDpF0UUc/57V4ZHo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/ScrollReveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScrollReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const TARGET_SELECTOR = [
    "main section",
    "main article",
    "main aside",
    "main div",
    "main h1",
    "main h2",
    "main h3",
    "main h4",
    "main h5",
    "main h6",
    "main p",
    "main span",
    "main li",
    "main a",
    "main button",
    "main img",
    "main input",
    "main textarea",
    "main label",
    "main blockquote"
].join(", ");
function isRevealCandidate(element) {
    if (element.closest("svg")) return false;
    if (element.dataset.noReveal === "true") return false;
    if (element.closest("[data-no-reveal='true']")) return false;
    if (element.closest("[data-filter-root]")) return false;
    const className = typeof element.className === "string" ? element.className : "";
    if (className.includes("opacity-0") || className.includes("scale-") || className.includes("pointer-events-none")) {
        return false;
    }
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return false;
    return !(element.clientWidth === 0 && element.clientHeight === 0);
}
function ScrollReveal() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollReveal.useEffect": ()=>{
            const main = document.querySelector("main");
            if (!main) return;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            let sequence = 0;
            const processed = new WeakSet();
            const revealObserver = !reducedMotion && "IntersectionObserver" in window ? new IntersectionObserver({
                "ScrollReveal.useEffect": (entries, observer)=>{
                    for (const entry of entries){
                        if (!entry.isIntersecting) continue;
                        const target = entry.target;
                        target.classList.add("scroll-reveal-visible");
                        observer.unobserve(target);
                    }
                }
            }["ScrollReveal.useEffect"], {
                threshold: 0.12,
                rootMargin: "0px 0px -10% 0px"
            }) : null;
            const registerElement = {
                "ScrollReveal.useEffect.registerElement": (element)=>{
                    if (processed.has(element) || !isRevealCandidate(element)) return;
                    processed.add(element);
                    element.classList.add("scroll-reveal-hidden");
                    element.style.setProperty("--scroll-reveal-delay", `${Math.min(sequence % 8 * 45, 315)}ms`);
                    sequence += 1;
                    if (!revealObserver) {
                        element.classList.add("scroll-reveal-visible");
                        return;
                    }
                    revealObserver.observe(element);
                }
            }["ScrollReveal.useEffect.registerElement"];
            const scan = {
                "ScrollReveal.useEffect.scan": (root)=>{
                    if (root instanceof HTMLElement && root.matches(TARGET_SELECTOR)) {
                        registerElement(root);
                    }
                    const elements = root.querySelectorAll(TARGET_SELECTOR);
                    for (const element of elements){
                        registerElement(element);
                    }
                }
            }["ScrollReveal.useEffect.scan"];
            const frame = window.requestAnimationFrame({
                "ScrollReveal.useEffect.frame": ()=>{
                    scan(main);
                }
            }["ScrollReveal.useEffect.frame"]);
            const mutationObserver = new MutationObserver({
                "ScrollReveal.useEffect": (mutations)=>{
                    for (const mutation of mutations){
                        for (const addedNode of mutation.addedNodes){
                            if (!(addedNode instanceof HTMLElement)) continue;
                            scan(addedNode);
                        }
                    }
                }
            }["ScrollReveal.useEffect"]);
            mutationObserver.observe(main, {
                childList: true,
                subtree: true
            });
            return ({
                "ScrollReveal.useEffect": ()=>{
                    window.cancelAnimationFrame(frame);
                    mutationObserver.disconnect();
                    revealObserver?.disconnect();
                }
            })["ScrollReveal.useEffect"];
        }
    }["ScrollReveal.useEffect"], [
        pathname
    ]);
    return null;
}
_s(ScrollReveal, "V/ldUoOTYUs0Cb2F6bbxKSn7KxI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ScrollReveal;
var _c;
__turbopack_context__.k.register(_c, "ScrollReveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_df348b99._.js.map