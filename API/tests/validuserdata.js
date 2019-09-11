const userTemplate = require('./usertemplate');

const validUserData = [];
for (let i = 0; i < userTemplate.username.valid.length; i += 1) {
  validUserData.push({
    username: userTemplate.username.valid[i],
    firstName: userTemplate.firstName.valid[i],
    lastName: userTemplate.lastName.valid[i],
    password: userTemplate.password.valid[i],
    email: userTemplate.email.valid[i],
    birthdate: userTemplate.birthdate.valid[i],
    optional: userTemplate.optional.valid[i],
    isAdmin: userTemplate.isAdmin.valid[i % 2],
  });
}

module.exports = validUserData;
