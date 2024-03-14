import express, { Express, Request, Response } from "express";
import { ResultObj } from "../../lib/index";
import { verifyPhone, verifyEmail, verifyAuth } from "../../config/index";
import Manager, { ManagerAttributes } from "../../db/models/manager";
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const server: Express = express();

server.post("/manager/signup", async (req: Request, res: Response) => {
  const body = {
    first_name: req.body.first_name as String,
    surname: req.body.surname as String,
    email: req.body.email as String,
    phone: req.body.phone as String,
    auth: req.body.auth as String,
    manager_type: req.body.manager_type as String,
  } as ManagerAttributes;

  try {
    if (verifyEmail(body.email)) {
      if (verifyAuth(body.auth)) {
        if (verifyPhone(body.phone)) {
          const email_check = await Manager.findOne({
            where: { email: body.email },
          });
          //encrypt auth
          const encryptedAuth = cryptoJs.AES.encrypt(
            body.auth,
            process.env.AUTH_SECRET
          ).toString();

          if (!email_check) {
            //phone check
            const phone_check = await Manager.findOne({
              where: { phone: body.phone },
            });
            if (!phone_check) {
              //create manager
              const manager = await Manager.create({
                first_name: body.first_name,
                surname: body.surname,
                email: body.email,
                phone: body.phone,
                auth: encryptedAuth,
                manager_type: body.manager_type,
              });

              const forward_result: ResultObj = {
                result: manager,
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

//user login
server.post("/manager/login", async (req: Request, res: Response) => {
  const body = {
    phone: req.body.phone as string,
    auth: req.body.auth as string,
  } as ManagerAttributes;

  try {
    if (verifyPhone(body.phone)) {
      const manager = await Manager.findOne({
        where: { phone: body.phone },
      });
      if (manager) {
        //decrypt the password stored in the database
        const decryptedAuth = cryptoJs.AES.decrypt(
          manager.auth,
          process.env.AUTH_SECRET
        ).toString(cryptoJs.enc.Utf8);

        if (decryptedAuth === body.auth) {
          //generate access token
          const access_token = jwt.sign(
            {
              phone: manager.phone,
              auth: manager.auth,
            },
            process.env.ACCESS_SECRET,
            {
              expiresIn: "1d",
            }
          );
          //generate a refresh token
          const refresh_token = jwt.sign(
            {
              phone: manager.phone,
              auth: manager.auth,
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
          manager.refreshtoken = refresh_token;
          await manager.save();
          //return admin
          const return_manager = {
            owner_id: manager.owner_id,
            first_name: manager.first_name,
            surname: manager.surname,
            email: manager.email,
            phone: manager.phone,
            auth: manager.auth,
            manager_type: manager.manager_type,
            refresh_token: refresh_token,
            access_token: access_token,
          };
          const forward_result: ResultObj = {
            status: true,
            result: return_manager,
            reason: " manager created",
          };
          res.status(200).json(forward_result);
        } else {
          const forward_result: ResultObj = {
            status: false,
            reason: "Wrong password",
          };
          res.status(401).json(forward_result);
        }

        // something is missing, some else part. It needs to be figured out
      } else {
        const forward_result: ResultObj = {
          status: false,
          reason: "manager not found",
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
