<template>
  <div class="full-height d-flex flex-column align-items-center p-4">
    <div class="gradient-overlay"></div>

    <div class="w-100 mb-3" style="max-width: 600px;">
      <RouterLink to="/dashboard" class="btn btn-success w-100 fw-bold rounded-pill">
        ⬅️ Voltar ao menu anterior
      </RouterLink>
    </div>

    <form v-if="ticket" @submit.prevent="handleSubmit" class="card p-4 w-100 shadow-sm" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-white">Editar Ticket</h2>

      <p class="text-secondary mb-2"><strong>Nota de Serviço:</strong> {{ ticket.notaServico }}</p>

      <input v-model="ticket.cliente" class="form-control mb-2" placeholder="Cliente" required />
      <input v-model="ticket.empresa" class="form-control mb-2" placeholder="Empresa" required />
      <input v-model="ticket.cpf" class="form-control mb-2" placeholder="CPF" />
      <input v-model="ticket.cnpj" class="form-control mb-2" placeholder="CNPJ" />
      <input v-model="ticket.whatsapp" class="form-control mb-2" placeholder="WhatsApp" />
      <input v-model="ticket.telefone" class="form-control mb-2" placeholder="Telefone" />
      <input v-model="ticket.emailEmpresa" class="form-control mb-2" placeholder="E-mail" />
      <textarea v-model="ticket.descricaoServico" class="form-control mb-3" rows="3" placeholder="Descrição do serviço" required></textarea>

      <button class="btn btn-success w-100">Salvar Alterações</button>
    </form>

    <p v-else class="text-white">Carregando ticket...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const notaServico = route.params.notaServico as string

const ticket = ref<any>(null)

onMounted(async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`https://eps-emprendimentos.onrender.com/api/tickets/nota/${notaServico}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  ticket.value = await response.json()
})

const handleSubmit = async () => {
  const token = localStorage.getItem('token')
  const payload = Object.fromEntries(
    Object.entries(ticket.value).filter(([_, val]) => val !== '' && val !== null)
  )

  const response = await fetch(`https://eps-emprendimentos.onrender.com/api/tickets/nota/${notaServico}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (response.ok) {
    alert('Ticket atualizado com sucesso!')
    router.push('/dashboard')
  } else {
    const error = await response.text()
    alert('Erro ao atualizar: ' + error)
  }
}
</script>

<style scoped>
.full-height {
  position: relative;
  min-height: 100vh;
  background-color: #0f0f1b;
  overflow: hidden;
  width: 100%;
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

.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
  color: white;
}
</style>