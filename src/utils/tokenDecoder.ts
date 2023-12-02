import * as jose from 'jose';
import {JWTPayload} from 'jose';

export function tokenDecoder(jwtToken: string): JWTPayload | null {
  try {
    const decodedToken = jose.decodeJwt(jwtToken);
    if (!decodedToken) {
      throw new Error('Invalid JWT token');
    }
    return decodedToken;
  } catch (error) {
    console.error('Error decoding JWT token : ', error);
    return null;
  }
}

export function getRemainingTimeBeforeExpiration(exp: number): number {
  try {
    const currentTimeInSeconds: number = Math.floor(Date.now() / 1000);
    const remainingTimeInSeconds: number = exp - currentTimeInSeconds;

    if (remainingTimeInSeconds < 0) {
      return 0; // Token already expired
    }

    return Math.floor(remainingTimeInSeconds / 60); // in Minutes
  } catch (error) {
    console.error('Error calculating remainingTime:', error);
    return 0; // Return 0 to indicate an error or expired token
  }
}
