import { User } from "../models/user";
import { VerifiedCallback } from "passport-jwt";
import { config } from "./config";

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Waiter } from "../models/waiter";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
};

const jwtVerify = async (payload: any, done: VerifiedCallback) => {
  try {
    if (payload.type !== "access" && payload.type !== "waiterAccess") {
      throw new Error("Invalid token type");
    }

    if (payload.type == "access") {
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } else if (payload.type == "waiterAccess") {
      const waiter = await Waiter.findById(payload.sub);
      if (!waiter) {
        return done(null, false);
      }
      return done(null, waiter);
    }
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
