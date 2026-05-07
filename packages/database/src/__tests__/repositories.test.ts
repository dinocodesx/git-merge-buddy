import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRepository } from '../repositories/user.repository';
import { prisma } from '../client';

vi.mock('../client', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('UserRepository', () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    vi.clearAllMocks();
  });

  it('should get user by email', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

    const user = await repository.getUserByEmail('test@example.com');
    expect(user).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('should update user credits', async () => {
    const mockUser = { id: '1', credits: 20 };
    vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any);

    const user = await repository.updateUserCredits('1', 10);
    expect(user.credits).toBe(20);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        credits: {
          increment: 10,
        },
      },
    });
  });
});
