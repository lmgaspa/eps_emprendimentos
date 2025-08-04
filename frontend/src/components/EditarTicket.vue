<template>
  <div class="register-page d-flex align-items-center justify-content-center vh-100 text-white">
    <div class="card p-4 shadow-lg" style="width: 100%; max-width: 450px;">
      <div class="w-100 mb-3" style="max-width: 600px;">
        <RouterLink to="/dashboard" class="btn btn-primary w-100 fw-bold rounded-pill">
          ⬅️ Voltar ao menu anterior
        </RouterLink>
      </div>

      <h2 class="text-center fw-bold text-white mb-3">Editar Nota de Serviço</h2>

      <form @submit.prevent="handleUpdateTicket">
        <div class="mb-2" v-for="(label, key) in fields" :key="key">
          <label :for="key" class="form-label text-white">{{ label }}</label>
          <input
            v-model="formData[key]"
            :type="key === 'emailEmpresa' ? 'email' : 'text'"
            class="form-control"
            :id="key"
            :placeholder="label"
            @input="
              key === 'cpf' ? onCpfInput() :
              key === 'cnpj' ? onCnpjInput() :
              key === 'telefone' ? onTelefoneInput() :
              key === 'whatsapp' ? onWhatsappInput() : null
            "
          />
        </div>

        <div class="mb-3">
          <label for="descricaoServico" class="form-label text-white">Descrição do Serviço</label>
          <textarea
            v-model="formData.descricaoServico"
            id="descricaoServico"
            class="form-control"
            placeholder="Descreva o problema"
            rows="3"
          ></textarea>
        </div>

        <button type="submit" class="btn btn-warning w-100 fw-semibold rounded-pill">
          Atualizar Ticket
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const notaServico = route.params.notaServico as string
const token = localStorage.getItem('token')

const formData = ref<any>({
  cliente: '',
  empresa: '',
  cpf: '',
  cnpj: '',
  telefone: '',
  whatsapp: '',
  emailEmpresa: '',
  descricaoServico: '',
})

const fields: Record<string, string> = {
  cliente: 'Cliente',
  empresa: 'Empresa',
  cpf: 'CPF',
  cnpj: 'CNPJ',
  telefone: 'Telefone',
  whatsapp: 'WhatsApp',
  emailEmpresa: 'Email',
}

const onCpfInput = () => {
  formData.value.cpf = formData.value.cpf
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
    .slice(0, 14)
}

const onCnpjInput = () => {
  formData.value.cnpj = formData.value.cnpj
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5')
    .slice(0, 18)
}

const onTelefoneInput = () => {
  formData.value.telefone = formData.value.telefone
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3')
    .slice(0, 13)
}

const onWhatsappInput = () => {
  formData.value.whatsapp = formData.value.whatsapp
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3')
    .slice(0, 14)
}

const fetchTicket = async () => {
  try {
    const response = await fetch(`https://eps-6c85169e1d63.herokuapp.com/api/tickets/nota/${encodeURIComponent(notaServico)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    Object.assign(formData.value, data)
  } catch (err) {
    alert('Erro ao buscar ticket.')
    router.push('/dashboard')
  }
}

const handleUpdateTicket = async () => {
  if (!token) {
    alert('Você precisa estar logado para atualizar.')
    router.push('/login')
    return
  }

  const updatedFields: any = {}
  for (const key in formData.value) {
    if (formData.value[key]) updatedFields[key] = formData.value[key]
  }

  if (Object.keys(updatedFields).length === 0) {
    alert('Preencha pelo menos um campo.')
    return
  }

  try {
    const response = await fetch(`https://eps-6c85169e1d63.herokuapp.com/api/tickets/nota/${notaServico}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedFields)
    })

    if (!response.ok) {
      const err = await response.json()
      alert(err.message || 'Erro ao atualizar ticket.')
      return
    }

    alert('Ticket atualizado com sucesso!')
    router.push('/dashboard')
  } catch (err) {
    alert('Erro ao tentar atualizar.')
  }
}

onMounted(() => {
  if (!notaServico) return router.push('/dashboard')
  fetchTicket()
})
</script>

<style scoped>
.register-page {
  background: radial-gradient(circle at top, #00dc82 5%, #0f0f1b 50%, #000 100%);
  padding: 1rem;
}
.card {
  background-color: #1a1a2e;
  border: none;
  border-radius: 1rem;
}
</style>
