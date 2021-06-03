module.exports.validateRegisterInput = (
  email,
  firstName,
  lastName,
  password
) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  if (firstName.trim() === "") {
    errors.firstName = "First Name must not be empty";
  }
  if (lastName.trim() === "") {
    errors.lastName = "Last Name must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
module.exports.validateUpdateInput = (firstName, lastName, password) => {
  const errors = {};

  if (firstName.trim() === "") {
    errors.firstName = "First Name must not be empty";
  }
  if (lastName.trim() === "") {
    errors.lastName = "Last Name must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
module.exports.validateEventInput = (title, description, location) => {
  const errors = {};
  if (title.trim() === "") {
    errors.title = "Title must not be empty";
  }

  if (description.trim() === "") {
    errors.description = "Description must not be empty";
  }
  if (location.trim() === "") {
    errors.location = "location must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
module.exports.validateLoginGuest = (email, reference) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (reference.trim() === "") {
    errors.password = "Event Reference must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
module.exports.validateGuestInput = (email, firstName, lastName, reference) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    var regEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
      console.log(email);
    }
    if (email.match(regEx)) {
      console.log("Valid address ");
    }
  }

  if (firstName.trim() === "") {
    errors.firstName = "First Name must not be empty";
  }
  if (lastName.trim() === "") {
    errors.lastName = "Last Name must not be empty";
  }
  if (reference.trim() === "") {
    errors.reference = "Reference must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
