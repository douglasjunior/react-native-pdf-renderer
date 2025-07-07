"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
/**
 * Base Entity class
 * Provides common properties and methods for all domain entities
 */
class Entity {
    constructor(id) {
        this._id = id;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }
    /**
     * Get entity identifier
     */
    get id() {
        return this._id;
    }
    /**
     * Get creation timestamp
     */
    get createdAt() {
        return this._createdAt;
    }
    /**
     * Get last update timestamp
     */
    get updatedAt() {
        return this._updatedAt;
    }
    /**
     * Mark entity as updated
     */
    touch() {
        this._updatedAt = new Date();
    }
    /**
     * Check if two entities are equal
     */
    equals(other) {
        return this._id === other._id;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map