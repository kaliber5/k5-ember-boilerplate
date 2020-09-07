module.exports = {
  ci: {
    upload: {
      urlReplacementPatterns: [
        // make sure staging and preview deployments can be compared to production
        's#https:\\/\\/([0-9a-f]{7,8}\\.)?(preview|staging)#https://www#',
      ],
    },
  },
};
