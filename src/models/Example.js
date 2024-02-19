const { Schema, model } = require('mongoose');

const exampleSchema = new Schema({
   tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      required: true
   }
});

const Example = model('Example', exampleSchema);

module.exports = Example;
