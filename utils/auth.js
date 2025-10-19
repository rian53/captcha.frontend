import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function getUserFromToken(input) {
  let jwtToken;
  
  if (typeof input === 'string') {
      jwtToken = input;
  } else if (
      input &&
      input.headers &&
      input.headers.authorization &&
      input.headers.authorization.startsWith('Bearer ')
  ) {
      jwtToken = input.headers.authorization.split(' ')[1];
  } else {
      return null;
  }
  
  const secret = serverRuntimeConfig.secret || process.env.NEXT_SECRET;

  try {
      const decoded = jwt.verify(jwtToken, secret);
      return decoded;
  } catch (error) {
      console.error('Erro ao verificar token JWT:', error);
      return null;
  }
}

export function isAdminUser(input) {
  const user = getUserFromToken(input);
  return user && user.sub === 1;
}