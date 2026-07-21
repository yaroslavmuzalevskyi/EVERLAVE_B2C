// Central feature flags. Flip a value here to enable/disable a feature
// site-wide without hunting through individual components.

// Blog: home-page section, header tab, and public /blog routes.
// Set to true to bring the blog back.
export const BLOG_ENABLED = true;

// Bitcoin payment: shown as a checkout payment method. The code path is kept
// intact (BitcoinPaymentModal, services, etc.) — this flag only controls
// whether customers can select Bitcoin at checkout. Set to true to re-enable.
export const BITCOIN_ENABLED = false;
