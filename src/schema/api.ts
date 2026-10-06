import * as v from 'valibot';
import { apiMethodSchema, batchDeleteSchema, descriptionSchema, idParamSchema, paginationQuerySchema } from './shared';

/** api DTO（unify api.service 范式） */

export const apiCreateSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  path: v.pipe(v.string(), v.nonEmpty()),
  method: apiMethodSchema,
  description: descriptionSchema
});
export type ApiCreateDTO = v.InferOutput<typeof apiCreateSchema>;

export const apiUpdateSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.nonEmpty())),
  path: v.optional(v.pipe(v.string(), v.nonEmpty())),
  method: v.optional(apiMethodSchema),
  description: v.optional(v.nullable(v.string()))
});
export type ApiUpdateDTO = v.InferOutput<typeof apiUpdateSchema>;

export const apiQuerySchema = v.intersect([
  paginationQuerySchema,
  v.object({
    name: v.optional(v.string()),
    path: v.optional(v.string()),
    method: v.optional(apiMethodSchema)
  })
]);
export type ApiQuery = v.InferOutput<typeof apiQuerySchema>;

export const apiBatchDeleteSchema = batchDeleteSchema;
export const apiIdParamSchema = idParamSchema;
