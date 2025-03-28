<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { AxiosError } from 'axios'
import { ref } from 'vue'

const auth = useAuthStore()
const notificationStore = useNotificationStore()

const password = ref('')
const passwordConfirmation = ref('')

const passwordInput = ref<HTMLInputElement | null>(null)
const passwordConfirmationInput = ref<HTMLInputElement | null>(null)

/**
 * @var rules The rules to validate the password.
 */
const rules = [
  {
    // Verify that the password is at least 8 characters long
    validator: (value: string) => value.length >= 8,
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  {
    // Verify that the password contains at least one uppercase letter, one lowercase letter and one number
    validator: (value: string) => value.match(/^((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.*$/),
    message:
      'Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre',
  },
  {
    // Verify that the password and the confirmation are the same
    validator: (value: string) => value === passwordConfirmation.value,
    message: 'Les mots de passe ne correspondent pas',
  },
] as { validator: (value: string) => boolean; message: string }[]

const savePassword = async () => {
  if (!passwordInput.value) {
    console.warn('Password input not yet mounted')
    return
  }

  // Reset the custom validity and report the validity of the password input
  passwordInput.value.setCustomValidity('')
  passwordInput.value.reportValidity()

  // Force a reflow by accessing offsetWidth. This ensures the invalid: class is removed
  void passwordInput.value.offsetWidth

  // Check if the password is valid
  const error = rules.find((rule) => !rule.validator(password.value))

  if (error) {
    // Set the custom validity and report the validity of the password input
    passwordInput.value.setCustomValidity(error.message)
    passwordInput.value.reportValidity()

    return
  }

  try {
    // Update the password
    await auth.updatePassword({
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    // Display a success notification
    notificationStore.addNotification('Mot de passe mis à jour avec succès', 'success')

    // Reset the password inputs
    password.value = ''
    passwordConfirmation.value = ''
  } catch (error) {
    // If the password is invalid, display an error notification
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        notificationStore.addNotification(error.response?.data.message, 'error')
        return
      }
    }

    // Display an error notification
    notificationStore.addNotification(
      'Une erreur est survenue lors de la mise à jour du mot de passe',
      'error',
    )
    console.error(error)
    return
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6 bg-white rounded-sm ring-1 ring-neutral-100">
    <h2 class="text-lg font-medium">Informations générales</h2>

    <div class="flex flex-col md:grid grid-cols-[1fr_2fr] auto-rows-fr gap-1 md:items-center">
      <template v-if="auth.user?.title">
        <span class="text-neutral-500">Titre</span>
        <span class="font-semibold max-md:mb-4">{{ auth.user?.title }}</span>
      </template>

      <span class="text-neutral-500">Prénom</span>
      <span class="font-semibold max-md:mb-4">{{ auth.user?.firstname }}</span>

      <span class="text-neutral-500">Nom</span>
      <span class="font-semibold max-md:mb-4">{{ auth.user?.lastname }}</span>

      <span class="text-neutral-500">Téléphone</span>
      <span class="font-semibold max-md:mb-4">{{ auth.user?.phone_number }}</span>

      <span class="text-neutral-500">Email</span>
      <span class="font-semibold">{{ auth.user?.email }}</span>
    </div>
  </div>

  <div class="flex flex-col gap-4 p-6 bg-white rounded-sm ring-1 ring-neutral-100">
    <h2 class="text-lg font-medium">Mot de passe</h2>

    <div class="flex flex-col md:grid grid-cols-[1fr_2fr] gap-1 md:items-center">
      <label for="password" class="text-neutral-500">Mot de passe</label>
      <input
        id="password"
        type="password"
        class="font-semibold max-md:mb-4 invalid:outline-red-500 invalid:outline-1 invalid:animate-shake"
        v-model="password"
        minlength="8"
        ref="passwordInput"
      />

      <label for="passwordConfirmation" class="text-neutral-500"
        >Confirmation du mot de passe</label
      >
      <input
        id="passwordConfirmation"
        type="password"
        class="font-semibold max-md:mb-4 invalid:outline-red-500 invalid:outline-1 invalid:animate-shake"
        v-model="passwordConfirmation"
        minlength="8"
        ref="passwordConfirmationInput"
      />
    </div>

    <button
      class="self-end px-6 py-3 text-white action bg-primary align-self-end"
      @click="savePassword"
    >
      Enregistrer
    </button>
  </div>
</template>
