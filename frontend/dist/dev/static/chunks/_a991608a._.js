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
"[project]/components/ui/CategoryCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function CategoryCard({ title, description, active = false, index = 0, href }) {
    const cornerClass = index % 2 === 0 ? "rounded-tr-2xl rounded-bl-2xl" : "rounded-tl-2xl rounded-br-2xl";
    const card = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex min-h-[180px] h-full flex-col justify-end border border-white/10 px-6 pb-5 pt-4 transition", cornerClass, active ? "bg-sr_dg text-pr_w" : "bg-pr_w text-pr_dg"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-lg font-semibold",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/ui/CategoryCard.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-1 text-sm", active ? "text-pr_w/70" : "text-sr_g"),
                children: description
            }, void 0, false, {
                fileName: "[project]/components/ui/CategoryCard.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/CategoryCard.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "block h-full",
            children: card
        }, void 0, false, {
            fileName: "[project]/components/ui/CategoryCard.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    return card;
}
_c = CategoryCard;
var _c;
__turbopack_context__.k.register(_c, "CategoryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/categories.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCategories",
    ()=>fetchCategories,
    "fetchCategoryFilters",
    ()=>fetchCategoryFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL ?? "";
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/services/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "https://vale-express-backend.onrender.com") ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL ?? "";
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/categories/Categories.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Categories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$CategoryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/CategoryCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/categories.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/services/products.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const fallbackCategories = [];
function Categories() {
    _s();
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [hasError, setHasError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Categories.useEffect": ()=>{
            let mounted = true;
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$categories$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCategories"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$services$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllProducts"])()
            ]).then({
                "Categories.useEffect": ([categoryData, productData])=>{
                    if (!mounted || categoryData.length === 0) return;
                    const categorySet = new Set(productData.map({
                        "Categories.useEffect": (product)=>product.category?.slug ?? product.category?.name
                    }["Categories.useEffect"]).filter(Boolean).map({
                        "Categories.useEffect": (value)=>value?.toLowerCase()
                    }["Categories.useEffect"]));
                    const filtered = categoryData.filter({
                        "Categories.useEffect.filtered": (category)=>categorySet.has(category.slug?.toLowerCase() ?? "")
                    }["Categories.useEffect.filtered"]);
                    setCategories(filtered.length > 0 ? filtered : categoryData);
                    setHasError(false);
                }
            }["Categories.useEffect"]).catch({
                "Categories.useEffect": ()=>{
                    if (!mounted) return;
                    setHasError(true);
                    setCategories(fallbackCategories);
                }
            }["Categories.useEffect"]).finally({
                "Categories.useEffect": ()=>{
                    if (!mounted) return;
                    setLoading(false);
                }
            }["Categories.useEffect"]);
            return ({
                "Categories.useEffect": ()=>{
                    mounted = false;
                }
            })["Categories.useEffect"];
        }
    }["Categories.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-semibold text-pr_w",
                                children: "Categories"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/categories/Categories.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: " text-sm text-pr_w/70 sm:text-base",
                                children: "Browse product categories for cultivation and distribution"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/categories/Categories.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/categories/Categories.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/products",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "category",
                            children: "All Categories"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/categories/Categories.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/sections/categories/Categories.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/categories/Categories.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
                children: loading ? Array.from({
                    length: 8
                }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `min-h-[180px] rounded-2xl border border-white/10 bg-white/5`
                    }, `category-skeleton-${index}`, false, {
                        fileName: "[project]/components/sections/categories/Categories.tsx",
                        lineNumber: 65,
                        columnNumber: 15
                    }, this)) : categories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$CategoryCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        title: category.name,
                        description: category.description ?? "Browse products in this category",
                        index: index,
                        href: category.slug ? `/products?category=${category.slug}` : "/products"
                    }, category.slug ?? category.name, false, {
                        fileName: "[project]/components/sections/categories/Categories.tsx",
                        lineNumber: 71,
                        columnNumber: 15
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/categories/Categories.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            hasError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-xs text-pr_w/70",
                children: "Could not load categories from API. Showing offline data."
            }, void 0, false, {
                fileName: "[project]/components/sections/categories/Categories.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/categories/Categories.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(Categories, "rKmCLokMvjnaQM0dZaLqYmdZWsU=");
_c = Categories;
var _c;
__turbopack_context__.k.register(_c, "Categories");
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
"[project]/components/sections/proof-scale/ProofScale.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProofScale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript) <export default as AtSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const cards = [
    {
        title: "12+",
        description: "B2B Contracts Organized",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
            className: "h-8 w-8 text-sr_dg"
        }, void 0, false, {
            fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
            lineNumber: 17,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        title: "400+ KG",
        description: "Seeds Sold Peer Month",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
            className: "h-8 w-8 text-sr_dg"
        }, void 0, false, {
            fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
            lineNumber: 22,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        title: "2026",
        description: "Founded This Year",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
            className: "h-8 w-8 text-sr_dg"
        }, void 0, false, {
            fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
            lineNumber: 27,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        title: "EU Network",
        description: "European Presence",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AtSign$3e$__["AtSign"], {
            className: "h-8 w-8 text-sr_dg"
        }, void 0, false, {
            fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
            lineNumber: 32,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function useInView(threshold = 0.2) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInView.useEffect": ()=>{
            if (!ref.current) return;
            const element = ref.current;
            const observer = new IntersectionObserver({
                "useInView.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(element);
                    }
                }
            }["useInView.useEffect"], {
                threshold
            });
            observer.observe(element);
            return ({
                "useInView.useEffect": ()=>observer.disconnect()
            })["useInView.useEffect"];
        }
    }["useInView.useEffect"], [
        threshold
    ]);
    return {
        ref,
        isVisible
    };
}
_s(useInView, "Wk8baY7uc+CWSrD2kMBp+I8qtIg=");
function ProofCardItem({ title, description, icon, index }) {
    _s1();
    const { ref, isVisible } = useInView(0.25);
    const isOpposite = index % 2 === 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `flex h-full min-h-[380px] flex-col items-center justify-between bg-pr_w p-8 text-center text-sr_dg ${isOpposite ? "rounded-br-3xl rounded-tl-3xl" : "rounded-bl-3xl rounded-tr-3xl"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-16 w-16 items-center justify-center",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `transition-all duration-700 ease-out will-change-transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-3xl font-semibold",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm font-semibold sm:text-base",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
_s1(ProofCardItem, "KKr2sRzgpS+Jr0V7dwcQA8zVokk=", false, function() {
    return [
        useInView
    ];
});
_c = ProofCardItem;
function ProofScale() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-3xl font-semibold text-pr_w",
                children: "Proof & Scale"
            }, void 0, false, {
                fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
                children: cards.map((card, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProofCardItem, {
                        index: index,
                        ...card
                    }, card.title, false, {
                        fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/proof-scale/ProofScale.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c1 = ProofScale;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProofCardItem");
__turbopack_context__.k.register(_c1, "ProofScale");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>AtSign
]);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "4",
            key: "4exip2"
        }
    ],
    [
        "path",
        {
            d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
            key: "7n84p3"
        }
    ]
];
const AtSign = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("at-sign", __iconNode);
;
 //# sourceMappingURL=at-sign.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript) <export default as AtSign>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AtSign",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$at$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/at-sign.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Lightbulb
]);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
            key: "1gvzjb"
        }
    ],
    [
        "path",
        {
            d: "M9 18h6",
            key: "x1upvd"
        }
    ],
    [
        "path",
        {
            d: "M10 22h4",
            key: "ceow96"
        }
    ]
];
const Lightbulb = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("lightbulb", __iconNode);
;
 //# sourceMappingURL=lightbulb.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Lightbulb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>List
]);
/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 5h.01",
            key: "18ugdj"
        }
    ],
    [
        "path",
        {
            d: "M3 12h.01",
            key: "nlz23k"
        }
    ],
    [
        "path",
        {
            d: "M3 19h.01",
            key: "noohij"
        }
    ],
    [
        "path",
        {
            d: "M8 5h13",
            key: "1pao27"
        }
    ],
    [
        "path",
        {
            d: "M8 12h13",
            key: "1za7za"
        }
    ],
    [
        "path",
        {
            d: "M8 19h13",
            key: "m83p4d"
        }
    ]
];
const List = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("list", __iconNode);
;
 //# sourceMappingURL=list.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "List",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_a991608a._.js.map