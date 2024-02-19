const defaults = require('../config/defaults');

/**
 * Finds documents based on the specified queries.
 *
 * @param {Object} options - Options for the find operation.
 * @param {Object} options.model - The Mongoose model to perform the find operation on.
 * @param {Object} options.queries - Query parameters for the find operation.
 * @param {number} [options.queries.page=1] - The page number for pagination.
 * @param {number} [options.queries.limit=10] - The maximum number of documents to return per page.
 * @param {string} [options.queries.search] - The search query string to filter documents. Search need to be sent "field:value", where "field" is the field to search in and "value" is the regex to search.
 * @param {string} [options.queries.paginate='false'] - Flag to determine if pagination should be applied.
 * @param {Object} [options.queries.filter] - Additional filter criteria for the find operation.
 * @param {string} [options.queries.sortBy] - The field by which to sort the results. A string in the format "field:order", where "field" is the field to sort by and "order" is either "asc" or "desc".
 * @param {string} [options.queries.populate] - The field to populate in the result documents.
 *
 * @returns {Object} - An object containing the results of the find operation.
 * @returns {Array} [Object.docs] - An array of found documents.
 * @returns {number} [Object.page] - The current page number.
 * @returns {boolean} [Object.hasNext] - A flag indicating whether there are more documents beyond the current page.
 * @throws {Error} - Throws an error if the find operation encounters an issue.
 */
module.exports.find = async ({ model, queries }) => {
   try {
      const { page = 1, limit = 10 } = queries;

      // Apply search filter if search query is provided
      if (queries.search) {
         const search = queries.search;
         const split = search.split(':');
         queries.filter = {
            [split[0]]: { $regex: split[1], $options: 'i' }
         };
      }

      queries.sortBy = queries.sortBy && {
         [queries.sortBy.split(':')[0]]: queries.sortBy.endsWith('desc')
            ? -1
            : 1
      };

      // Perform find operation based on provided queries
      if (queries.paginate === 'false' || queries.filter) {
         const docs = await model
            .find(queries.filter && queries.filter)
            .sort({ ...(!queries.sortBy ? { createdAt: -1 } : queries.sortBy) })
            [queries.populate ? 'populate' : 'then'](queries.populate);
         return { docs };
      }

      // Perform paginated find operation and count total documents
      const skip = (page - 1) * limit;
      const [docs, total] = await Promise.all([
         model
            .find()
            .limit(limit)
            .skip(skip)
            .sort({ ...(!queries.sortBy ? { createdAt: -1 } : queries.sortBy) })
            [queries.populate ? 'populate' : 'then'](queries.populate),
         model.countDocuments()
      ]);

      // Determine hasNext flag based on pagination
      const hasNext = total > skip;
      return { docs, page, hasNext };
   } catch (err) {
      console.log(err);
   }
};

module.exports.getTransformedItems = ({ items = [], selection = [] }) => {
   if (!Array.isArray(items) || !Array.isArray(selection)) {
      throw new Error('Invalid selection');
   }

   if (selection.length === 0) {
      return items.map(item => ({ ...item }));
   }

   return items.map(item => {
      const result = {};
      selection.forEach(key => {
         result[key] = item[key];
      });
      return result;
   });
};

module.exports.getPagination = ({
   totalItems = defaults.totalItems,
   limit = defaults.limit,
   page = defaults.page
}) => {
   const totalPage = Math.ceil(totalItems / limit);

   const pagination = {
      page,
      limit,
      totalItems,
      totalPage
   };

   if (page < totalPage) {
      pagination.next = page + 1;
   }

   if (page > 1) {
      pagination.prev = page - 1;
   }

   return pagination;
};
