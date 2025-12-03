<script setup>
const status = ref("loading"); // loading | online | offline
const usedWeight = ref("0/6000");

const checkStatus = async () => {
  status.value = "loading";
  try {
    const res = await $fetch("/api/status/binance");
    if (res?.ok) {
      status.value = "online";
      usedWeight.value = res.data.rateLimit.usedWeight1m;
    } 
    else status.value = "offline";
  } catch {
    status.value = "offline";
  }
};

onMounted(() => {
  checkStatus();
});
</script>

<template>
  <UPopover
    mode="hover" 
    :open-delay="500" 
    :close-delay="300" 
    :content="{
      align: 'center',
      side: 'bottom',
      sideOffset: 8
    }"
  >
    <UButton
      icon="mdi:circle-medium"
      variant="link"
      :color="status === 'online' ? 'primary' : status === 'loading' ? 'neutral' : 'error'"
      active="true"
    >
      <span v-if="status === 'loading'">Checking...</span>
      <span v-else-if="status === 'online'">Online</span>
      <span v-else>Offline</span>
    </UButton>

    <template #content>
      <p class="p-2 text-sm text-muted">
        Weight Digunakan: <span v-text="usedWeight"></span>/6000
      </p>
    </template>
  </UPopover>
</template>
