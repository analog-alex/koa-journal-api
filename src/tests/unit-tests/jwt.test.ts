import { JsonWebToken } from '../../utils/jwt';
import { expect } from 'chai';
import 'mocha';

describe('JWT utility tests', () => {

  it('should generate a signed JWT', () => {

    const secret = 'this_is_a_secret';
    const minutes = 1;

    const jwt = JsonWebToken.signJwt(secret, minutes);

    expect(jwt).is.not.empty;

  });

  it('should validate a signed JWT with the same secret', () => {

    const secret = 'this_is_a_secret';
    const minutes = 1;

    const jwt = JsonWebToken.signJwt(secret, minutes);
    const validated = JsonWebToken.verifyJwt(secret, jwt);

    expect(validated).is.not.empty;

  });

  it('should contain claims with the pre-defined value', () => {

    const secret = 'this_is_a_secret';
    const minutes = 1;

    const jwt = JsonWebToken.signJwt(secret, minutes);
    const validated = JsonWebToken.verifyJwt(secret, jwt) as any;

    expect(validated.iss).equals('journal-api');
    expect(validated.sub).equals('authorized-user');
    expect(validated.aud).equals('user');

  });

  it('should throw JsonWebTokenError, invalid signature', () => {

    const secret = 'this_is_a_secret';
    const wrongSecret = 'this_is_a_wrong_secret';
    const minutes = 1;

    const jwt = JsonWebToken.signJwt(secret, minutes);

    expect(() => JsonWebToken.verifyJwt(jwt, wrongSecret)).to.throw();
  });
});
