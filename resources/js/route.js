/**
 * Route helper function that works with Ziggy routes
 * Uses the global route function provided by @routes directive
 */
export function route(name, params = {}, absolute = true) {
    // If global route function exists (from @routes directive), use it
    if (typeof window !== 'undefined' && window.route) {
        try {
            return window.route(name, params, absolute);
        } catch (error) {
            console.error(`Route "${name}" not found:`, error);
            return '#';
        }
    }
    
    // Fallback: return a placeholder if route is not available
    console.warn(`Route function not available. Route name: "${name}"`);
    return '#';
}

