const { AuthenticationError, UserInputError } = require("apollo-server");

const Event = require("../../models/Event");
const Guest = require("../../models/Guest");
const checkAuth = require("../../util/check_auth");
const { validateEventInput } = require("../../util/validators");

module.exports = {
  Query: {
    async getEvents() {
      try {
        const events = await Event.find().sort({ createdAt: -1 });
        return events;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getEvent(_, { eventId }) {
      try {
        const event = await Event.findById(eventId);
        if (event) {
          return event;
        } else {
          throw new Error("Event not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getMessage() {
      return "bonjour";
    },
  },
  Mutation: {
    async createEvent(
      _,
      { title, description, plan, location, startDate, endDate, reference },
      context
    ) {
      const customer = checkAuth(context);

      const { valid, errors } = validateEventInput(
        title,
        description,
        location
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const newEvent = new Event({
        title,
        description,
        plan,
        location,
        startDate,
        endDate,
        reference,

        customer: customer.id,
        author: customer.email,
        createdAt: new Date().toISOString(),
      });

      const event = await newEvent.save();

      context.pubsub.publish("NEW_EVENT", {
        newEvent: event,
      });

      return event;
    },
    // **********************************************************************
    async updateEvent(
      _,
      { title, description, plan, location, startDate, endDate, id }
    ) {
      //const customer = checkAuth(context);
      const { valid, errors } = validateEventInput(
        title,
        description,
        location
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      try {
        const event = await Event.findById(id);
        console.log("update ---------------------------------");
        // console.log(customer.id + "-" + event.customer);

        await event.update({
          title,
          description,
          plan: event.plan,
          location,
          startDate,
          endDate,
        });
        return "event updated successfully";
      } catch (err) {
        throw new Error(err);
      }

      //return event;
    },
    //*********************************************************************************** */

    async deleteEvent(_, { id, reference }) {
      //const customer = checkAuth(context);

      try {
        const event = await Event.findById(id);

        const guest = await Guest.findOne({ reference: reference });
        //console.log(customer.id + "-" + event.customer);
        if (event) {
          await event.delete();
          await guest.delete();

          return "event deleted successfully";
        } else {
          console.log("********");
          return "****";
          // throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newEvent: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_EVENT"),
    },
  },
};
