
const date = new Date();
const orientationRelationships = [
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_hetero' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_hetero' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_hetero' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_homo' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_hetero' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_homo' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_homo' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_hetero' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_homo' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_homo' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_bi' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_hetero' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'female_pan' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'male_pan' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
];

module.exports = orientationRelationships;
