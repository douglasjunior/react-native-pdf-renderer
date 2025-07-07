import { Entity } from './Entity';

/**
 * User domain entity
 * Represents a user in the system with business logic
 */
export class User extends Entity<string> {
  private _name: string;
  private _email: string;
  private _isActive: boolean;

  constructor(id: string, name: string, email: string) {
    super(id);
    this._name = name;
    this._email = email;
    this._isActive = true;
  }

  /**
   * Get user name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Get user email
   */
  get email(): string {
    return this._email;
  }

  /**
   * Check if user is active
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Update user name
   * @param name New name
   */
  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this._name = name.trim();
    this.touch();
  }

  /**
   * Update user email
   * @param email New email
   */
  updateEmail(email: string): void {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    this._email = email.toLowerCase();
    this.touch();
  }

  /**
   * Activate user account
   */
  activate(): void {
    this._isActive = true;
    this.touch();
  }

  /**
   * Deactivate user account
   */
  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): any {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}