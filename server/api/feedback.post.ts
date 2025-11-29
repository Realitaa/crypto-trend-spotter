// /server/api/feedback.post.ts
export default defineEventHandler(async (event) => {
    try {
      const config = useRuntimeConfig()
      const body = await readBody(event)
  
      const supabaseUrl = config.public.supabaseUrl
      const serviceKey = config.supabaseServiceKey
  
      // Safety check to avoid undefined ENV errors
      if (!supabaseUrl || !serviceKey) {
        throw createError({
          statusCode: 500,
          statusMessage: "Supabase configuration missing"
        })
      }
  
      // REST API call
      const response = await $fetch(`${supabaseUrl}/rest/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=minimal'
        },
        body: {
          rating: body.rating,
          category: body.category,
          message: body.message,
          email: body.email || null,
          created_at: new Date().toISOString()
        }
      })
  
      return { success: true }
    } catch (error: any) {
  
      throw createError({
        statusCode: 500,
        statusMessage: error?.message || "Internal Server Error"
      })
    }
  })
  