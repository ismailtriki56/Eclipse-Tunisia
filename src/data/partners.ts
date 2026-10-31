export interface Partner {
  id: string;
  name: string;
  /** Path under /public, only set after an official file is supplied. */
  logoPath: string | null;
  website: string | null;
  /** Must remain false until the owner confirms the partnership in writing. */
  confirmed: boolean;
}

/**
 * Partner logos are never fabricated.
 *
 * Add an entry only after the owner supplies an official logo file and
 * confirms the partnership. The home page renders nothing until at least one
 * entry has `confirmed: true`.
 */
export const partners: Partner[] = [];

export function confirmedPartners(): Partner[] {
  return partners.filter((partner) => partner.confirmed && partner.logoPath);
}
