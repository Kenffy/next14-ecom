import { UserModel } from "@/schemas/models";
import { proxy, useSnapshot } from "valtio";


class AdminUserState {
    public users: Array<UserModel> = [];

    public initAdminUserSession({
        users,
      }: {
        users: Array<UserModel>;
      }) {
        this.users = users;
    }

};

export const adminUserStore = proxy(new AdminUserState());

export const useAdminUserState = () => {
  return useSnapshot(adminUserStore, { sync: true });
};