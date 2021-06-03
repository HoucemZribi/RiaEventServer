const { gql } = require("apollo-server");

module.exports = gql`
  type Event {
    id: ID!
    title: String!
    description: String!
    createdAt: String!
    plan: String!
    location: String!
    startDate: String
    endDate: String
    customer: ID!
    reference: String!
    guestCount: Int!
  }
  type Guest {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    reference: String!
    createdAt: String!
    token: String!
  }

  type Customer {
    id: ID!
    email: String!
    password: String!
    phone: String
    token: String!
    firstName: String!
    lastName: String!
    createdAt: String!
  }
  type Admin {
    id: ID!
    email: String!
    password: String!
    phone: String
    token: String!
    firstName: String!
    lastName: String!
    createdAt: String
  }
  input RegisterInput {
    firstName: String!
    lastName: String!
    password: String!
    email: String!
  }
  type Query {
    getEvents: [Event]
    getAllEvents: [Event]
    getEvent(eventId: ID!): Event
    getMessage: String
    getGuests: [Guest]
    getCustomers: [Customer]
    getGuest(guestId: ID!): Guest
  }
  type Mutation {
    register(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): Customer!
    AddCustomer(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): String!
    registerAdmin(
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    ): Admin!
    login(email: String, password: String): Customer!
    loginAdmin(email: String!, password: String!): Admin!
    loginGuest(email: String!, reference: String!): String!
    UpdateProfile(
      id: ID!
      phone: String
      password: String
      firstName: String!
      lastName: String!
    ): Customer!
    UpdateProfileAdmin(
      id: ID!
      phone: String!
      password: String!
      firstName: String!
      lastName: String!
    ): String!
    createEvent(
      title: String!
      description: String!
      plan: String!
      reference: String!
      location: String!
      startDate: String!
      endDate: String!
    ): Event!
    createEventAdmin(
      title: String!
      description: String!
      plan: String!
      reference: String!
      location: String!
      startDate: String!
      endDate: String!
      customer: ID!
    ): String!
    deleteEvent(id: ID!, reference: String!): String!
    updateEvent(
      id: ID!
      title: String!
      description: String!
      plan: String!
      location: String!
      startDate: String!
      endDate: String!
    ): String!
    addGuest(
      firstName: String!
      lastName: String!
      email: String!
      reference: String!
    ): Guest!

    deleteGuest(id: ID!): String!
    deleteCustomer(id: ID!): String!
    deleteEventAdmin(id: ID!): String!
    checkGuest(qrData: String!): String!
  }
`;
