/**
 * Re-export the root Tailwind config so both ports (5000 & 5173) use a single source of truth.
 * This prevents divergence in theme tokens (colors, radius, animations, etc.).
 */
const rootConfig = require('../tailwind.config.ts');
module.exports = rootConfig.default || rootConfig;
