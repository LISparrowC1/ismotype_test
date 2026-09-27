export const CORE_VERSION = '0.1.0'

// 逐模块显式导出：`export * from './*'` 这种写法在 TS 里不存在，**新模块不会自动出现**。
// 加模块时务必在这里补一行：漏一行不会报错，只会让 `from '../core'` 悄悄少一个导出。
export * from './taxonomy'
export * from './content'
export * from './calibration'
export * from './responses'
export * from './norms'
export * from './scoring'
export * from './matching'
export * from './result'
