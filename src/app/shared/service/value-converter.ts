export abstract class ValueConverter {
  public abstract toView(value: any, ...args: any[]): any;
  public abstract fromView(value: any, ...args: any[]): any;
}
