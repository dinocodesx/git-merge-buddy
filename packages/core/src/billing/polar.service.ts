import "dotenv/config";
import { Polar } from "@polar-sh/sdk";

/**
 * Service for managing payments and subscriptions via Polar.sh.
 */
export class PolarService {
  private polar: Polar;

  /**
   * Initializes the Polar service.
   * @param accessToken - The Organization Access Token (OAT) from Polar.sh. Defaults to POLAR_ACCESS_TOKEN from environment.
   * @param server - The environment to target ('sandbox' or 'production'). Defaults to 'sandbox'.
   */
  constructor(
    accessToken: string = process.env.POLAR_ACCESS_TOKEN!,
    server: "sandbox" | "production" = "sandbox"
  ) {
    if (!accessToken) {
      throw new Error("Polar access token is required. Set POLAR_ACCESS_TOKEN in .env or pass it to the constructor.");
    }
    this.polar = new Polar({
      accessToken,
      server,
    });
  }

  /**
   * Creates a checkout session for a specific product.
   * @param productPriceId - The Polar.sh product price ID (starts with 'price_').
   * @param successUrl - The URL to redirect to after successful payment.
   * @param customerEmail - Optional email to pre-fill the checkout form.
   * @returns A Checkout object containing the checkout URL.
   */
  async createCheckout(productPriceId: string, successUrl: string, customerEmail?: string) {
    return this.polar.checkouts.create({
      productPriceId,
      successUrl,
      customerEmail,
    });
  }

  // TODO: Add more polar-specific logic here (e.g. webhooks, subscription checks)
}
