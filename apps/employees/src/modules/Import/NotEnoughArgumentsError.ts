export class NotEnoughArgumentsError extends Error {
  constructor(required: number, received: number) {
    super(`Zła ilość argumentów. Wymagane: ${required}, Uzyskano: ${received}`);
    Object.setPrototypeOf(this, NotEnoughArgumentsError.prototype);
  }
}

export default NotEnoughArgumentsError;
