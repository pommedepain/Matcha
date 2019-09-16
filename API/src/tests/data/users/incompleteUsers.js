const _ = require('lodash');
const userTemplate = require('../../../util/userTemplate');

const completeUser = {};
Object.keys(userTemplate).forEach((property) => {
  const [validprop] = userTemplate[property].valid[0];
  completeUser[property] = validprop;
});

const incompleteUserData = [];
Object.keys(userTemplate).forEach((property) => {
  incompleteUserData.push(
    {
      node_a: {
        type: 'User',
        id: 'username',
        value: _.omit(completeUser, property),
      },
    },
  );
});

module.exports = incompleteUserData;
