import type { MaybePromise } from '../utils'
import type { CollectDatetimeObject, CollectPropertyType, CollectPropertyValue } from './index'

export type CollectObject = Record<string, boolean | null | number | string | undefined>

export type CollectSchemaDefaultValue = MaybePromise<CollectPropertyValue>

export type CollectSchema = Record<
  string,
  {
    default?: CollectSchemaDefaultValue
    required?: boolean
    type: CollectPropertyType
    uniq?: boolean
  }
>

export type CollectRelations = Record<
  string,
  {
    direction: 'in' | 'out'
    model: string
    type: string
  }
>

type TypeMapping = {
  boolean: boolean
  datetime: CollectDatetimeObject | string
  null: null
  number: number
  string: string
}

type OptionalKeys<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? P
  : S[P]['default'] extends CollectSchemaDefaultValue ? P
  : never
}[keyof S]

type RequiredKeys<S extends CollectSchema = CollectSchema> = {
  [P in keyof S]: S[P]['required'] extends false ? never
  : S[P]['default'] extends CollectSchemaDefaultValue ? never
  : P
}[keyof S]

export type InferTypesFromSchema<S extends CollectSchema = CollectSchema> = {
  [P in RequiredKeys<S>]: TypeMapping[S[P]['type']]
} & {
  [P in OptionalKeys<S>]?: TypeMapping[S[P]['type']]
}
