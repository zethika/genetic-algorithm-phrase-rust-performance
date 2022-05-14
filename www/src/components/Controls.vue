<script setup lang="ts">
import {useControlsStore} from "@/store/controls";
import RegularInput from "@/components/inputs/RegularInput.vue";
import ToggleInput from "@/components/inputs/ToggleInput.vue";
import StandardButton from "@/components/buttons/StandardButton.vue";

const store = useControlsStore()

</script>

<template>
    <h2 class="mb-4 text-2xl">Controls</h2>
    <RegularInput v-model="store.phrase" label="Phrase" class="mb-4" />
    <RegularInput v-model="store.population" label="Population" class="mb-4" type="number" />
    <RegularInput v-model="store.mutationRate" label="Mutation rate (%)" class="mb-4" type="number" />
    <ToggleInput v-model="store.running" :left-option="{text: 'Running'}" :right-option="{text: 'Stopped'}" />
    <StandardButton class="mt-4">Reset</StandardButton>
</template>
