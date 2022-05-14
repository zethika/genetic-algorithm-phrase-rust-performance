import {ref} from "vue";

let uuid = 0;

export function useUniqueNumber() {
    const uniqueNumber = ref(uuid)
    uuid++;
    return { uniqueNumber }
}
