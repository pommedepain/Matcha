
module.exports = {
  username: {
    type: 'string',
    valid: ['Pilip2', 'Jean', 'claude', 'user4test', '78945'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '123', 'yol', 0, null],
    public: true,
  },
  firstName: {
    type: 'string',
    valid: ['Pilip', 'Jean', 'claude', 'CAMENBERT', 'trucmuch'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '1234', 'yo', 0, null],
    public: false,
  },
  lastName: {
    type: 'string',
    valid: ['Pilip', 'Jean', 'claude', 'CAMENBERT', 'trucmuch'],
    invalid: ['a', 'truc_', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', '1234', 'yo', 0, null],
    public: false,
  },
  password: {
    type: 'string',
    valid: ['Test123*', 'wqupLqxs5#', 'Ttruc20u&', 'Lala123456*', 'chIantIse_1'],
    invalid: ['test', 't1*tei', 'Test', '=/*+-=<', 'test1234<', 0, null],
    public: true,
  },
  email: {
    type: 'string',
    valid: ['test1@gmail.com', 'example@example.com', 'jean.paul@hotmail.fr', 'GAUTIER@yahoo.fr', 'testament666666@hotmail.com'],
    invalid: ['test', 'test@.com', '@yahoo.fr', '<kamille@gmail.com', '42', 0, null],
    public: false,
  },
  birthdate: {
    type: 'string',
    valid: ['1900', '2001', '1990', '1980', '1942'],
    invalid: ['1899', '2005', 'test', 0, null],
    public: false,
  },
  optional: {
    type: 'string',
    valid: ['Pilip2', 'Jean', 'claude', 'user4test', '78945'],
    invalid: ['a', 'truc_', '=/*', '`[', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', 0, null],
    public: true,
  },
  isAdmin: {
    type: 'string',
    valid: ['true', 'false'],
    invalid: ['a', 'truc_', '42', 'qwertyuiopasdfghjklzxcvbnm123456789123456789', 0, null, false],
    public: false,
  },
};
