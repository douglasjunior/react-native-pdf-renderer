/**
 * Base Entity class
 * Provides common properties and methods for all domain entities
 */
export declare abstract class Entity<T> {
    protected readonly _id: T;
    protected readonly _createdAt: Date;
    protected _updatedAt: Date;
    constructor(id: T);
    /**
     * Get entity identifier
     */
    get id(): T;
    /**
     * Get creation timestamp
     */
    get createdAt(): Date;
    /**
     * Get last update timestamp
     */
    get updatedAt(): Date;
    /**
     * Mark entity as updated
     */
    protected touch(): void;
    /**
     * Check if two entities are equal
     */
    equals(other: Entity<T>): boolean;
    /**
     * Convert entity to plain object for serialization
     */
    abstract toPlainObject(): any;
}
//# sourceMappingURL=Entity.d.ts.map