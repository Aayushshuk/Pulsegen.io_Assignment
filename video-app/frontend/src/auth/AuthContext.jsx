import React, { createContext, useContext, useState } from 'react'
import api from '../api/http.js'
import { connectSocket } from '../sockets/io.js'

export const AuthCtx = createContext(null)
export const useAuth = ()=> useContext(AuthCtx)

export function AuthProvider({children}){
  const [user,setUser] = useState(() => JSON.parse(localStorage.getItem('user')||'null'))

  async function login(email,password){
    const { data } = await api.post('/auth/login',{ email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    connectSocket(data.user._id)
  }
  function logout(){
    localStorage.clear(); setUser(null)
  }
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}
