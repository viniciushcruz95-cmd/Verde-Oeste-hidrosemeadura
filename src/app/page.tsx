'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Calculator, Car, Receipt, FileText, DollarSign, 
  Plus, Edit, Trash2, Save, X, Search, Filter, 
  BarChart3, TrendingUp, MapPin, Calendar, Phone, Mail,
  Building, User, CreditCard, Percent, Fuel, Clock,
  Download, Upload, Eye
} from 'lucide-react';
import { clienteService, servicoService, viaticoService, orcamentoService } from '@/lib/database';
import type { Cliente, Servico, Viatico, Orcamento } from '@/lib/database';

export default function GestaoEmpresarial() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [viaticos, setViaticos] = useState<Viatico[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para formulários
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showServicoForm, setShowServicoForm] = useState(false);
  const [showViaticoForm, setShowViaticoForm] = useState(false);
  const [showOrcamentoForm, setShowOrcamentoForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Formulário de Cliente
  const [clienteForm, setClienteForm] = useState<Partial<Cliente>>({
    nome: '', empresa: '', telefone: '', email: '', endereco: '', cidade: '', tipo: 'pessoa_fisica', observacoes: ''
  });

  // Formulário de Serviço
  const [servicoForm, setServicoForm] = useState<Partial<Servico>>({
    nome: '', descricao: '', valor_base: 0, unidade: 'm²'
  });

  // Formulário de Viático
  const [viaticoForm, setViaticoForm] = useState<Partial<Viatico>>({
    data: '', destino: '', distancia: 0, combustivel: 0, pedagio: 0, alimentacao: 0, hospedagem: 0, outros: 0, observacoes: ''
  });

  // Calculadora de Custos
  const [calculadoraCusto, setCalculadoraCusto] = useState({
    area: 0,
    servicoId: '',
    distanciaKm: 0,
    valorCombustivel: 5.50,
    consumoVeiculo: 12,
    pedagio: 0,
    alimentacao: 0,
    hospedagem: 0,
    margem: 30,
    impostos: 15
  });

  // Carregar dados do banco
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientesData, servicosData, viaticosData, orcamentosData] = await Promise.all([
        clienteService.getAll(),
        servicoService.getAll(),
        viaticoService.getAll(),
        orcamentoService.getAll()
      ]);
      
      setClientes(clientesData);
      setServicos(servicosData);
      setViaticos(viaticosData);
      setOrcamentos(orcamentosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados locais se houver erro de conexão
      setServicos([
        { id: '1', nome: 'Hidrosemeadura', descricao: 'Aplicação de hidrosemeadura', valor_base: 15.00, unidade: 'm²' },
        { id: '2', nome: 'Revegetação de Talude', descricao: 'Revegetação completa de taludes', valor_base: 25.00, unidade: 'm²' },
        { id: '3', nome: 'Controle de Erosão', descricao: 'Serviços de controle de erosão', valor_base: 20.00, unidade: 'm²' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Funções CRUD para Clientes
  const salvarCliente = async () => {
    try {
      if (editingItem) {
        const clienteAtualizado = await clienteService.update(editingItem.id, clienteForm);
        setClientes(clientes.map(c => c.id === editingItem.id ? clienteAtualizado : c));
      } else {
        const novoCliente = await clienteService.create(clienteForm as Omit<Cliente, 'id' | 'created_at' | 'updated_at'>);
        setClientes([...clientes, novoCliente]);
      }
      resetClienteForm();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente. Verifique sua conexão.');
    }
  };

  const resetClienteForm = () => {
    setClienteForm({ nome: '', empresa: '', telefone: '', email: '', endereco: '', cidade: '', tipo: 'pessoa_fisica', observacoes: '' });
    setShowClienteForm(false);
    setEditingItem(null);
  };

  const editarCliente = (cliente: Cliente) => {
    setClienteForm(cliente);
    setEditingItem(cliente);
    setShowClienteForm(true);
  };

  const excluirCliente = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clienteService.delete(id);
        setClientes(clientes.filter(c => c.id !== id));
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        alert('Erro ao excluir cliente. Verifique sua conexão.');
      }
    }
  };

  // Funções CRUD para Serviços
  const salvarServico = async () => {
    try {
      if (editingItem) {
        const servicoAtualizado = await servicoService.update(editingItem.id, servicoForm);
        setServicos(servicos.map(s => s.id === editingItem.id ? servicoAtualizado : s));
      } else {
        const novoServico = await servicoService.create(servicoForm as Omit<Servico, 'id' | 'created_at' | 'updated_at'>);
        setServicos([...servicos, novoServico]);
      }
      resetServicoForm();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Erro ao salvar serviço. Verifique sua conexão.');
    }
  };

  const resetServicoForm = () => {
    setServicoForm({ nome: '', descricao: '', valor_base: 0, unidade: 'm²' });
    setShowServicoForm(false);
    setEditingItem(null);
  };

  // Funções CRUD para Viáticos
  const salvarViatico = async () => {
    try {
      if (editingItem) {
        const viaticoAtualizado = await viaticoService.update(editingItem.id, viaticoForm);
        setViaticos(viaticos.map(v => v.id === editingItem.id ? viaticoAtualizado : v));
      } else {
        const novoViatico = await viaticoService.create(viaticoForm as Omit<Viatico, 'id' | 'created_at' | 'updated_at'>);
        setViaticos([...viaticos, novoViatico]);
      }
      resetViaticoForm();
    } catch (error) {
      console.error('Erro ao salvar viático:', error);
      alert('Erro ao salvar viático. Verifique sua conexão.');
    }
  };

  const resetViaticoForm = () => {
    setViaticoForm({ data: '', destino: '', distancia: 0, combustivel: 0, pedagio: 0, alimentacao: 0, hospedagem: 0, outros: 0, observacoes: '' });
    setShowViaticoForm(false);
    setEditingItem(null);
  };

  // Cálculos
  const calcularCustoTotal = () => {
    const servico = servicos.find(s => s.id === calculadoraCusto.servicoId);
    if (!servico) return { custoServico: 0, custoViatico: 0, impostos: 0, total: 0 };

    const custoServico = calculadoraCusto.area * servico.valor_base;
    const combustivelGasto = (calculadoraCusto.distanciaKm * 2) / calculadoraCusto.consumoVeiculo * calculadoraCusto.valorCombustivel;
    const custoViatico = combustivelGasto + calculadoraCusto.pedagio + calculadoraCusto.alimentacao + calculadoraCusto.hospedagem;
    
    const subtotal = custoServico + custoViatico;
    const margem = subtotal * (calculadoraCusto.margem / 100);
    const impostos = (subtotal + margem) * (calculadoraCusto.impostos / 100);
    const total = subtotal + margem + impostos;

    return { custoServico, custoViatico, impostos, margem, total };
  };

  const custos = calcularCustoTotal();

  // Função para exportar dados
  const exportarDados = () => {
    const dados = {
      clientes,
      servicos,
      viaticos,
      orcamentos,
      exportadoEm: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gestao-empresarial-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={exportarDados}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Dados</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{clientes.length}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviços Cadastrados</p>
              <p className="text-3xl font-bold text-gray-900">{servicos.length}</p>
            </div>
            <FileText className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Viáticos Registrados</p>
              <p className="text-3xl font-bold text-gray-900">{viaticos.length}</p>
            </div>
            <Car className="w-12 h-12 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orçamentos</p>
              <p className="text-3xl font-bold text-gray-900">{orcamentos.length}</p>
            </div>
            <Receipt className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Calculadora de Custos Rápida */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Calculator className="w-6 h-6 mr-2 text-blue-500" />
          Calculadora de Custos Rápida
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
            <input
              type="number"
              value={calculadoraCusto.area}
              onChange={(e) => setCalculadoraCusto({...calculadoraCusto, area: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
            <select
              value={calculadoraCusto.servicoId}
              onChange={(e) => setCalculadoraCusto({...calculadoraCusto, servicoId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um serviço</option>
              {servicos.map(servico => (
                <option key={servico.id} value={servico.id}>{servico.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distância (km)</label>
            <input
              type="number"
              value={calculadoraCusto.distanciaKm}
              onChange={(e) => setCalculadoraCusto({...calculadoraCusto, distanciaKm: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Margem (%)</label>
            <input
              type="number"
              value={calculadoraCusto.margem}
              onChange={(e) => setCalculadoraCusto({...calculadoraCusto, margem: Number(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Custo Serviço</p>
              <p className="text-lg font-bold text-green-600">R$ {custos.custoServico.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Viáticos</p>
              <p className="text-lg font-bold text-yellow-600">R$ {custos.custoViatico.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Margem</p>
              <p className="text-lg font-bold text-blue-600">R$ {custos.margem.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Impostos</p>
              <p className="text-lg font-bold text-red-600">R$ {custos.impostos.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {custos.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Financeiro dos Viáticos */}
      {viaticos.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Resumo Financeiro - Viáticos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Combustível</p>
              <p className="text-xl font-bold text-blue-600">
                R$ {viaticos.reduce((acc, v) => acc + v.combustivel, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Pedágios</p>
              <p className="text-xl font-bold text-yellow-600">
                R$ {viaticos.reduce((acc, v) => acc + v.pedagio, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Alimentação</p>
              <p className="text-xl font-bold text-green-600">
                R$ {viaticos.reduce((acc, v) => acc + v.alimentacao, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Geral</p>
              <p className="text-xl font-bold text-purple-600">
                R$ {viaticos.reduce((acc, v) => acc + v.combustivel + v.pedagio + v.alimentacao + v.hospedagem + v.outros, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderClientes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h2>
        <button
          onClick={() => setShowClienteForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {showClienteForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingItem ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={clienteForm.nome}
                onChange={(e) => setClienteForm({...clienteForm, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input
                type="text"
                value={clienteForm.empresa}
                onChange={(e) => setClienteForm({...clienteForm, empresa: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input
                type="tel"
                value={clienteForm.telefone}
                onChange={(e) => setClienteForm({...clienteForm, telefone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={clienteForm.email}
                onChange={(e) => setClienteForm({...clienteForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                value={clienteForm.endereco}
                onChange={(e) => setClienteForm({...clienteForm, endereco: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                type="text"
                value={clienteForm.cidade}
                onChange={(e) => setClienteForm({...clienteForm, cidade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={clienteForm.tipo}
                onChange={(e) => setClienteForm({...clienteForm, tipo: e.target.value as 'pessoa_fisica' | 'pessoa_juridica'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={clienteForm.observacoes}
              onChange={(e) => setClienteForm({...clienteForm, observacoes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={salvarCliente}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={resetClienteForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      {cliente.empresa && <div className="text-sm text-gray-500">{cliente.empresa}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.telefone}</div>
                    <div className="text-sm text-gray-500">{cliente.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.cidade}</div>
                    <div className="text-sm text-gray-500">{cliente.endereco}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      cliente.tipo === 'pessoa_juridica' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {cliente.tipo === 'pessoa_juridica' ? 'PJ' : 'PF'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editarCliente(cliente)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => excluirCliente(cliente.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderServicos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Serviços</h2>
        <button
          onClick={() => setShowServicoForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {showServicoForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingItem ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={servicoForm.nome}
                onChange={(e) => setServicoForm({...servicoForm, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade</label>
              <select
                value={servicoForm.unidade}
                onChange={(e) => setServicoForm({...servicoForm, unidade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="m²">m² (metro quadrado)</option>
                <option value="m³">m³ (metro cúbico)</option>
                <option value="ml">ml (metro linear)</option>
                <option value="unidade">unidade</option>
                <option value="hora">hora</option>
                <option value="dia">dia</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Base (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={servicoForm.valor_base}
                onChange={(e) => setServicoForm({...servicoForm, valor_base: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={servicoForm.descricao}
              onChange={(e) => setServicoForm({...servicoForm, descricao: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={salvarServico}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={resetServicoForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicos.map((servico) => (
                <tr key={servico.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{servico.nome}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">{servico.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">R$ {servico.valor_base.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {servico.unidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setServicoForm(servico);
                        setEditingItem(servico);
                        setShowServicoForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Tem certeza que deseja excluir este serviço?')) {
                          try {
                            await servicoService.delete(servico.id);
                            setServicos(servicos.filter(s => s.id !== servico.id));
                          } catch (error) {
                            console.error('Erro ao excluir serviço:', error);
                            alert('Erro ao excluir serviço. Verifique sua conexão.');
                          }
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderViaticos = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Controle de Viáticos</h2>
        <button
          onClick={() => setShowViaticoForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Viático</span>
        </button>
      </div>

      {showViaticoForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingItem ? 'Editar Viático' : 'Novo Viático'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
              <input
                type="date"
                value={viaticoForm.data}
                onChange={(e) => setViaticoForm({...viaticoForm, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
              <input
                type="text"
                value={viaticoForm.destino}
                onChange={(e) => setViaticoForm({...viaticoForm, destino: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distância (km)</label>
              <input
                type="number"
                value={viaticoForm.distancia}
                onChange={(e) => setViaticoForm({...viaticoForm, distancia: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Combustível (R$)</label>
              <input
                type="number"
                step="0.01"
                value={viaticoForm.combustivel}
                onChange={(e) => setViaticoForm({...viaticoForm, combustivel: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pedágio (R$)</label>
              <input
                type="number"
                step="0.01"
                value={viaticoForm.pedagio}
                onChange={(e) => setViaticoForm({...viaticoForm, pedagio: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alimentação (R$)</label>
              <input
                type="number"
                step="0.01"
                value={viaticoForm.alimentacao}
                onChange={(e) => setViaticoForm({...viaticoForm, alimentacao: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospedagem (R$)</label>
              <input
                type="number"
                step="0.01"
                value={viaticoForm.hospedagem}
                onChange={(e) => setViaticoForm({...viaticoForm, hospedagem: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Outros (R$)</label>
              <input
                type="number"
                step="0.01"
                value={viaticoForm.outros}
                onChange={(e) => setViaticoForm({...viaticoForm, outros: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={viaticoForm.observacoes}
              onChange={(e) => setViaticoForm({...viaticoForm, observacoes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={salvarViatico}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={resetViaticoForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distância</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {viaticos.map((viatico) => {
                const total = viatico.combustivel + viatico.pedagio + viatico.alimentacao + viatico.hospedagem + viatico.outros;
                return (
                  <tr key={viatico.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(viatico.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{viatico.destino}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {viatico.distancia} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Combustível: R$ {viatico.combustivel.toFixed(2)}</div>
                      <div>Pedágio: R$ {viatico.pedagio.toFixed(2)}</div>
                      <div>Alimentação: R$ {viatico.alimentacao.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setViaticoForm(viatico);
                          setEditingItem(viatico);
                          setShowViaticoForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm('Tem certeza que deseja excluir este viático?')) {
                            try {
                              await viaticoService.delete(viatico.id);
                              setViaticos(viaticos.filter(v => v.id !== viatico.id));
                            } catch (error) {
                              console.error('Erro ao excluir viático:', error);
                              alert('Erro ao excluir viático. Verifique sua conexão.');
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCalculadora = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Calculadora de Custos Completa</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Cálculo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Parâmetros do Projeto</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                <input
                  type="number"
                  value={calculadoraCusto.area}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, area: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                <select
                  value={calculadoraCusto.servicoId}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, servicoId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map(servico => (
                    <option key={servico.id} value={servico.id}>
                      {servico.nome} - R$ {servico.valor_base.toFixed(2)}/{servico.unidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distância (km)</label>
                <input
                  type="number"
                  value={calculadoraCusto.distanciaKm}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, distanciaKm: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Combustível (R$/L)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculadoraCusto.valorCombustivel}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, valorCombustivel: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consumo Veículo (km/L)</label>
                <input
                  type="number"
                  value={calculadoraCusto.consumoVeiculo}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, consumoVeiculo: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pedágio (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculadoraCusto.pedagio}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, pedagio: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alimentação (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculadoraCusto.alimentacao}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, alimentacao: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospedagem (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={calculadoraCusto.hospedagem}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, hospedagem: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margem de Lucro (%)</label>
                <input
                  type="number"
                  value={calculadoraCusto.margem}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, margem: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Impostos (%)</label>
                <input
                  type="number"
                  value={calculadoraCusto.impostos}
                  onChange={(e) => setCalculadoraCusto({...calculadoraCusto, impostos: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Resultado do Cálculo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resultado do Orçamento</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Custo do Serviço:</span>
              <span className="text-lg font-bold text-green-600">R$ {custos.custoServico.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Custo de Viáticos:</span>
              <span className="text-lg font-bold text-yellow-600">R$ {custos.custoViatico.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Margem de Lucro ({calculadoraCusto.margem}%):</span>
              <span className="text-lg font-bold text-blue-600">R$ {custos.margem.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Impostos ({calculadoraCusto.impostos}%):</span>
              <span className="text-lg font-bold text-red-600">R$ {custos.impostos.toFixed(2)}</span>
            </div>
            
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                <span className="text-lg font-bold text-gray-700">VALOR TOTAL:</span>
                <span className="text-2xl font-bold text-gray-900">R$ {custos.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Detalhamento dos Viáticos:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Combustível: R$ {((calculadoraCusto.distanciaKm * 2) / calculadoraCusto.consumoVeiculo * calculadoraCusto.valorCombustivel).toFixed(2)}</div>
                <div>Pedágio: R$ {calculadoraCusto.pedagio.toFixed(2)}</div>
                <div>Alimentação: R$ {calculadoraCusto.alimentacao.toFixed(2)}</div>
                <div>Hospedagem: R$ {calculadoraCusto.hospedagem.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'clientes', name: 'Clientes', icon: Users },
    { id: 'servicos', name: 'Serviços', icon: FileText },
    { id: 'viaticos', name: 'Viáticos', icon: Car },
    { id: 'calculadora', name: 'Calculadora', icon: Calculator },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão</h1>
                <p className="text-green-600 font-medium">Verde Oeste Hidrosemeadura</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cascavel e Região Oeste</p>
              <p className="text-sm text-gray-600">Paraná - Brasil</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'clientes' && renderClientes()}
        {activeTab === 'servicos' && renderServicos()}
        {activeTab === 'viaticos' && renderViaticos()}
        {activeTab === 'calculadora' && renderCalculadora()}
      </main>
    </div>
  );
}