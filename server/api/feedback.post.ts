export default defineEventHandler(async (event) => {
    const body = await readBody(event)
  
    if (!body.rating || !body.message || !body.category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid payload'
      })
    }
  
    const supabase = serverSupabaseClient(event)
    const { error } = await supabase.from('feedback').insert({
      rating: body.rating,
      category: body.category,
      message: body.message,
      email: body.email,
      created_at: new Date()
    })
  
    if (error) {
      console.error(error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save to database'
      })
    }
  
    return {
      success: true,
      message: 'Feedback saved'
    }
  })
  