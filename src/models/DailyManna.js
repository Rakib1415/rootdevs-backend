const { Schema, model } = require('mongoose');

const dailyMannaSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   date: {
      type: String,
      required: true
   }
});

const DailyManna = model('DailyManna', dailyMannaSchema);

module.exports = DailyManna;
