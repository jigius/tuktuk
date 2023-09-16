/**
 * Избавляет от надобности постоянно проверять возвращаемые значение на null
 * Добавлен контроль типа для возвращаемых значений
 */

function querySelectorSafe<T extends HTMLElement>(target: Document | HTMLElement, selector: string): T {
  const element: T = target.querySelector(selector) as T;
  if (!element) {
    throw new Error("not found");
  }
  if (!(element instanceof T)) {
    throw new Error("invalid type");
  }
  return element as T;
}

function closestSafe<T extends HTMLElement>(target: HTMLElement, selector: string): T {
  const element: T = target.querySelector(selector) as T;
  if (!element) {
    throw new Error("not found");
  }
  if (!(element instanceof T)) {
    throw new Error("invalid type");
  }
  return element as T;
}

function queryAttributeSafe(target: HTMLElement, name: string): string {
  const attr: string | null = target.getAttribute(name) as string | null;
  if (!attr) {
    throw new Error("not found");
  }
  return attr;
}

export {querySelectorSafe, closestSafe, queryAttributeSafe};
