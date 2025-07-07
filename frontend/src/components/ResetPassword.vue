<template>
  <div class="reset-password-page d-flex align-items-center justify-content-center vh-100">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 400px;">
      <h2 class="text-center text-white fw-bold mb-3">Redefinir senha</h2>

      <form v-if="!success" @submit.prevent="submit">
        <div class="mb-3">
          <label for="password" class="form-label text-white">Nova senha</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control"
            placeholder="Digite sua nova senha"
            required
          />
          <small v-if="password.length > 0 && password.length < 8" class="text-danger">
            A senha deve ter no mínimo 8 caracteres.
          </small>
        </div>

        <button
          type="submit"
          class="btn btn-primary w-100 fw-semibold rounded-pill"
          :disabled="password.length < 8"
        >
          Redefinir senha
        </button>
      </form>

      <p class="text-success mt-3 text-center fw-bold" v-if="success">{{ success }}</p>
      <p class="text-danger mt-3 text-center fw-bold" v-if="error">{{ error }}</p>

      <router-link to="/login" class="btn btn-outline-light w-100 mt-3 rounded-pill">
        Voltar ao login
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const password = ref('')
const success = ref('')
const error = ref('')
const token = ref('')

const route = useRoute()

onMounted(() => {
  token.value = route.query.token as string || ''
})

const submit = async () => {
  success.value = ''
  error.value = ''

  try {
    const response = await fetch('https://eps-emprendimentos.onrender.com/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token.value,
        newPassword: password.value
      })
    })

    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Erro ao redefinir a senha.')

    success.value = result.message || 'Senha redefinida com sucesso!'
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.reset-password-page {
  background: radial-gradient(circle at top, #00dc82 5%, #0f0f1b 50%, #000 100%);
  padding: 1rem;
}
.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
}
</style>
