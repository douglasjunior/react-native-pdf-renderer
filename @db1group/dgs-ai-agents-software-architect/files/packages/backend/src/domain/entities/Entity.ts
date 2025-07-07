/**
 * Base Entity class
 * Provides common properties and methods for all domain entities
 */
export abstract class Entity<T> {
  protected readonly _id: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: T) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  /**
   * Get entity identifier
   */
  get id(): T {
    return this._id;
  }

  /**
   * Get creation timestamp
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Get last update timestamp
   */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Mark entity as updated
   */
  protected touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Check if two entities are equal
   */
  equals(other: Entity<T>): boolean {
    return this._id === other._id;
  }

  /**
   * Convert entity to plain object for serialization
   */
  abstract toPlainObject(): any;
}