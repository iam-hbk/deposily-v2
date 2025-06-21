"use client";

import React from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { addClientFormSchema, AddClientFormValues } from "./add-client-form-schema";

interface AddClientFormProps {
  onSubmitAction: (values: AddClientFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void; // Optional cancel handler for dialogs
}

const paymentDays = [1, 15, 25, 30];

export function AddClientForm({ onSubmitAction, isSubmitting, onCancel }: AddClientFormProps) {
  const form = useForm<AddClientFormValues>({
    resolver: zodResolver(addClientFormSchema),
    defaultValues: {
      name: "",
      clientReference: "",
      expectedPaymentDay: 25, // Default to the 25th
    },
  });

  const handleFormSubmit = async (values: AddClientFormValues) => {
    await onSubmitAction(values);
    // Optionally reset form here if dialog stays open: form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<AddClientFormValues, 'name'> }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientReference"
          render={({ field }: { field: ControllerRenderProps<AddClientFormValues, 'clientReference'> }) => (
            <FormItem>
              <FormLabel>Client Reference</FormLabel>
              <FormControl>
                <Input placeholder="Enter client reference (e.g., INV-CLIENT001)" {...field} />
              </FormControl>
              <FormDescription>
                This reference is used to match payments from bank statements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedPaymentDay"
          render={({ field }: { field: ControllerRenderProps<AddClientFormValues, 'expectedPaymentDay'> }) => (
            <FormItem>
              <FormLabel>Expected Payment Day (Optional)</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value === "none" ? null : parseInt(value, 10));
                }}
                value={field.value?.toString() ?? "none"} // Use "none" instead of empty string
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem> 
                  {paymentDays.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The day of the month payment is typically expected.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Add Client
          </Button>
        </div>
      </form>
    </Form>
  );
} 