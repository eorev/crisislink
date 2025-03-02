
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import { Building, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createShelter } from '@/lib/supabase/shelters';

// Create a schema for form validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Shelter name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Please provide a valid address.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
  occupancy: z.coerce.number().min(0, {
    message: "Occupancy cannot be negative.",
  }).optional(),
  phone: z.string().min(10, {
    message: "Please provide a valid phone number.",
  }),
  status: z.enum(["operational", "limited", "closed"], {
    message: "Please select a valid status.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddShelterDialogProps {
  onShelterAdded: () => void;
}

const AddShelterDialog: React.FC<AddShelterDialogProps> = ({ onShelterAdded }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      capacity: 100,
      occupancy: 0,
      phone: "",
      status: "operational",
    },
  });

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create new shelter in the database
      await createShelter({
        name: values.name,
        address: values.address,
        capacity: values.capacity,
        current_occupancy: values.occupancy || 0,
        contact_phone: values.phone,
        status: values.status,
        // Add the missing last_updated field
        last_updated: new Date().toISOString(),
        // Add default resources based on capacity
        resources_available: ["Food", "Water", "Medical"]
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);

      // Notify parent component that a shelter was added
      onShelterAdded();
      toast.success("Shelter added successfully!");
    } catch (error) {
      console.error("Error adding shelter:", error);
      toast.error("Failed to add shelter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Shelter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Shelter</DialogTitle>
          <DialogDescription>
            Enter the details for the new disaster relief shelter.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Community Center" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormDescription>Maximum number of people</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupancy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Occupancy</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>Current number of people</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="operational" />
                        </FormControl>
                        <FormLabel className="font-normal text-green-600">
                          Operational
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="limited" />
                        </FormControl>
                        <FormLabel className="font-normal text-amber-600">
                          Limited
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-1 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="closed" />
                        </FormControl>
                        <FormLabel className="font-normal text-red-600">
                          Closed
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Shelter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddShelterDialog;
