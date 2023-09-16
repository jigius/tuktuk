/**
 * Контракт, используемый для отображения данных на странице
 */
interface IRenderContentCapable {
  /**
   * Assigns some data
   * @param key
   * @param value
   */
  with(key: string, value): IRenderContentCapable;

  /**
   * Renders a content
   */
  render(): void;
}

/**
 * Контракт, используемый для отображения инстанса некой сущности с использованием контракта `IRenderContentCapable`
 */
interface IRenderEntityCapable {
  /**
   * Renders the current entity
   * @param r
   */
  render(r: IRenderContentCapable): void;
}

export {IRenderContentCapable, IRenderEntityCapable};
