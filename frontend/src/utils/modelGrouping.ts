/**
 * CAT Model Grouping Logic
 *
 * Rules (per Tim Dailey, Feb 2026):
 * 1. Strip trailing numeric suffix after space: "120M 2" -> "120M", "980G2" -> "980G"
 * 2. Strip trailing roman numerals after space: "D4H III" -> "D4H", "938G II" -> "938G"
 * 3. Do NOT strip different alpha suffixes: "980G" != "980H" (different machines)
 * 4. Do NOT strip XE suffix (different powertrain)
 * 5. Do NOT strip GC suffix (different configuration)
 */

const ROMAN_SUFFIX = /\s+(X|IX|VIII|VII|VI|V|IV|III|II|I)$/;
// Numeric suffix with space: "120M 2" -> "120M"
const NUMERIC_SUFFIX_SPACE = /\s+\d+$/;
// Numeric suffix attached after letter: "980G2" -> "980G", "257D3" -> "257D"
// Only 1-2 trailing digits (avoids stripping models like AP1000, AP455)
const NUMERIC_SUFFIX_ATTACHED = /(?<=[A-Z])\d{1,2}$/;

export function getBaseModel(modelId: string): string {
  let m = modelId.trim();
  // Check roman numerals first (longer match takes priority)
  m = m.replace(ROMAN_SUFFIX, '');
  // Then check numeric suffix with space
  m = m.replace(NUMERIC_SUFFIX_SPACE, '');
  // Then check attached numeric suffix (e.g., 980G2 -> 980G)
  m = m.replace(NUMERIC_SUFFIX_ATTACHED, '');
  return m;
}

export interface ModelGroup {
  baseModel: string;
  members: string[];
  displayName: string;
}

export function buildModelGroups(modelIds: string[]): Map<string, ModelGroup> {
  const groups = new Map<string, ModelGroup>();

  for (const id of modelIds) {
    const base = getBaseModel(id);
    if (!groups.has(base)) {
      groups.set(base, { baseModel: base, members: [], displayName: base });
    }
    groups.get(base)!.members.push(id);
  }

  // Update display names for groups with variants
  for (const group of groups.values()) {
    if (group.members.length > 1) {
      const variants = group.members
        .filter(m => m !== group.baseModel)
        .map(v => v.replace(group.baseModel, '').trim());
      group.displayName = `${group.baseModel} (incl. ${variants.join(', ')})`;
    }
  }

  return groups;
}
