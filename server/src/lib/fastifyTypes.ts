import type { FastifyRequest, RouteGenericInterface } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export type ZodRequest<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
> = FastifyRequest<RouteGeneric, any, any, any, ZodTypeProvider>;
