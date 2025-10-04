import { supabase, isConfigured } from './supabase'

// Tipos para as entidades
export interface Cliente {
  id: string
  nome: string
  empresa?: string
  telefone: string
  email?: string
  endereco?: string
  cidade?: string
  tipo: 'pessoa_fisica' | 'pessoa_juridica'
  observacoes?: string
  created_at?: string
  updated_at?: string
}

export interface Servico {
  id: string
  nome: string
  descricao: string
  valor_base: number
  unidade: string
  created_at?: string
  updated_at?: string
}

export interface Viatico {
  id: string
  data: string
  destino: string
  distancia: number
  combustivel: number
  pedagio: number
  alimentacao: number
  hospedagem: number
  outros: number
  observacoes?: string
  created_at?: string
  updated_at?: string
}

export interface Orcamento {
  id: string
  cliente_id: string
  data: string
  servicos: Array<{
    servico_id: string
    quantidade: number
    valor_unitario: number
  }>
  viaticos: number
  impostos: number
  desconto: number
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado'
  observacoes?: string
  created_at?: string
  updated_at?: string
}

// Função helper para verificar se o Supabase está configurado
const checkSupabaseConfig = () => {
  if (!isConfigured || !supabase) {
    console.warn('Supabase não está configurado. Funcionando em modo offline.')
    return null
  }
  return supabase
}

// Funções para Clientes
export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const client = checkSupabaseConfig()
    if (!client) return []
    
    try {
      const { data, error } = await client
        .from('clientes')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      return []
    }
  },

  async create(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('clientes')
      .insert(cliente)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { error } = await client
      .from('clientes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Serviços
export const servicoService = {
  async getAll(): Promise<Servico[]> {
    const client = checkSupabaseConfig()
    if (!client) return []
    
    try {
      const { data, error } = await client
        .from('servicos')
        .select('*')
        .order('nome')
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
      return []
    }
  },

  async create(servico: Omit<Servico, 'id' | 'created_at' | 'updated_at'>): Promise<Servico> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('servicos')
      .insert(servico)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, servico: Partial<Servico>): Promise<Servico> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { error } = await client
      .from('servicos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Viáticos
export const viaticoService = {
  async getAll(): Promise<Viatico[]> {
    const client = checkSupabaseConfig()
    if (!client) return []
    
    try {
      const { data, error } = await client
        .from('viaticos')
        .select('*')
        .order('data', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar viáticos:', error)
      return []
    }
  },

  async create(viatico: Omit<Viatico, 'id' | 'created_at' | 'updated_at'>): Promise<Viatico> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('viaticos')
      .insert(viatico)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, viatico: Partial<Viatico>): Promise<Viatico> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('viaticos')
      .update(viatico)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { error } = await client
      .from('viaticos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Orçamentos
export const orcamentoService = {
  async getAll(): Promise<Orcamento[]> {
    const client = checkSupabaseConfig()
    if (!client) return []
    
    try {
      const { data, error } = await client
        .from('orcamentos')
        .select('*')
        .order('data', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error)
      return []
    }
  },

  async create(orcamento: Omit<Orcamento, 'id' | 'created_at' | 'updated_at'>): Promise<Orcamento> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('orcamentos')
      .insert(orcamento)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, orcamento: Partial<Orcamento>): Promise<Orcamento> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { data, error } = await client
      .from('orcamentos')
      .update(orcamento)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const client = checkSupabaseConfig()
    if (!client) throw new Error('Banco de dados não configurado')
    
    const { error } = await client
      .from('orcamentos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}