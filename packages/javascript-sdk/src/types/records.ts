// import type { Enumerable } from '../utils'
import type { CollectModel } from '../sdk/model'
import type { CollectSchema, CollectSchemaDefaultValue } from './common'
import type { CollectPropertyType } from './properties'
import type { FlattenTypes } from './utils'
import type { CollectDatetimeObject } from './value'

export type CollectRecordInternalProps<T extends CollectSchema = CollectSchema> = {
  __id: string
  __label?: string
  __proptypes?: Record<keyof T, CollectPropertyType>
}

// Typings for write ops (create/update)
type TypeMappingWrite = {
  boolean: boolean
  datetime: CollectDatetimeObject | string
  null: null
  number: number
  string: string
}
type OptionalKeysWrite<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P
  : S[P]['default'] extends CollectSchemaDefaultValue ? P
  : never
}[keyof S]
type RequiredKeysWrite<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never
  : S[P]['default'] extends CollectSchemaDefaultValue ? never
  : P
}[keyof S]
export type InferSchemaTypesWrite<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeysWrite<S>]: TypeMappingWrite[S[P]['type']]
} & {
  [P in OptionalKeysWrite<S>]?: TypeMappingWrite[S[P]['type']]
}

// Typings for read ops (find/findById/findOne)
type TypeMappingRead = {
  boolean: boolean
  datetime: string
  null: null
  number: number
  string: string
}
type OptionalKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P : never
}[keyof S]
type RequiredKeysRead<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never : P
}[keyof S]
export type InferSchemaTypesRead<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeysRead<S>]: TypeMappingRead[S[P]['type']]
} & {
  [P in OptionalKeysRead<S>]?: TypeMappingRead[S[P]['type']]
}
export type CollectInferType<T extends CollectModel<any> = CollectModel<any>> = FlattenTypes<
  InferSchemaTypesRead<T['schema']>
>

export type CollectRecordProps<T extends CollectSchema = CollectSchema> = {
  // [K in keyof T]?: T extends CollectSchema
  //   ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     Enumerable<InferTypesFromSchema<T>[K]>
  //   : Enumerable<T[K]>

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [K in keyof T]?: T extends CollectSchema ? InferSchemaTypesRead<T>[K] : T[K]
}

export type CollectRecord<T extends CollectSchema = CollectSchema> = CollectRecordInternalProps<T> &
  CollectRecordProps<T>