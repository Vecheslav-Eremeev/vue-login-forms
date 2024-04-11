import { defineStore } from "pinia";

type Account = {
  label: Array<{ text: string }>;
  type: string;
  login: string;
  password: string | null;
};

export const useStore = defineStore("account", {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    saveAccounts(accounts: Account[]) {
      this.accounts = accounts;
      localStorage.setItem("accounts", JSON.stringify(accounts));
    },
    loadAccounts() {
      const accounts = localStorage.getItem("accounts");
      if (accounts) {
        this.accounts = JSON.parse(accounts);
      }
    },
  },
});
