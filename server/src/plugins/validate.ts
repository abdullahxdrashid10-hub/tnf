// server/src/plugins/validate.ts
// ─────────────────────────────────────────────────────────────────────────────
// Sets fastify-type-provider-zod as the global serializer/validator.
// Import ZodTypeProvider in routes to get fully typed request bodies.
// ─────────────────────────────────────────────────────────────────────────────
import fp from 'fastify-plugin';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

export default fp(async (fastify) => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
});
