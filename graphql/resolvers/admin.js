const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateLoginInput,
  validateRegisterInput,
} = require("../../util/validators");
const Admin = require("../../models/Admin");
const Customer = require("../../models/Customer");

const { SECRET_KEY } = require("../../config");
const admin = require("../../models/Admin");
const check_auth = require("../../util/check_auth");
const Event = require("../../models/Event");

function generateToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getAllEvents() {
      try {
        const events = await Event.find().sort({ createdAt: -1 });

        return events;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async registerAdmin(_, { email, firstName, lastName, password }) {
      // Validate user data
      console.log(email, firstName, lastName, password);
      const { valid, errors } = validateRegisterInput(
        email,
        firstName,
        lastName,
        password
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user does nt already exist
      const admin = await Admin.findOne({ email });
      if (admin) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newAdmin = new Admin({
        email,
        firstName,
        lastName,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newAdmin.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async deleteCustomer(_, { id }) {
      try {
        await Customer.findByIdAndDelete(id);
        return "deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
    async createEventAdmin(
      _,
      {
        title,
        description,
        plan,
        location,
        startDate,
        endDate,
        reference,
        customer,
      }
    ) {
      if (title.trim() === "") {
        throw new Error("Event title must not be empty");
      }
      if (description.trim() === "") {
        throw new Error("Event description must not be empty");
      }

      if (location.trim() === "") {
        throw new Error("Event location must not be empty");
      }

      const newEvent = new Event({
        title,
        description,
        plan,
        location,
        startDate,
        endDate,
        reference,

        customer,
        //author: admin.email,
        createdAt: new Date().toISOString(),
      });

      const event = await newEvent.save();

      return "event Saved";
    },

    async deleteEventAdmin(_, { id }) {
      try {
        await Event.findByIdAndDelete(id);
        return "deleted";
      } catch (err) {
        throw new Error(err);
      }
    },
    async AddCustomer(_, { email, firstName, lastName, password }) {
      // Validate user data
      console.log(email, firstName, lastName, password);
      const { valid, errors } = validateRegisterInput(
        email,
        firstName,
        lastName,
        password
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // TODO: Make sure user does nt already exist
      const customer = await Customer.findOne({ email });
      if (customer) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newCustomer = new Customer({
        email,
        firstName,
        lastName,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newCustomer.save();

      return "customer added";
    },

    async loginAdmin(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const admin = await Admin.findOne({ email });

      if (!admin) {
        errors.general = "User not found";
        throw new UserInputError("Admin not found", { errors });
      }

      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(admin);

      return {
        ...admin._doc,
        id: admin._id,
        token,
      };
    },
    async UpdateProfileAdmin(
      _,
      { firstName, lastName, phone, password, id },
      context
    ) {
      const admin = check_auth(context);
      try {
        const admin = await Admin.findById(id);
        password = await bcrypt.hash(password, 12);
        if (admin) {
          await admin.update({
            firstName,
            lastName,
            phone,
            password,
          });
          return "Profile Updated Successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
