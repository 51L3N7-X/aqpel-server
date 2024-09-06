import Joi from "joi";

export const joiValidate = (schema: any, objectToVerify: any) => {
  const { value, error } = Joi.compile(schema)
    .prefs({ errors: { label: "key" } })
    .validate(objectToVerify);

  if (error) {
    const errorMessage: any = error.details
      .map((details) => details.message)
      .join(", ");
    throw new Error(errorMessage);
  }
};
