"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.Container = void 0;
/**
 * Simple Dependency Injection Container
 * Manages object lifecycle and dependencies following DI principles
 */
class Container {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
        this.factories = new Map();
    }
    /**
     * Register a service with its implementation
     * @param name Service name/identifier
     * @param implementation Service implementation or factory function
     * @param singleton Whether to create a singleton instance
     */
    register(name, implementation, singleton = true) {
        if (singleton) {
            this.services.set(name, implementation);
        }
        else {
            this.factories.set(name, () => new implementation());
        }
    }
    /**
     * Register a factory function
     * @param name Service name/identifier
     * @param factory Factory function that returns the service instance
     */
    registerFactory(name, factory) {
        this.factories.set(name, factory);
    }
    /**
     * Register a singleton instance
     * @param name Service name/identifier
     * @param instance Service instance
     */
    registerInstance(name, instance) {
        this.singletons.set(name, instance);
    }
    /**
     * Resolve a service by name
     * @param name Service name/identifier
     * @returns Service instance
     */
    resolve(name) {
        // Check if singleton instance already exists
        if (this.singletons.has(name)) {
            return this.singletons.get(name);
        }
        // Check if factory exists
        if (this.factories.has(name)) {
            const factory = this.factories.get(name);
            if (factory) {
                return factory();
            }
        }
        // Create singleton instance
        if (this.services.has(name)) {
            const ServiceClass = this.services.get(name);
            const instance = new ServiceClass();
            this.singletons.set(name, instance);
            return instance;
        }
        throw new Error(`Service '${name}' not found in container`);
    }
    /**
     * Check if a service is registered
     * @param name Service name/identifier
     * @returns True if service is registered
     */
    has(name) {
        return this.services.has(name) || this.factories.has(name) || this.singletons.has(name);
    }
    /**
     * Clear all registered services
     */
    clear() {
        this.services.clear();
        this.singletons.clear();
        this.factories.clear();
    }
}
exports.Container = Container;
// Global container instance
exports.container = new Container();
//# sourceMappingURL=Container.js.map