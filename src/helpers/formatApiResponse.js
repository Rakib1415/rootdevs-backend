const formatApiResponse = (status, message, data = null) => {
   return {
      status,
      message,
      data
   };
};

module.exports = formatApiResponse;
