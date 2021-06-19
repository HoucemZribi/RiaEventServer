const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const Customer = require("../../models/Customer");
const check_auth = require("../../util/check_auth");

function generateToken(customer) {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const customer = await Customer.findOne({ email });

      if (!customer) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, customer.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(customer);

      return {
        ...customer._doc,
        id: customer._id,
        token,
      };
    },
    async loginMobile(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const customer = await Customer.findOne({ email });

      if (!customer) {
        return "No account";
      }

      const match = await bcrypt.compare(password, customer.password);
      if (!match) {
        return "Account";
      }

      //const token = generateToken(customer);
    },
    async UpdateProfile(_, { firstName, lastName, phone, password, id }) {
      try {
        var updatedProfile = {
          firstName,
          lastName,
          phone,
        };
        var _customer = await Customer.findById(id);
        if (password && password.length > 0) {
          const _password = await bcrypt.hash(password, 12);
          updatedProfile = { ...updatedProfile, password: _password };
        }

        if (_customer) {
          await Customer.updateOne({ _id: id }, updatedProfile);
          var customer = await Customer.findById(id);
          const token = generateToken(customer);
          customer = { ...customer._doc, id: customer._id, token };
          console.log(customer);
          return customer;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async register(_, { email, firstName, lastName, password }) {
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

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
  Query: {
    async getCustomers() {
      try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        return customers;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
