import Vue from 'vue'
/**
 * a是否小于b
 * @param a
 * @param b
 * @returns {boolean}
 */
export function less(a,b) {
    return a<b;
}

/**
 * 交换数组中的 i 与 j
 * @param items
 * @param i
 * @param j
 */
export function exch(items,i,j) {
    let temp = items[i];
    Vue.set(items, i, items[j]);
    Vue.set(items, j, temp);
}

/**
 * 获取从0到max的随机数
 * @param max
 * @returns {number}
 */
export function random(max) {
    if (max > 1000){
        max = 1000
    }
    return Math.floor(Math.random()*max);
}

/**
 * 生成数组
 * @param input
 * @param items
 * @returns {[]|*[]}
 */
export function createArr(input,items) {
    items.length = 0;
    let arr = input.split(',');
    if (arr.length === 1){
        let length = parseInt(input);
        for (let i = 0; i < length; i++) {
            items.push(random(length*10))
        }
    }else {
        arr.forEach(value => {
            if (value !== ''){
                items.push(parseInt(value))
            }
        })
    }
}
export function compareTo(a,b){
    const lengtha = a.length;
    const lengthb = b.length;
    if (lengtha > lengthb) {
        return 1;
    } else if (lengtha < lengthb){
        return  -1;
    } else {
        if (a === b){
            return 0;
        } else if (a > b){
            return 1;
        } else {
            return -1;
        }
    }
}
