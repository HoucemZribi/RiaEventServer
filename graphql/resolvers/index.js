const eventsResolvers = require("./events");
const usersResolvers = require("./customers");
const guestResolvers = require("./guests");
const adminResolvers = require("./admin");
module.exports = {
  Query: {
    ...adminResolvers.Query,
    ...usersResolvers.Query,
    ...eventsResolvers.Query,
    ...guestResolvers.Query,
  },
  Mutation: {
    ...adminResolvers.Mutation,
    ...usersResolvers.Mutation,
    ...eventsResolvers.Mutation,
    ...guestResolvers.Mutation,
  },
};
