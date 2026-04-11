export abstract class ValueConverter<TViewValue = any, TModelValue = any> {
  public abstract toView(value: TModelValue, ...args: any[]): TViewValue;
  public abstract fromView(value: TViewValue, ...args: any[]): TModelValue;
}
