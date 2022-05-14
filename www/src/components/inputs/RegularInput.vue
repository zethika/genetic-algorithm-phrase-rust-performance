<script setup lang="ts">

import {computed, ref, useSlots} from "vue";
import {useUniqueNumber} from "@/composable/uniqueNumber";

const props = defineProps<{
    type?: 'text' | 'number' | 'email' | 'hidden' | 'password' | 'search' | 'url',
    label?: string,
    modelValue: string|number,
    error?: string,
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v:string|number): void
}>()

const {uniqueNumber} = useUniqueNumber();
const id = computed(() => 'w-input-'+uniqueNumber.value)

const focus = ref(false);

const hasError = computed(() => typeof props.error !== 'undefined' && props.error !== '')
const hasValue = computed(() => props.modelValue !== '')
const typeComp = computed(() => typeof props.type !== 'undefined' ? props.type : 'text')


const slots = useSlots();
const hasRightContent = computed(() => typeof slots.input_right !== 'undefined')

const inputClasses = computed(() => {
    let classes = []
    classes.push((hasRightContent.value) ? 'w-[calc(100%-40px)]' :  'w-full')

    let borderColor = 'border-b-grey-ligherest';
    if(hasError.value)
    {
        borderColor = 'border-b-red';
    }
    else if(focus.value === true)
    {
        borderColor = 'border-b-blue';
    }

    classes.push(borderColor);

    return classes;
})

const inputRef = ref<HTMLInputElement|null>(null)
function updateValue(e: InputEvent)
{
    if(inputRef.value === null)
        return;

    emit('update:modelValue',inputRef.value.value)
}
</script>

<template>
    <div :class="{'pointer-events-none opacity-70': props.disabled === true,'text-red': hasError}">
        <div class="relative">
            <label v-if="typeof props.label !== 'undefined'" :for="id" :class="[{'text-red': hasError},focus || hasValue ? 'top-0 left-0 text-xs' : 'top-4 left-0', focus ? 'text-blue' : 'text-grey-lighter']" class="absolute transition-all">{{props.label}}</label>
            <input :class="inputClasses" class="h-10 border-b pt-7 pb-4 focus:outline-none transition-colors bg-transparent" :id="id" :type="typeComp" ref="inputRef" :value="props.modelValue" :disabled="props.disabled" @input="updateValue" @focusin="focus = true" @focusout="focus = false" />
            <div v-if="hasRightContent" class="absolute top-0 right-0 w-[30px] h-[40px]">
                <slot name="input_right"/>
            </div>
        </div>
        <div class="overflow-hidden transition-all text-xs" :class="[hasError ? 'max-h-[100px]' : 'max-h-0']">{{error}}</div>
    </div>
</template>
