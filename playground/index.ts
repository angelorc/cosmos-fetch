import { $fetch, FetchOptions } from "ofetch";
import { chain } from "../src";

async function calculateLatency(url: string, options: FetchOptions = {
    timeout: 500,
    retry: 3,
    retryDelay: 100
}) {
    const startTime = Date.now()

    try {
        const node = new URL('/cosmos/bank/v1beta1/params', url)
        const response = await $fetch.raw(node.toString(), options)
        if (response.status !== 200) {
            throw new Error('Invalid status code')
        }
        const endTime = Date.now()
        const latency = endTime - startTime
        return {
            url,
            latency,
            isDown: false
        }
    } catch (error) {
        return {
            url,
            latency: Infinity,
            isDown: true
        }
    }
}

function sortByLatency(endpoints: {
    url: string;
    latency: number;
    isDown: boolean;
}[]) {
    return endpoints.sort((a, b) => a.latency - b.latency)
}

const main = async () => {
    const startTime = Date.now()

    const response = await chain('bitsong')
    const lcds = response.apis?.rest?.map(api => api.address)

    const endpoints = sortByLatency(await Promise.all(lcds!.map(lcd => calculateLatency(lcd, { timeout: 1000 }))))
    console.log(endpoints)
    const nodeUpCount = endpoints.filter(node => !node.isDown).length
    const nodeDownCount = endpoints.filter(node => node.isDown).length

    const endTime = Date.now()
    console.log('Total time in seconds:', (endTime - startTime) / 1000)
    console.log('Total nodes:', endpoints.length)
    console.log(`Total nodes up: ${nodeUpCount} avg: ${(endpoints.filter(node => !node.isDown).reduce((acc, node) => acc + node.latency, 0) / nodeUpCount).toFixed(2)}ms`)
    console.log('Total nodes down:', nodeDownCount)
}

main().catch(console.error)
