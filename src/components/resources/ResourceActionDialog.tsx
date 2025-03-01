
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateResource } from '@/lib/supabase/resources';
import type { Resource } from '@/lib/supabase/types';

interface ResourceActionDialogProps {
  resourceId: number;
  resourceName: string;
  totalAmount: number;
  unit: string;
  isAdding: boolean;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

const ResourceActionDialog = ({ 
  resourceId, 
  resourceName, 
  totalAmount,
  unit,
  isAdding,
  onSuccess,
  trigger 
}: ResourceActionDialogProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // For subtract, ensure we don't go below zero
    if (!isAdding && amount > totalAmount) {
      toast.error(`Cannot remove more than the available ${totalAmount} ${unit}`);
      return;
    }

    setIsLoading(true);
    try {
      // Calculate the new amount based on adding or subtracting
      const newAmount = isAdding 
        ? totalAmount + amount 
        : totalAmount - amount;
      
      await updateResource(resourceId, {
        total_amount: newAmount
      });
      
      toast.success(`Successfully ${isAdding ? 'added' : 'removed'} ${amount} ${unit} of ${resourceName}`);
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating resource:', error);
      toast.error(`Failed to ${isAdding ? 'add' : 'remove'} resource: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            {isAdding ? (
              <><PlusCircle className="h-4 w-4 mr-1" />Add</>
            ) : (
              <><MinusCircle className="h-4 w-4 mr-1" />Use</>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isAdding ? `Add ${resourceName}` : `Use ${resourceName}`}
            </DialogTitle>
            <DialogDescription>
              {isAdding 
                ? `Add additional ${unit} to your current supply` 
                : `Remove ${unit} from your current supply`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount:
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max={!isAdding ? totalAmount : undefined}
                value={amount || ''}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="col-span-3"
                placeholder={`Enter ${unit} amount`}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Current:</Label>
              <div className="col-span-3">
                <span className="font-medium">{totalAmount.toLocaleString()} {unit}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">After:</Label>
              <div className="col-span-3">
                <span className="font-medium">
                  {isAdding 
                    ? (totalAmount + (amount || 0)).toLocaleString()
                    : (totalAmount - (amount || 0) < 0 ? 0 : totalAmount - (amount || 0)).toLocaleString()
                  } {unit}
                </span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || amount <= 0 || (!isAdding && amount > totalAmount)}
              className={`${isAdding ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
              {isLoading ? 'Processing...' : isAdding ? 'Add Supply' : 'Use Supply'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceActionDialog;
