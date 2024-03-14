import express, { Express, Request, Response } from "express";
import { ResultObj } from "../../lib/index";
import { verifyPhone, verifyEmail, verifyAuth } from "../../config/index";
import Admin, { v2Admin } from "../../db/models/admin";
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const server: Express = express();

//admin account
server.post("/admin/signup", async (req: Request, res: Response) => {
  const body = {
    email: req.body.email as String,
    name: req.body.name as String,
    phone: req.body.phone as String,
    auth: req.body.auth as String,
  } as v2Admin;

  try {
    if (verifyEmail(body.email)) {
      if (verifyAuth(body.auth)) {
        if (verifyPhone(body.phone)) {
          const email_check = await Admin.findOne({
            where: { email: body.email },
          });
          //encrypt auth
          const encryptedAuth = cryptoJs.AES.encrypt(
            body.auth,
            process.env.AUTH_SECRET
          ).toString();

          if (!email_check) {
            //phone check
            const phone_check = await Admin.findOne({
              where: { phone: body.phone },
            });
            if (!phone_check) {
              //create admin
              const admin = await Admin.create({
                name: body.name,
                email: body.email,
                phone: body.phone,
                auth: encryptedAuth,
              });

              const forward_result: ResultObj = {
                result: admin,
                status: true,
                reason: "account created",
              };
              res.status(201).json(forward_result);
            } else {
              const forward_result: ResultObj = {
                status: false,
                reason: "phone number already used",
              };
              res.status(409).json(forward_result);
            }
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

//admin login
server.post("/admin/login", async (req: Request, res: Response) => {
  const body = {
    phone: req.body.phone as string,
    auth: req.body.auth as string,
  } as v2Admin;
  try {
    if (verifyPhone(body.phone)) {
      const admin = await Admin.findOne({
        where: { phone: body.phone },
      });
      if (admin) {
        //decrypt the password stored in the database
        const decryptedAuth = cryptoJs.AES.decrypt(
          admin.auth,
          process.env.AUTH_SECRET
        ).toString(cryptoJs.enc.Utf8);

        if (decryptedAuth === body.auth) {
          //generate access token
          const access_token = jwt.sign(
            {
              phone: admin.phone,
              auth: admin.auth,
            },
            process.env.ACCESS_SECRET,
            {
              expiresIn: "1d",
            }
          );
          //generate a refresh token
          const refresh_token = jwt.sign(
            {
              phone: admin.phone,
              auth: admin.auth,
            },
            process.env.REFRESH_SECRET,
            { expiresIn: "7d" }
          );
          //encrypt refresh_token
          const enc_refresh_token = cryptoJs.AES.encrypt(
            JSON.stringify(refresh_token),
            process.env.ENC_REFRESH_SECRET
          ).toString();
          //store encrypted refresh_token in the db
          admin.refreshtoken = enc_refresh_token;
          await admin.save();
          //return admin
          const return_manager = {
            admin_id: admin.admin_id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            auth: admin.auth,
            refresh_token: enc_refresh_token,
            access_token: access_token,
          };
          const forward_result: ResultObj = {
            status: true,
            result: return_manager,
            reason: "login successful",
          };
          res.status(200).json(forward_result);
        } else {
          const forward_result: ResultObj = {
            status: false,
            reason: "Wrong password",
          };
          res.status(401).json(forward_result);
        }
      } else {
        const forward_result: ResultObj = {
          status: false,
          reason: "admin not found",
        };
        res.status(404).json(forward_result);
      }
    } else {
      const forward_result: ResultObj = {
        status: false,
        reason: "Wrong phone format",
      };
      res.status(400).json(forward_result);
    }
  } catch (error) {
    const forward_result: ResultObj = {
      status: false,
      reason: "Server error",
    };
    res.status(500).json(forward_result);
  }
});

module.exports = server;
