'use client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() =>{
    const token = localStorage.getItem('@taskmanager:token')
    if (token) {
      router.replace('/dashboard')
    }else{
      router.replace('/login')
    }
  },[router])
  
  return null
}