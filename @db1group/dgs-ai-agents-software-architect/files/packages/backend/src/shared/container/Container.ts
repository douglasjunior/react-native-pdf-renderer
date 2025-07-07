/**
 * Simple Dependency Injection Container
 * Manages object lifecycle and dependencies following DI principles
 */
export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  /**
   * Register a service with its implementation
   * @param name Service name/identifier
   * @param implementation Service implementation or factory function
   * @param singleton Whether to create a singleton instance
   */
  register<T>(name: string, implementation: new (...args: any[]) => T, singleton: boolean = true): void {
    if (singleton) {
      this.services.set(name, implementation);
    } else {
      this.factories.set(name, () => new implementation());
    }
  }

  /**
   * Register a factory function
   * @param name Service name/identifier
   * @param factory Factory function that returns the service instance
   */
  registerFactory<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }

  /**
   * Register a singleton instance
   * @param name Service name/identifier
   * @param instance Service instance
   */
  registerInstance<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
  }

  /**
   * Resolve a service by name
   * @param name Service name/identifier
   * @returns Service instance
   */
  resolve<T>(name: string): T {
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
  has(name: string): boolean {
    return this.services.has(name) || this.factories.has(name) || this.singletons.has(name);
  }

  /**
   * Clear all registered services
   */
  clear(): void {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
}

// Global container instance
export const container = new Container();