import { CustomHelpers } from "joi";

export const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({
      custom: '"{{#label}}" must be a valid mongo id',
    });
  }
  return value;
};

export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({
      custom: "password must be at lease 8 characters",
    });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({
      custom: "password must contain at least 1 letter and 1 number",
    });
  }
  return value;
};

export const username = (value: string, helpers: CustomHelpers) => {
  // Allow only lowercase letters, numbers, and underscores
  const regex = /^[a-z0-9_]+$/;

  // Check for invalid characters (anything that is not lowercase letters, numbers, or _)
  if (!regex.test(value)) {
    return helpers.message({
      custom:
        "Username can only contain lowercase letters, numbers, and underscores.",
    });
  }

  // Check for whitespace
  if (/\s/.test(value)) {
    return helpers.message({
      custom: "Username cannot contain whitespace.",
    });
  }

  // Return the value if all checks pass
  return value;
};

// export const phone = (value: string, helpers: CustomHelpers) => {};
