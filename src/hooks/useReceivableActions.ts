
import { useToast } from "@/hooks/use-toast";
import { useFinance } from "@/contexts/FinanceContext";
import { ReceivableAccount } from "@/types";

export function useReceivableActions() {
  const { 
    updateReceivableAccount, 
    deleteReceivableAccount,
    addTransaction,
    deleteTransaction,
    transactions
  } = useFinance();
  const { toast } = useToast();

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
        await addTransaction({
          type: 'receita',
          clientSupplierId: receivable.clientId,
          categoryId: receivable.categoryId,
          value: receivable.value, // Use the original value directly
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

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta a receber?')) {
      await deleteReceivableAccount(id);
    }
  };

  return {
    handleMarkAsReceived,
    handleMarkAsNotReceived,
    handleDelete
  };
}
