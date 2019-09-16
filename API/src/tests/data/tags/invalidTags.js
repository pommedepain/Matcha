
const invalid = [
  { id: 'cinema2', text: 'Cinema Lover' },
  { id: 'cat', text: 'Cat Perso1n' },
];

const invalidTagData = [];
invalid.forEach((tag) => {
  invalidTagData.push(
    {
      node_a: {
        type: 'Tag',
        id: 'id',
        value: tag,
      },
    },
  );
});


module.exports = invalidTagData;
