import { prisma, User } from "../client";

/**
 * Repository for managing User related database operations.
 */
export class UserRepository {
  /**
   * Retrieves a user by their email address.
   * @param email - The unique email address of the user.
   * @returns The User object if found, otherwise null.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Retrieves a user by their Polar Customer ID.
   * @param polarId - The unique ID assigned by Polar.sh.
   * @returns The User object if found, otherwise null.
   */
  async getUserByPolarId(polarId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { polarId },
    });
  }

  /**
   * Updates the credit balance for a specific user.
   * @param userId - The unique internal ID of the user.
   * @param amount - The number of credits to add (positive) or subtract (negative).
   * @returns The updated User object.
   */
  async updateUserCredits(userId: string, amount: number): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    });
  }

  /**
   * Updates the Polar Customer ID for a user.
   * @param userId - The unique internal ID of the user.
   * @param polarId - The new Polar Customer ID to assign.
   * @returns The updated User object.
   */
  async updatePolarId(userId: string, polarId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { polarId },
    });
  }
}
