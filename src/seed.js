const mongoose = require('mongoose');
const connectToDatabase = require('./config/db');
const LanguageModel = require('./models/Language');
const VersionModel = require('./models/Version');
const BookModel = require('./models/Book');
const ChapterModel = require('./models/Chapter');
const VerseModel = require('./models/Verse');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const seedDb = async () => {
   try {
      connectToDatabase();

      const versions = await ChapterModel.find();

      const newDatas = [];
      versions.map((item, index) => {
         newDatas.push({
            language: item.language,
            version: item.version,
            book: item.book,
            chapter: item._id,
            verse_text: 'this is verse text' + index,
            verse_id: 'Textdfdf',
            status: '1'
         });
      });

      await VerseModel.deleteMany();
      await VerseModel.insertMany(newDatas);

      //   const languages = [];
      //   for (let i = 1; i <= 16000; i++) {
      //      languages.push({
      //         language_code: i + '',
      //         language_name: 'english' + i,
      //         english_name: 'english' + i,
      //         status: '1'
      //      });
      //   }

      mongoose.connection.close();
   } catch (error) {
      console.error('Error occuring to seedDb', error);
   }
};

(async () => {
   try {
      await seedDb();
      console.log(`verses added successful`);
   } catch (error) {
      console.log(error);
   }
})();
