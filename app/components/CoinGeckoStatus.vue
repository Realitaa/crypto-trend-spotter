<script setup>
const status = ref("loading"); // loading | online | offline

const checkStatus = async () => {
  status.value = "loading";
  try {
    const res = await $fetch("/api/coingecko-status");
    if (res?.ok) status.value = "online";
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
</template>
