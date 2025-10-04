import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis estão configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Função para validar URL do Supabase
const isValidSupabaseUrl = (url: string | undefined): boolean => {
  if (!url) return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase')
  } catch {
    return false
  }
}

// Verificar se as variáveis estão configuradas corretamente
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey &&
  isValidSupabaseUrl(supabaseUrl) &&
  supabaseAnonKey.length > 20 // Chave deve ter tamanho mínimo

// Criar cliente apenas se configurado corretamente
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Flag para verificar se o Supabase está configurado
export const isConfigured = !!isSupabaseConfigured

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: {
          id: string
          nome: string
          empresa: string | null
          telefone: string
          email: string | null
          endereco: string | null
          cidade: string | null
          tipo: 'pessoa_fisica' | 'pessoa_juridica'
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          empresa?: string | null
          telefone: string
          email?: string | null
          endereco?: string | null
          cidade?: string | null
          tipo: 'pessoa_fisica' | 'pessoa_juridica'
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          empresa?: string | null
          telefone?: string
          email?: string | null
          endereco?: string | null
          cidade?: string | null
          tipo?: 'pessoa_fisica' | 'pessoa_juridica'
          observacoes?: string | null
          updated_at?: string
        }
      }
      servicos: {
        Row: {
          id: string
          nome: string
          descricao: string
          valor_base: number
          unidade: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao: string
          valor_base: number
          unidade: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          valor_base?: number
          unidade?: string
          updated_at?: string
        }
      }
      viaticos: {
        Row: {
          id: string
          data: string
          destino: string
          distancia: number
          combustivel: number
          pedagio: number
          alimentacao: number
          hospedagem: number
          outros: number
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          data: string
          destino: string
          distancia: number
          combustivel: number
          pedagio: number
          alimentacao: number
          hospedagem: number
          outros: number
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          data?: string
          destino?: string
          distancia?: number
          combustivel?: number
          pedagio?: number
          alimentacao?: number
          hospedagem?: number
          outros?: number
          observacoes?: string | null
          updated_at?: string
        }
      }
      orcamentos: {
        Row: {
          id: string
          cliente_id: string
          data: string
          servicos: any
          viaticos: number
          impostos: number
          desconto: number
          status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          data: string
          servicos: any
          viaticos: number
          impostos: number
          desconto: number
          status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cliente_id?: string
          data?: string
          servicos?: any
          viaticos?: number
          impostos?: number
          desconto?: number
          status?: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
          observacoes?: string | null
          updated_at?: string
        }
      }
    }
  }
}