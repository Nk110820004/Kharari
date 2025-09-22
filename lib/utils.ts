
export type ClassValue = string | number | null | boolean | undefined | ClassValue[];

export const cn = (...inputs: ClassValue[]): string => {
  const classSet = new Set<string>();

  function processInput(input: ClassValue) {
    if (!input) return;

    if (typeof input === 'string' || typeof input === 'number') {
      classSet.add(String(input));
    } else if (Array.isArray(input)) {
      for (const item of input) {
        processInput(item);
      }
    }
  }
  
  for (const input of inputs) {
    processInput(input);
  }
  
  return Array.from(classSet).join(' ');
};
