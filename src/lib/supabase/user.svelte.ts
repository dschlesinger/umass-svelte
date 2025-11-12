import { supabase } from "./supabase"

export let user: { current: any } = $state({ current: null })

supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
        user.current = session.user
        console.log("Logged in:", $state.snapshot(user.current))
    } else {
        user.current = null
        console.log("Logged out")
    }
})

export async function login() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    })

    if (error) console.error("Login error:", error)
}
