<script setup lang="ts">
import {useUniqueNumber} from "@/composable/uniqueNumber";
import {computed, onMounted, ref, watch} from "vue";

export interface ToggleOptionType{
    text?: string,
    value?: string|boolean|number,
    negative?: boolean
}

const props = defineProps<{
    label?: string,
    leftOption?: ToggleOptionType,
    rightOption?: ToggleOptionType,
    modelValue: string|boolean|number,
    disabled?:boolean,
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', v:string|boolean|number): void
}>()

const leftTextRef = ref<HTMLSpanElement|null>(null);
const rightTextRef = ref<HTMLSpanElement|null>(null);

const {uniqueNumber} = useUniqueNumber();
const id = computed(() => 'w-toggle-'+uniqueNumber.value)

const leftText = computed(() => typeof props.leftOption === 'object' && typeof props.leftOption.text !== 'undefined' ? props.leftOption.text : 'On')
const leftValue = computed(() => typeof props.leftOption === 'object' && typeof props.leftOption.value !== 'undefined' ? props.leftOption.value : true)
const leftNegative = computed(() => (typeof props.leftOption === 'object' && typeof props.leftOption.negative !== 'undefined') ? props.leftOption.negative : false)

const rightText = computed(() => typeof props.rightOption === 'object' && typeof props.rightOption.text !== 'undefined' ? props.rightOption.text : 'Off')
const rightValue = computed(() => typeof props.rightOption === 'object' && typeof props.rightOption.value !== 'undefined' ? props.rightOption.value : false)
const rightNegative = computed(() => (typeof props.rightOption === 'object' && typeof props.rightOption.negative !== 'undefined') ? props.rightOption.negative : true)

const leftActive = computed(() => props.modelValue === leftValue.value)
const activeText = computed(() => leftActive.value ? leftText.value : rightText.value)
const activeNegative = computed(() => leftActive.value ? leftNegative.value : rightNegative.value)

const activeStyle = ref('')

onMounted(() => {
    // @todo there seems to be something it is not waiting correctly on to redraw, but only when changing to a page containing a toggle?
    // can't figure it out at the moment
    setTimeout(() => {
        recalc()
    },50)
})

function recalc(){
    if(leftTextRef.value === null || rightTextRef.value === null)
        return '';

    const leftBounds = leftTextRef.value.getBoundingClientRect()
    const rightBounds = rightTextRef.value.getBoundingClientRect()

    const left = !leftActive.value ? rightBounds.left - leftBounds.left : 0;
    const width = leftActive.value ? leftBounds.width : rightBounds.width;

    activeStyle.value = 'left:'+left+'px;width:'+width+'px';
}

watch(() => props.modelValue, () => recalc())

</script>

<template>
    <label :for="id" class="toggle-input cursor-pointer select-none" >
        <span class="text-grey-lightest block">{{label}}</span>
        <span class="bg-grey-lighterest relative overflow-hidden h-8 rounded-2xl inline-flex leading-8 bg-blue-800">
            <span class="px-4 transition-all" :class="[leftActive === false ? 'opacity-1' : 'opacity-0']" ref="leftTextRef">{{leftText}}</span>
            <span class="px-4 transition-all" :class="[leftActive ? 'opacity-1' : 'opacity-0']" ref="rightTextRef">{{rightText}}</span>
            <span class="absolute top-0 h-8 px-4 rounded-2xl overflow-hidden whitespace-nowrap text-white transition-all" :class="[activeNegative ? 'bg-red-500' : 'bg-blue-400']" :style="activeStyle">{{activeText}}</span>
        </span>
        <input :id="id" class="hidden" type="checkbox" :checked="leftActive === false" @change="emit('update:modelValue',leftActive ? rightValue : leftValue)">
    </label>
</template>
