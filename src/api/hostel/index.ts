import express, { Express, Request, Response } from "express";
import { ResultObj } from "../../lib/index";
import { Hostel, HostelAttributes } from "../../db/models/hostel";
import { Property, PropertyAttributes } from "../../db/models/property";
import { verifyAccessToken, verifyRefreshToken } from "../../config";

const server: Express = express();

server.post(
  "/hostel/create",
  verifyAccessToken,
  verifyRefreshToken,
  async (req: Request, res: Response) => {
    const property_model = {
      district: req.body.district as string,
      location_1: req.body.location_1 as string,
      location_2: req.body.location_2 as string,
      google_map_coordinates: req.body.google_map_coordinates as string,
      image_paths: req.body.image_paths as string,
      video_paths: req.body.video_paths as string,
      data_sheet: req.body.data_sheet as string,
      view_count: req.body.view_count as string,
    } as PropertyAttributes;
    const body = {
      property_id: req.body.property_id as number,
      hostel_name: req.body.hostel_name as string,
      short_description: req.body.short_description as string,
      long_description: req.body.long_description as string,
      owner_id: req.body.owner_id as number,
    } as HostelAttributes;

    try {
      //validate hostel before being added
      const validate_hostel_name = await Hostel.findOne({
        where: { hostel_name: body.hostel_name },
      });
      if (!validate_hostel_name) {
        //save properties
        const property = await Property.create({
          district: property_model.district,
          location_1: property_model.location_1,
          location_2: property_model.location_2,
          google_map_coordinates: property_model.google_map_coordinates,
          image_paths: property_model.image_paths,
          video_paths: property_model.video_paths,
          data_sheet: property_model.data_sheet,
          view_count: property_model.view_count,
        });

        //create hostel
        const hostel = await Hostel.create({
          property_id: property.property_id,
          owner_id: body.owner_id,
          hostel_name: body.hostel_name,
          short_description: body.short_description,
          long_description: body.long_description,
        });

        const forward_result: ResultObj = {
          result: hostel,
          status: true,
          reason: "hostel created",
        };
        res.status(201).json(forward_result);
      } else {
        const forward_result: ResultObj = {
          status: false,
          reason: "hostel name taken",
        };
        res.status(409).json(forward_result);
      }
    } catch (error) {
      console.log(error);
      const forward_result: ResultObj = {
        status: false,
        reason: "Server error",
      };
      res.status(500).json(forward_result);
    }
  }
);
module.exports = server;
