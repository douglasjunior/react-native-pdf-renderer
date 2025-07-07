/**
 * Base interface for all repositories
 * Defines common CRUD operations following Repository pattern
 */
export interface IRepository<T, ID> {
  /**
   * Find entity by ID
   * @param id Entity identifier
   * @returns Promise resolving to entity or null if not found
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Find all entities
   * @returns Promise resolving to array of entities
   */
  findAll(): Promise<T[]>;

  /**
   * Save entity (create or update)
   * @param entity Entity to save
   * @returns Promise resolving to saved entity
   */
  save(entity: T): Promise<T>;

  /**
   * Delete entity by ID
   * @param id Entity identifier
   * @returns Promise resolving to void
   */
  delete(id: ID): Promise<void>;

  /**
   * Check if entity exists
   * @param id Entity identifier
   * @returns Promise resolving to boolean
   */
  exists(id: ID): Promise<boolean>;
}