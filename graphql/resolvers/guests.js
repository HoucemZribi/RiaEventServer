const { AuthenticationError, UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const Guest = require("../../models/Guest");
const checkAuth = require("../../util/check_auth");
const {
  validateGuestInput,
  validateLoginGuest,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");

function generateToken(guest) {
  return jwt.sign(
    {
      id: guest.id,
      email: guest.email,
      firstName: guest.firstName,
      lastName: guest.lastName,
      reference: guest.reference,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Query: {
    async getGuests() {
      try {
        const guests = await Guest.find();
        return guests;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getGuest(_, { guestId }) {
      try {
        const guest = await Guest.findById(guestId);
        if (guest) {
          return guest;
        } else {
          throw new Error("Guest not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async loginGuest(_, { email, reference }) {
      const { errors, valid } = validateLoginGuest(email, reference);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const guest = await Guest.findOne({ email });

      if (!guest) {
        return "Not Invited";
      }

      const match = reference === guest.reference;
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      } else return "Invited";

      //const token = generateToken(guest);
    },
    addGuest: async (_, { email, firstName, lastName, reference }, context) => {
      const customer = checkAuth(context);
      const { errors, valid } = validateGuestInput(
        email,
        firstName,
        lastName,
        reference
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const newGuest = new Guest({
        firstName,
        lastName,
        email,
        reference,

        customer: customer.id,

        createdAt: new Date().toISOString(),
      });
      const guest = await newGuest.save();

      context.pubsub.publish("NEW_GUEST", {
        newGuest: guest,
      });

      return guest;
    },
    async deleteGuest(_, { id }) {
      //const customer = checkAuth(context);

      try {
        await Guest.findByIdAndDelete(id);

        // await guest.delete();
        return "guest deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
    async checkGuest(_, { qrData }) {
      //const customer = checkAuth(context);

      try {
        const guests = await Guest.find();
        for (let i = 0; i < guests.length; i++) {
          var qr = `Name :${guests[i].firstName}${guests[i].lastName} Email: ${guests[i].email} Event Reference:${guests[i].reference}`;
          // console.log(qr);
          // console.log(qrData);
          //console.log(guests[i]);
          console.log("----");
          console.log(qrData);
          console.log(qr);
          console.log("----");
          if (qr === qrData) return "Invited";
        }
        return "Not invited";

        // await guest.delete();
        // return "guest deleted successfully";
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Subscription: {
    newGuest: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_GUEST"),
    },
  },
};
