import { supabase } from './supabase'

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

// Funções para Clientes
export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  async create(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Serviços
export const servicoService = {
  async getAll(): Promise<Servico[]> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('nome')
    
    if (error) throw error
    return data || []
  },

  async create(servico: Omit<Servico, 'id' | 'created_at' | 'updated_at'>): Promise<Servico> {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, servico: Partial<Servico>): Promise<Servico> {
    const { data, error } = await supabase
      .from('servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('servicos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Viáticos
export const viaticoService = {
  async getAll(): Promise<Viatico[]> {
    const { data, error } = await supabase
      .from('viaticos')
      .select('*')
      .order('data', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(viatico: Omit<Viatico, 'id' | 'created_at' | 'updated_at'>): Promise<Viatico> {
    const { data, error } = await supabase
      .from('viaticos')
      .insert(viatico)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, viatico: Partial<Viatico>): Promise<Viatico> {
    const { data, error } = await supabase
      .from('viaticos')
      .update(viatico)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('viaticos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Funções para Orçamentos
export const orcamentoService = {
  async getAll(): Promise<Orcamento[]> {
    const { data, error } = await supabase
      .from('orcamentos')
      .select('*')
      .order('data', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(orcamento: Omit<Orcamento, 'id' | 'created_at' | 'updated_at'>): Promise<Orcamento> {
    const { data, error } = await supabase
      .from('orcamentos')
      .insert(orcamento)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, orcamento: Partial<Orcamento>): Promise<Orcamento> {
    const { data, error } = await supabase
      .from('orcamentos')
      .update(orcamento)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('orcamentos')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}