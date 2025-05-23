import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import { useFinance } from "@/contexts/FinanceContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReceivableForm from "@/components/receivables/ReceivableForm";
import { ReceivableAccount } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function Receivables() {
  const { 
    receivableAccounts, 
    categories, 
    clientsSuppliers, 
    loading, 
    updateReceivableAccount, 
    deleteReceivableAccount,
    addTransaction,
    deleteTransaction,
    transactions
  } = useFinance();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReceivable, setEditingReceivable] = useState<ReceivableAccount | null>(null);
  const { toast } = useToast();

  const clients = clientsSuppliers.filter(cs => cs.type === 'cliente');
  const revenueCategories = categories.filter(cat => cat.type === 'receita');

  const handleEdit = (receivable: ReceivableAccount) => {
    setEditingReceivable(receivable);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta a receber?')) {
      await deleteReceivableAccount(id);
    }
  };

  const handleMarkAsReceived = async (receivable: ReceivableAccount) => {
    try {
      // First check if a transaction for this receivable already exists
      const existingTransaction = transactions.find(
        t => t.sourceType === 'receivable' && t.sourceId === receivable.id
      );
      
      if (existingTransaction) {
        // If a transaction already exists, just update the receivable status
        await updateReceivableAccount(receivable.id, {
          isReceived: true,
          receivedDate: new Date()
        });
        
        toast({
          title: "Status atualizado",
          description: "A conta foi marcada como recebida."
        });
      } else {
        // Atualiza a conta para recebida PRIMEIRO
        const receivedDate = new Date();
        await updateReceivableAccount(receivable.id, {
          isReceived: true,
          receivedDate
        });
        
        // Cria um lançamento correspondente a este recebimento APENAS se não existir
        // Garantir que o valor seja passado corretamente sem conversões desnecessárias
        await addTransaction({
          type: 'receita',
          clientSupplierId: receivable.clientId,
          categoryId: receivable.categoryId,
          value: Number(receivable.value), // Garantir conversão para número
          paymentDate: receivedDate,
          observations: receivable.observations,
          sourceType: 'receivable',
          sourceId: receivable.id
        });
        
        toast({
          title: "Recebimento registrado",
          description: "O recebimento foi registrado e adicionado aos lançamentos."
        });
      }
    } catch (error) {
      console.error('Erro ao registrar recebimento:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o recebimento.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsNotReceived = async (receivable: ReceivableAccount) => {
    try {
      // Marca a conta como não recebida
      await updateReceivableAccount(receivable.id, {
        isReceived: false,
        receivedDate: undefined
      });
      
      // Encontra e remove o lançamento correspondente
      const relatedTransaction = transactions.find(
        t => t.sourceType === 'receivable' && t.sourceId === receivable.id
      );
      
      if (relatedTransaction) {
        await deleteTransaction(relatedTransaction.id);
        toast({
          title: "Status atualizado",
          description: "A conta foi marcada como não recebida e o lançamento foi removido."
        });
      } else {
        toast({
          title: "Status atualizado",
          description: "A conta foi marcada como não recebida."
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do recebimento.",
        variant: "destructive"
      });
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getCategoryName = (categoryId: string) => {
    const category = revenueCategories.find(c => c.id === categoryId);
    return category?.name || 'Categoria não encontrada';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (receivable: ReceivableAccount) => {
    if (receivable.isReceived) {
      return <Badge variant="default" className="bg-green-500">Recebido</Badge>;
    }
    
    const today = new Date();
    const dueDate = new Date(receivable.dueDate);
    
    if (dueDate < today) {
      return <Badge variant="destructive">⚠️ Vencido</Badge>;
    } else if (dueDate.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000) {
      return <Badge variant="secondary" className="bg-yellow-500 text-white">Vence em breve</Badge>;
    } else {
      return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingReceivable(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tertiary">Contas a Receber</h1>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-tertiary">Contas a Receber</h1>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Conta a Receber
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          {receivableAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma conta a receber cadastrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receivableAccounts.map((receivable) => (
                  <TableRow key={receivable.id}>
                    <TableCell className="font-medium">
                      {getClientName(receivable.clientId)}
                    </TableCell>
                    <TableCell>{getCategoryName(receivable.categoryId)}</TableCell>
                    <TableCell>{formatCurrency(receivable.value)}</TableCell>
                    <TableCell>
                      {format(new Date(receivable.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{getStatusBadge(receivable)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {receivable.installmentType === 'unico' && 'Único'}
                        {receivable.installmentType === 'parcelado' && 'Parcelado'}
                        {receivable.installmentType === 'recorrente' && 'Recorrente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!receivable.isReceived ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsReceived(receivable)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsNotReceived(receivable)}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(receivable)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(receivable.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isFormOpen && (
        <ReceivableForm
          receivable={editingReceivable}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingReceivable(null);
          }}
        />
      )}
    </div>
  );
}
