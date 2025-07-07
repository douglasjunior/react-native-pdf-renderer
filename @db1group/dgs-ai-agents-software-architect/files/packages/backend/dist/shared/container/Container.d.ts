/**
 * Simple Dependency Injection Container
 * Manages object lifecycle and dependencies following DI principles
 */
export declare class Container {
    private services;
    private singletons;
    private factories;
    /**
     * Register a service with its implementation
     * @param name Service name/identifier
     * @param implementation Service implementation or factory function
     * @param singleton Whether to create a singleton instance
     */
    register<T>(name: string, implementation: new (...args: any[]) => T, singleton?: boolean): void;
    /**
     * Register a factory function
     * @param name Service name/identifier
     * @param factory Factory function that returns the service instance
     */
    registerFactory<T>(name: string, factory: () => T): void;
    /**
     * Register a singleton instance
     * @param name Service name/identifier
     * @param instance Service instance
     */
    registerInstance<T>(name: string, instance: T): void;
    /**
     * Resolve a service by name
     * @param name Service name/identifier
     * @returns Service instance
     */
    resolve<T>(name: string): T;
    /**
     * Check if a service is registered
     * @param name Service name/identifier
     * @returns True if service is registered
     */
    has(name: string): boolean;
    /**
     * Clear all registered services
     */
    clear(): void;
}
export declare const container: Container;
//# sourceMappingURL=Container.d.ts.map