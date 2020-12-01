export class Validators {

  public static strIsBlank(str: string): boolean {
    return ! this.strIsNotBlank(str);
  }

  public static strIsNotBlank(str: string): boolean {
    return str != null && str !== undefined && str !== '';
  }

  public static isBearerToken(str: string): boolean {
    return str.startsWith('Bearer ');
  }
}
