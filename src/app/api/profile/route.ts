import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      // If no profile exists, create one
      if (profileError.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: session.user.id,
              full_name: session.user.user_metadata?.full_name || '',
              email: session.user.email
            }
          ])
          .select()
          .single()

        if (insertError) {
          return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
          )
        }

        return NextResponse.json(newProfile)
      }

      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Update the profile
    const { data: profile, error: updateError } = await supabase
      .from('user_profiles')
      .update(body)
      .eq('id', session.user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 