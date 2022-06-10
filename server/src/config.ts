import env_var from 'env-var'

export const PORT = env_var.get('PORT').default(4000).asInt()
export const MONGO_URI = env_var.get('MONGO_URI').required().asUrlString()
export const CORS_ALLOWED_ORIGIN = env_var.get('CORS_ALLOWED_ORIGIN').required().asJsonArray()