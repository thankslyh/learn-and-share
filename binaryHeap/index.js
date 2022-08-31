import {r} from "../rollup/rollup/test/function/assignment-patterns/other";

export const mode = {
    MAX: 'max',
    MIN: 'min'
}

const defaultCompare = (a, b) => a - b

const swap = (arr, a, b) => [arr[a], arr[b]] = [arr[b], arr[a]]
/**
 *
 */
export default class BinaryHeap {
    constructor(arr, compare = defaultCompare) {
        this.heap = arr
        this.compare = compare
        this.init()
    }
    get length() {
        return this.heap.length
    }
    parentIndex(index) {
        return Math.ceil((index - 1) / 2)
    }
    leftIndex(index) {
        return 2 * index + 1
    }
    rightIndex(index) {
        return 2 * index + 2
    }
    init() {
        // 取出最后一个节点的下标，获取它的父索引
        let parentIndex = this.parentIndex(this.length - 1)
        while (parentIndex > 0) {
            this.shiftDown(parentIndex)
            parentIndex--
        }
    }
    // 下沉操作
    shiftDown(index) {
        while (this.leftIndex(index) < this.length) {
            const leftIndex = this.leftIndex(index)
            const rightIndex = this.rightIndex(index)
            // 假设左边的值最小
            let minIndex = leftIndex
            if(rightIndex < this.length && this.compare(this.heap[leftIndex], this.heap[rightIndex]) > 0) {
                minIndex = rightIndex
            }
            if (this.compare(this.heap[index], this.heap[minIndex]) < 0) {
                swap(this.heap, index, minIndex)
                index = minIndex
            } else {
                break
            }
        }

    }
    // shiftUp 上浮操作
    shiftUp(index) {
        while (index > 0 && this.compare(this.heap[this.parentIndex(index)], this.heap[index]) > 0) {
            const parentIndex = this.parentIndex(index);
            swap(this.heap, parentIndex, index);
            index = parentIndex;
        }
    }
}
