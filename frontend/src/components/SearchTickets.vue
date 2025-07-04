<template>
  <div class="search-page d-flex flex-column align-items-center text-white vh-100 pt-5 px-3">
    <div class="gradient-overlay"></div>

    <h2 class="mb-4 text-center fw-bold">Buscar Chamado</h2>

    <input
      v-model="searchTerm"
      @keyup.enter="searchTicket"
      class="form-control mb-3 w-100"
      style="max-width: 500px;"
      placeholder="Digite ID do Ticket, Nome do Cliente ou Nota de Serviço"
    />

    <button @click="searchTicket" class="btn btn-success fw-semibold px-4 mb-4">Buscar</button>

    <div v-if="loading" class="text-white">Buscando chamado...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div v-if="result" class="card text-dark p-3" style="max-width: 600px; width: 100%;">
      <h5><strong>Cliente:</strong> {{ result.cliente }}</h5>
      <p><strong>Empresa:</strong> {{ result.empresa }}</p>
      <p><strong>Nota de Serviço:</strong> {{ result.notaServico }}</p>
      <p><strong>Descrição:</strong> {{ result.descricaoServico }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchTerm = ref('')
const result = ref<any>(null)
const loading = ref(false)
const error = ref('')

const baseUrl = 'https://eps-emprendimentos.onrender.com/tickets'

const searchTicket = async () => {
  result.value = null
  error.value = ''
  loading.value = true

  try {
    const term = searchTerm.value.trim()

    let response

    if (/^[a-f0-9]{24}$/i.test(term)) {
      // É um ID de ticket
      response = await fetch(`${baseUrl}/${term}`)
    } else {
      // Primeiro tenta como nota de serviço
      response = await fetch(`${baseUrl}/nota/${encodeURIComponent(term)}`)
      if (!response.ok) {
        // Se não encontrar por nota, tenta por cliente
        response = await fetch(`${baseUrl}/cliente/${encodeURIComponent(term)}`)
      }
    }

    if (!response.ok) throw new Error('Chamado não encontrado.')

    const data = await response.json()
    // Cliente pode retornar lista
    result.value = Array.isArray(data) ? data[0] : data
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.search-page {
  position: relative;
  background-color: #0f0f1b;
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at top center, #00dc82 0%, #0f0f1b 60%, #000 100%);
  opacity: 0.3;
  filter: blur(120px);
  z-index: -1;
  pointer-events: none;
}
</style>