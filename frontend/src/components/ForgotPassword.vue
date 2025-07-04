<template>
  <div class="d-flex justify-content-center align-items-center vh-100 text-white">
    <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
      <h3 class="text-white text-center mb-3">Esqueci minha senha</h3>

      <form @submit.prevent="sendEmail">
        <input
          v-model="email"
          type="email"
          class="form-control mb-3"
          placeholder="Digite seu e-mail"
          required
        />
        <button class="btn btn-warning w-100 fw-bold">Enviar link</button>
      </form>

      <p class="text-success mt-2 text-center" v-if="success">{{ success }}</p>
      <p class="text-danger mt-2 text-center" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const success = ref('')
const error = ref('')

const sendEmail = async () => {
  success.value = ''
  error.value = ''
  try {
    const response = await fetch('http://localhost:3000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Erro desconhecido')

    success.value = result.message
  } catch (err: any) {
    error.value = err.message
  }
}
</script>
