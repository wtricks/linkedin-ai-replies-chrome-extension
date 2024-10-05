/**
 * Check if an element is in an array and add a key if not, It is helpful for avoiding duplicate key
 * @param oldArray 
 * @param newArray 
 * @returns 
 */
export const checkAndAddKey = <T extends HTMLElement>(oldArray: {value: T, key: number}[], newArray: T[]) => {
    return newArray.map((value) => {
        const oldElement = oldArray.find(element => element.value === value)
        return oldElement ? oldElement : { value, key: Math.random() }
    })
}