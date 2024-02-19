const defaults = require('../../config/defaults');
const PrayerModel = require('../../models/Prayer');

/**
 * Find all prayers
 * Pagination
 * Searching
 * Sorting
 * @param{*} param0
 * @returns
 */

const findAllItems = async ({
   page = defaults.page,
   limit = defaults.limit,
   sortType = defaults.sortType,
   sortBy = defaults.sortBy,
   search = defaults.search,
   model,
   select = {},
   path = ''
}) => {
   const sortStr = `${sortType === 'dsc' ? '-' : ''}${sortBy}`;

   const filter = {
      title: { $regex: search, $options: 'i' }
   };

   const [prayers, totalItems] = await Promise.all([
      path
         ? model
              .find(filter)
              .populate({
                 path: path,
                 select
              })
              .sort(sortStr)
              .skip(page * limit - limit)
              .limit(limit)
         : model
              .find(filter)
              .sort(sortStr)
              .skip(page * limit - limit)
              .limit(limit),
      model.countDocuments(filter)
   ]);

   return {
      prayers: prayers.map(prayer => ({
         ...prayer._doc,
         id: prayer.id
      })),
      totalItems
   };
};

module.exports = {
   findAllItems
};
