const incomplete = [
  { text: 'Cinema Lover' },
  { id: 'traveler' },
  {},
];

const incompleteTagData = [];
incomplete.forEach((tag) => {
  incompleteTagData.push(
    {
      node_a: {
        type: 'Tag',
        id: 'id',
        value: tag,
      },
    },
  );
});


module.exports = incompleteTagData;
