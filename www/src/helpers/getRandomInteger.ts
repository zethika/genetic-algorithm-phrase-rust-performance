import getRandomNumber from "@/helpers/getRandomNumber";

export default function(min:number, max:number) {
    return Math.floor(getRandomNumber(min,max));
}