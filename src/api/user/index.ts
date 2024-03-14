import express, { Express, Request, Response } from "express";
import { ResultObj } from "../../lib/index";
import User, { v2User } from "../../db/models/user/index";
import { verifyPhone, verifyEmail, verifyAuth } from "../../config/index";
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const server: Express = express();

//account creation
server.post("/user/signup", async (req: Request, res: Response) => {
  const body = {
    email: req.body.email as String,
    name: req.body.name as String,
    phone: req.body.phone as String,
    auth: req.body.auth as String,
  } as v2User;
  try {
    if (verifyEmail(body.email)) {
      if (verifyAuth(body.auth)) {
        if (verifyPhone(body.phone)) {
          const email_check = await User.findOne({
            where: { email: body.email },
          });
          //encrypt auth
          const encryptedAuth = cryptoJs.AES.encrypt(
            body.auth,
            process.env.AUTH_SECRET
          ).toString();
          if (!email_check) {
            const user = await User.create({
              email: body.email,
              name: body.name,
              phone: body.phone,
              auth: encryptedAuth,
            });
            const forward_result: ResultObj = {
              result: user,
              status: true,
              reason: "user registered",
            };
            res.status(201).json(forward_result);
          } else {
            const forward_result: ResultObj = {
              status: false,
              reason: "email already used",
            };
            res.status(409).json(forward_result);
          }
        } else {
          const forward_result: ResultObj = {
            status: false,
            reason: "wrong contact format",
          };
          res.status(500).json(forward_result);
        }
      } else {
        const forward_result: ResultObj = {
          status: false,
          reason: "Weak password",
        };
        res.status(500).json(forward_result);
      }
    } else {
      const forward_result: ResultObj = {
        status: false,
        reason: "wrong email format",
      };
      res.status(500).json(forward_result);
    }
  } catch (error) {
    console.log(error);
    const forward_result: ResultObj = {
      status: false,
      reason: "Server error",
    };
    res.status(500).json(forward_result);
  }
});

//user login
server.post("/user/login", async (req: Request, res: Response) => {
  const body = {
    email: req.body.email as string,
    auth: req.body.auth as string,
  } as v2User;

  try {
    if (verifyEmail(body.email)) {
      const user = await User.findOne({
        where: { email: body.email },
      });
      if (user) {
        // Decrypt the password stored in the database
        const decryptedAuth = cryptoJs.AES.decrypt(
          user.auth,
          process.env.AUTH_SECRET
        ).toString(cryptoJs.enc.Utf8);

        if (decryptedAuth === body.auth) {
          //generate access token
          const access_token = jwt.sign(
            {
              phone: user.phone,
              auth: user.auth,
            },
            process.env.ACCESS_SECRET,
            {
              expiresIn: "1d",
            }
          );
          //generate a refresh token
          const refresh_token = jwt.sign(
            {
              phone: user.phone,
              auth: user.auth,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
          );
          const enc_refresh_token = cryptoJs.AES.encrypt(
            JSON.stringify(refresh_token), // stringify refresh_token before encryption
            process.env.ENC_REFRESH_SECRET
          ).toString();
          //store encrypted refresh token in the db
          user.refreshtoken = enc_refresh_token;
          await user.save();

          const return_user = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            auth: user.auth,
            refresh_token: enc_refresh_token,
            access_token: access_token,
          };
          const forward_result: ResultObj = {
            status: true,
            result: return_user,
            reason: "login sucessful",
          };
          res.status(200).json(forward_result);
        } else {
          const forward_result: ResultObj = {
            status: false,
            reason: "Wrong password",
          };
          res.status(401).json(forward_result); // Unauthorized status code
        }
      } else {
        const forward_result: ResultObj = {
          status: false,
          reason: "User not found",
        };
        res.status(404).json(forward_result); // Not Found status code
      }
    } else {
      const forward_result: ResultObj = {
        status: false,
        reason: "Wrong email format",
      };
      res.status(400).json(forward_result); // Bad Request status code
    }
  } catch (error) {
    console.error("Error:", error);
    const forward_result: ResultObj = {
      status: false,
      reason: "Server error",
    };
    res.status(500).json(forward_result); // Internal Server Error status code
  }
});

module.exports = server;
