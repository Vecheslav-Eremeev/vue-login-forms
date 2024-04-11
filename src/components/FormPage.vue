<template>
  <div class="account-management container mx-auto my-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Учетные записи</h1>
    <button class="btn-add" @click="addAccount">&#x2719;</button>
    <p class="text-center mb-4 text-gray-500 font-bold">
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель ";"
    </p>

    <div
      v-for="(account, index) in accounts"
      :key="index"
      class="account-item grid gap-6 mb-6 grid-cols-5"
    >
      <div>
        <label for="label" class="account-item-label">Метки</label>
        <input
          id="label"
          :value="getAccountLabels(account)"
          @input="updateAccountLabels(handleInputChange($event), account)"
          @blur="validateAndSave(index)"
          placeholder="Метки (разделяйте ;)"
          maxlength="50"
          class="account-input"
        />
      </div>
      <div>
        <label for="type" class="account-item-label">Тип записи</label>
        <select
          id="type"
          v-model="account.type"
          @change="validateAndSave(index)"
          class="account-input"
        >
          <option value="LDAP">LDAP</option>
          <option value="Local">Local</option>
        </select>
      </div>

      <div
        :class="{
          'col-span-2': account.type === 'LDAP' || !account.type,
          'w-full': account.type === 'Local',
        }"
      >
        <label for="login" class="account-item-label">Логин</label>
        <input
          id="login"
          v-model="account.login"
          @blur="validateAndSave(index)"
          placeholder="Логин"
          class="account-input"
          maxlength="100"
        />
      </div>

      <div v-if="account.type === 'Local'">
        <label for="password" class="account-item-label">Пароль</label>
        <input
          id="password"
          v-model="account.password"
          @blur="validateAndSave(index)"
          placeholder="Пароль"
          class="account-input"
          maxlength="100"
          required
        />
      </div>

      <button @click="deleteAccount(index)" class="btn-delete">
        <svg
          class="mx-auto w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "../store/index";

export default defineComponent({
  setup() {
    const store = useStore();
    const accounts = ref(store.$state.accounts);

    const addAccount = () => {
      accounts.value.push({
        label: [{ text: "" }],
        type: "",
        login: "",
        password: null,
      });
    };

    const handleInputChange = (event: Event) =>
      (event.target as HTMLInputElement).value;

    const deleteAccount = (index: number) => {
      accounts.value.splice(index, 1);
      store.saveAccounts(accounts.value);
    };

    const validateAndSave = (index: number) => {
      const account = accounts.value[index];
      if (
        account.login.length > 0 &&
        (account.type === "LDAP" || account.password === null)
      ) {
        account.label = account.label.map((labelObj: { text: string }) => ({
          text: labelObj.text.trim(),
        }));
        store.saveAccounts(accounts.value);
      }
    };

    const getAccountLabels = (account: any) => {
      return account.label
        .map((labelObj: { text: string }) => labelObj.text)
        .join(";");
    };

    const updateAccountLabels = (value: string, account: any) => {
      account.label = value.split(";").map((text: string) => ({ text }));
    };

    onMounted(() => {
      store.loadAccounts();
      accounts.value = store.accounts;
    });

    return {
      accounts,
      addAccount,
      deleteAccount,
      validateAndSave,
      getAccountLabels,
      updateAccountLabels,
      handleInputChange,
    };
  },
});
</script>

<style scoped>
@tailwind components;

.btn-add {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mx-auto block;
}
.account-item-label {
  @apply block mb-2 text-sm font-medium text-gray-900;
}
.account-input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}
.btn-delete {
  @apply text-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 mt-4 h-3/4 w-1/2;
}
</style>
