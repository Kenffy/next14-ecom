import { AddressModel, UserModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";

class ProfileState {
  public errors: string[] = [];
  public user: UserModel | undefined;
  public addresses: AddressModel[] = [];
  public defaultAddress: AddressModel | undefined;

  public initProfileSession({ user, addresses }: { user: UserModel, addresses: AddressModel[] }) {
    this.user = user;
    this.addresses = addresses;
    this.defaultAddress = addresses.find((address) => address.default);
  }

  public updateErrors(errors: string[]) {
    this.errors = errors;
  }

  public updateUser(user: UserModel) {
    this.user = user;
  }
}

export const profileStore = proxy(new ProfileState());

export const useProfileState = () => {
  return useSnapshot(profileStore, {
    sync: true,
  });
};
