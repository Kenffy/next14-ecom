"use server";
import "server-only";

import { EnsureUserIsAuthenticated } from "@/features/auth-page/auth-service";
import { ServerActionResponse } from "@/features/common/server-action-response";
import mongoDbConnection from "@/features/common/services/mongo";
import { Address } from "@/schemas/address";
import { AddressModel } from "@/schemas/models";


export const FindShippingAddressForCurrentUser = async (
  ): Promise<ServerActionResponse<Array<AddressModel>>> => {
    try {
      
      const ensureResponse = await EnsureUserIsAuthenticated();
      if(ensureResponse.status !== "OK") {
        return ensureResponse;
      }
      const user = ensureResponse.response;

      await mongoDbConnection();
      const resources = await Address.find({ userId: user.id });
  
      if (!resources || resources.length === 0) {
        return {
          status: "OK",
          response: [],
        };
      }

    const addressRecords = resources.map<AddressModel>((address) => {
      return { ...address, _id: address._id.toString() };
    });
  
      return {
        status: "OK",
        response: addressRecords
      };
    } catch (error) {
      return {
        status: "ERROR",
        errors: [{ message: `${error}` }],
      };
    }
  };