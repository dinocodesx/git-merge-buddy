import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PolarService } from '../billing/polar.service';

/**
 * Tests for the PolarService.
 * Verifies checkout creation logic using the Polar.sh SDK.
 */

vi.mock('@polar-sh/sdk', () => {
  return {
    Polar: class {
      constructor() {}
      checkouts = {
        create: vi.fn().mockResolvedValue({
          url: 'https://checkout.polar.sh/123',
          id: 'checkout_123'
        })
      };
    }
  };
});

describe('PolarService', () => {
  let service: PolarService;

  beforeEach(() => {
    service = new PolarService('fake-token');
  });

  it('should create a checkout session', async () => {
    const result = await service.createCheckout('price_123', 'https://success.com');
    expect(result.url).toBe('https://checkout.polar.sh/123');
    expect(result.id).toBe('checkout_123');
  });
});
