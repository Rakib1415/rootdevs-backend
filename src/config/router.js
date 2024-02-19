const express = require('express');
const path = require('path');
const verifyAuthJWT = require('../middlewares/verifyAuthJWT');
const userRoute = require('../routes/mobile/userRoute');
const adminRoute = require('../routes/admin/adminRoute');
const videoCategoryRoute = require('../routes/admin/videoCategoryRoute');
const qaCategoryRoute = require('../routes/admin/qaCategoryRoute');
const posterCategoryRoute = require('../routes/admin/posterCategoryRoute');
const qaRoute = require('../routes/admin/qaRoute');
const songBookRoute = require('../routes/admin/songBookRoute');
const songsRoute = require('../routes/admin/songsRoute');
const posterRoute = require('../routes/admin/posterRoute');
const contentManagementRoute = require('../routes/admin/contentManagementRoute');
const languageRoute = require('../routes/admin/languageRoute');
const versionRoute = require('../routes/admin/versionRoute');
const bookRoute = require('../routes/admin/bookRoute');
const chapterRoute = require('../routes/admin/chapterRoute');
const verseRoute = require('../routes/admin/verseRoute');
const tagRoute = require('../routes/admin/tagRoute');
const dictionaryRoute = require('../routes/admin/dictionaryRoute');
const prayerRoute = require('../routes/admin/prayerRoute');
const dailyMannaRoute = require('../routes/admin/dailyMannaRoute');

const createRoutes = app => {
   // 'public' directory access
   app.use(express.static(path.join(__dirname, '../../public')));

   // secure routes starts with '/api'
   app.use('/api/user', userRoute);
   app.use('/api/admin', adminRoute);
   app.use('/api/video-category', videoCategoryRoute);
   app.use('/api/qa-category', qaCategoryRoute);
   app.use('/api/qa', qaRoute);
   app.use('/api/song-book', songBookRoute);
   app.use('/api/songs', songsRoute);
   app.use('/api/poster-category', posterCategoryRoute);
   app.use('/api/poster', posterRoute);
   app.use('/api/cms', contentManagementRoute);
   app.use('/api/language', languageRoute);
   app.use('/api/version', versionRoute);
   app.use('/api/book', bookRoute);
   app.use('/api/chapter', chapterRoute);
   app.use('/api/verse', verseRoute);
   app.use('/api/tag', tagRoute);
   app.use('/api/dictionary', dictionaryRoute);
   app.use('/api/prayer', prayerRoute);
   app.use('/api/daily-manna', dailyMannaRoute);

   app.use(verifyAuthJWT); // Below this middleware, routes will require auth access token
   // Other routes here
};

module.exports = createRoutes;
