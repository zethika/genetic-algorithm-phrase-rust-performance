import getRandomInteger from "@/helpers/getRandomInteger";

/**
 * Returns a random character from the defined character set
 */
export default function (){
    let c = Math.floor(getRandomInteger(63,122))
    if(c === 63) c = 32;
    if(c === 64) c = 46;
    return String.fromCharCode(c);

/*    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,:;-_æøåÆØÅ?!&%"\' ';
    return characters[Math.floor(Math.random()*characters.length)]*/
}
