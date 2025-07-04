<template>
  <div class="d-flex flex-column align-items-center full-height">
    <div class="gradient-overlay"></div>
    <div v-if="startStep === 0" class="my-5">
      <button class="btn btn-warning btn-lg" @click="startStep = 1">Iniciar Cadastro</button>
    </div>

    <div v-if="startStep === 1" class="card p-4 mt-4 w-100" style="max-width: 600px;">
      <h4 class="mb-3">Você quer usar CPF ou CNPJ?</h4>
      <div class="d-flex justify-content-around">
        <button class="btn btn-warning" @click="selectCpfCnpj('cpf')">CPF</button>
        <button class="btn btn-warning" @click="selectCpfCnpj('cnpj')">CNPJ</button>
      </div>
    </div>

    <div v-if="startStep === 2" class="card p-4 w-100 mt-3" style="max-width: 600px;">
      <h4 class="mb-3">Você quer usar telefone ou WhatsApp?</h4>
      <div class="d-flex justify-content-around">
        <button class="btn btn-warning" @click="selectContact('telefone')">Telefone</button>
        <button class="btn btn-warning" @click="selectContact('whatsapp')">WhatsApp</button>
      </div>
    </div>

    <form v-if="startStep === 3" @submit.prevent="handleSubmit" class="p-4 border rounded bg-white shadow-sm w-100 mt-3" style="max-width: 600px;">
      <h2 class="mb-4 text-center text-primary">Cadastro de Chamado</h2>

      <div v-if="selectedCpfCnpj === 'cpf'" class="form-group mb-3">
        <label for="cpf" class="form-label">CPF</label>
        <input type="text" class="form-control" id="cpf" v-model="ticket.cpf" @input="onCpfInput" maxlength="14" required />
        <small v-if="ticket.cpf && !isCpfValid" class="text-danger">CPF inválido. Deve estar no formato 000.000.000-00</small>
      </div>

      <div v-if="selectedCpfCnpj === 'cnpj'" class="form-group mb-3">
        <label for="cnpj" class="form-label">CNPJ</label>
        <input type="text" class="form-control" id="cnpj" v-model="ticket.cnpj" @input="onCnpjInput" maxlength="18" required />
        <small v-if="ticket.cnpj && !isCnpjValid" class="text-danger">CNPJ inválido. Deve estar no formato 00.000.000/0000-00</small>
      </div>

      <div v-if="selectedContact === 'telefone'" class="form-group mb-3">
        <label for="telefone" class="form-label">Telefone da Empresa</label>
        <input type="tel" class="form-control" id="telefone" v-model="ticket.telefone" @input="onTelefoneInput" maxlength="15" placeholder="(00)00000-0000" required />
        <small v-if="ticket.telefone && ticket.telefone.length < 14" class="text-danger">Telefone inválido. Deve estar no formato (00)00000-0000</small>
      </div>

      <div v-if="selectedContact === 'whatsapp'" class="form-group mb-3">
        <label for="whatsapp" class="form-label">WhatsApp</label>
        <input type="tel" class="form-control" id="whatsapp" v-model="ticket.whatsapp" @input="onWhatsappInput" maxlength="15" placeholder="(00)00000-0000" required />
        <small v-if="ticket.whatsapp && ticket.whatsapp.length < 14" class="text-danger">WhatsApp inválido. Deve estar no formato (00)00000-0000</small>
      </div>

      <div class="form-group mb-3">
        <label for="cliente" class="form-label">Cliente</label>
        <input type="text" class="form-control" id="cliente" v-model="ticket.cliente" @input="validateForm" required />
      </div>

      <div class="form-group mb-3">
        <label for="empresa" class="form-label">Empresa</label>
        <input type="text" class="form-control" id="empresa" v-model="ticket.empresa" @input="validateForm" required />
      </div>

      <div class="form-group mb-3">
        <label for="emailEmpresa" class="form-label">Email da Empresa (opcional)</label>
        <input type="email" class="form-control" id="emailEmpresa" v-model="ticket.emailEmpresa" @input="validateForm" />
        <small v-if="ticket.emailEmpresa && !isEmailValid" class="text-danger">Email inválido</small>
      </div>

      <div class="form-group mb-4">
        <label for="descricaoServico" class="form-label">Descrição do Serviço</label>
        <textarea class="form-control" id="descricaoServico" v-model="ticket.descricaoServico" @input="validateForm" rows="3" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary btn-lg w-100 custom-btn hover-green" :disabled="!formValidation()">
        Enviar Chamado
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'RegistrarTicketForm',
  setup() {
    const startStep = ref(0);
    const selectedCpfCnpj = ref('');
    const selectedContact = ref('');

    const ticket = ref({
      cpf: '',
      cnpj: '',
      telefone: '',
      whatsapp: '',
      cliente: '',
      empresa: '',
      emailEmpresa: '',
      descricaoServico: '',
    });

    const isCpfValid = ref(true);
    const isCnpjValid = ref(true);
    const isEmailValid = ref(true);

    const selectCpfCnpj = (tipo: string) => {
      selectedCpfCnpj.value = tipo;
      startStep.value = 2;
    };

    const selectContact = (tipo: string) => {
      selectedContact.value = tipo;
      startStep.value = 3;
    };

    const onCpfInput = () => {
      ticket.value.cpf = ticket.value.cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      isCpfValid.value = cpfRegex.test(ticket.value.cpf);
    };

    const onCnpjInput = () => {
      ticket.value.cnpj = ticket.value.cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0, 18);
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      isCnpjValid.value = cnpjRegex.test(ticket.value.cnpj);
    };

    const onTelefoneInput = () => {
      ticket.value.telefone = ticket.value.telefone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3').slice(0, 14);
    };

    const onWhatsappInput = () => {
      ticket.value.whatsapp = ticket.value.whatsapp.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3').slice(0, 14);
    };

    const validateForm = () => {
      isEmailValid.value = ticket.value.emailEmpresa === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticket.value.emailEmpresa);
    };

    const formValidation = () => {
      const cpfValid = selectedCpfCnpj.value !== 'cpf' || isCpfValid.value;
      const cnpjValid = selectedCpfCnpj.value !== 'cnpj' || isCnpjValid.value;
      const phoneValid = selectedContact.value !== 'telefone' || (ticket.value.telefone && ticket.value.telefone.length >= 14);
      const whatsappValid = selectedContact.value !== 'whatsapp' || (ticket.value.whatsapp && ticket.value.whatsapp.length >= 14);
      const requiredFields = ticket.value.cliente && ticket.value.empresa && ticket.value.descricaoServico;
      const emailOk = !ticket.value.emailEmpresa || isEmailValid.value;
      return cpfValid && cnpjValid && phoneValid && whatsappValid && requiredFields && emailOk;
    };

    const handleSubmit = async () => {
      if (!formValidation()) return;

      try {
        const response = await fetch('https://eps-emprendimentos.onrender.com/tickets/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticket.value),
        });

        if (response.ok) {
          alert('Chamado enviado com sucesso!');
          startStep.value = 0;
        } else {
          alert('Erro ao enviar chamado.');
        }
      } catch (error) {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar chamado.');
      }
    };

    return {
      startStep,
      selectedCpfCnpj,
      selectedContact,
      ticket,
      handleSubmit,
      onCpfInput,
      onCnpjInput,
      onTelefoneInput,
      onWhatsappInput,
      validateForm,
      isCpfValid,
      isCnpjValid,
      isEmailValid,
      selectCpfCnpj,
      selectContact,
      formValidation
    };
  }
});
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

</style>
