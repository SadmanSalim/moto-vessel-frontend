let generation = Date.now();

export function bumpStorefrontGeneration(): number {
  generation = Date.now();
  return generation;
}

export function getStorefrontGeneration(): number {
  return generation;
}
