
const date = new Date();
const orientationRelationships = [
  {
    node_a: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_hetero' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_hetero' },
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
      properties: { id: 'm_hetero' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_bi' },
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
      properties: { id: 'm_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_homo' },
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
      properties: { id: 'm_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_bi' },
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
      properties: { id: 'm_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_bi' },
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
      properties: { id: 'm_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_bi' },
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
      properties: { id: 'm_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_hetero' },
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
      properties: { id: 'f_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_bi' },
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
      properties: { id: 'f_bi' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_homo' },
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
      properties: { id: 'f_homo' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_homo' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_pan' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_hetero' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_homo' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_bi' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_bi' },
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
      properties: { id: 'f_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_homo' },
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
      properties: { id: 'f_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_bi' },
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
      properties: { id: 'f_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_bi' },
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
      properties: { id: 'f_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_hetero' },
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
      properties: { id: 'f_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'f_pan' },
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
      properties: { id: 'm_pan' },
    },
    node_b: {
      label: 'Orientation',
      id: 'id',
      properties: { id: 'm_pan' },
    },
    relation: {
      label: 'LOOK_FOR',
      properties: { creationDate: date.toISOString() },
    },
  },
];

module.exports = orientationRelationships;