const cryptoJs = require("crypto-js");
const { ACCESS_SECRET, REFRESH_SECRET, ENC_REFRESH_SECRET } = process.env;
const jwt = require("jsonwebtoken");
import { VerifyErrors, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResultObj } from "../lib/index";

// Method for verifying password
export const verifyAuth = (auth: string): boolean => {
  const lengthRegex: RegExp = /^.{8,}$/; // At least 8 characters
  const uppercaseRegex: RegExp = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex: RegExp = /[a-z]/; // At least one lowercase letter
  const digitRegex: RegExp = /\d/; // At least one digit
  const specialCharRegex: RegExp = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

  // Check if the password meets all criteria
  const isLengthValid: boolean = lengthRegex.test(auth);
  const isUppercaseValid: boolean = uppercaseRegex.test(auth);
  const isLowercaseValid: boolean = lowercaseRegex.test(auth);
  const isDigitValid: boolean = digitRegex.test(auth);
  const isSpecialCharValid: boolean = specialCharRegex.test(auth);

  // Return true if all criteria are met, otherwise false
  return (
    isLengthValid &&
    isUppercaseValid &&
    isLowercaseValid &&
    isDigitValid &&
    isSpecialCharValid
  );
};

// Method for verifying email
export const verifyEmail = (email: string): boolean => {
  const regex: RegExp =
    /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;

  return regex.test(email);
};

// Method for verifying phone number
export const verifyPhone = (phone: string): boolean => {
  // Check if the phone number consists of exactly 10 numeric digits, including the first zero
  const phoneRegex: RegExp = /^(?:\+256\d{9}|0\d{9})$/;
  // Check if the phone number follows the specified format
  return phoneRegex.test(phone);
};

//verify access token
export const verifyAccessToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader) {
      const forward_result: ResultObj = {
        status: false,
        reason: "error | no correct token in header",
      };
      res.status(401).json(forward_result);
    } else {
      const [bearer, token] = authHeader.split(" ");
      if (bearer !== "Bearer" || !token) {
        const forward_result: ResultObj = {
          status: false,
          reason: "error | invalid token formart",
        };
        res.status(401).json(forward_result);
      } else {
        jwt.verify(
          token,
          ACCESS_SECRET,
          (err: VerifyErrors | null, decoded: JwtPayload) => {
            if (err) {
              console.log(err);
              const forward_result: ResultObj = {
                status: false,
                reason: "error | invalid token",
              };
              res.status(401).json(forward_result);
            } else {
              req.body.auth = decoded;
              next();
            }
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    const forward_result: ResultObj = {
      status: false,
      reason: "Server error",
    };
    res.status(500).json(forward_result);
  }
};

export const verifyRefreshToken = (req: Request, res: Response, next: any) => {
  const getToken = req.body.refreshtoken;

  try {
    if (!getToken) {
      const forward_result: ResultObj = {
        status: false,
        reason: "error | no correct refresh token ",
      };
      res.status(401).json(forward_result);
    } else {
      const [bearer, token] = getToken.split(" ");
      if (bearer !== "Bearer" || !token) {
        const forward_result: ResultObj = {
          status: false,
          reason: "error | invalid token formart",
        };
        res.status(401).json(forward_result);
      } else {
        jwt.verify(
          token,
          REFRESH_SECRET,
          (err: VerifyErrors | null, decoded: JwtPayload) => {
            if (err) {
              console.log(err);
              const forward_result: ResultObj = {
                status: false,
                reason: "error | invalid token",
              };
              res.status(401).json(forward_result);
            } else {
              req.body.auth = decoded;
              next();
            }
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    const forward_result: ResultObj = {
      status: false,
      reason: "Server error",
    };
    res.status(500).json(forward_result);
  }
};
