import jwt from 'jsonwebtoken';

export class JsonWebToken {

  private static MINUTE_IN_SECONDS: number = 60;

  /* ===============
    Create a JWT signed with a secret
  */
  public static signJwt(secret: string, expMinutes: number): string {

    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: 'journal-api',
      sub: 'authorized-user',
      aud: 'user',
      // with X minutes of TTL (time-to-live)
      exp: now + (expMinutes * this.MINUTE_IN_SECONDS),
      // pad one second in the not-before
      nbf: now - this.MINUTE_IN_SECONDS,
    };

    return jwt.sign(payload, secret);
  }

  /* ===============
    Verify a JWT
    -> throw error on parsing failure
    --> so caller must catch the errors
  */
  public static verifyJwt(secret: string, token: string): string | object {
    return jwt.verify(token, secret);
  }
}
