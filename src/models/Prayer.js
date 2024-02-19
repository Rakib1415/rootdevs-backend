const { Schema, model } = require('mongoose');

const prayerSchema = new Schema({
   email: {
      type: String,
      required: true
   },
   title: {
      type: String
   },
   description: {
      type: String
   },
   admin_reply: {
      type: String
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }
});

const Prayer = model('Prayer', prayerSchema);

module.exports = Prayer;
