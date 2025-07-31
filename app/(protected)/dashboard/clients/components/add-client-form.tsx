"use client";

import React, { useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { addClientFormSchema, AddClientFormValues } from "./add-client-form-schema";

interface AddClientFormProps {
  onSubmitAction: (values: AddClientFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

const paymentDays = [1, 15, 25, 30];

function generateClientReference(name: string): string {  // Not sure about duplicate in the system
  const prefix = "INV";
  const sanitized = name.replace(/\s+/g, "").toUpperCase();
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${sanitized.slice(0, 6)}${rand}`;
}


export function AddClientForm({ onSubmitAction, isSubmitting, onCancel }: AddClientFormProps) {
  const form = useForm<AddClientFormValues>({
    resolver: zodResolver(addClientFormSchema),
    defaultValues: {
      name: "",
      clientReference: "",
      expectedPaymentDay: 25,
      autoGenerateRef: false,
    },
  });

  const { watch, setValue, control } = form;
  const name = watch("name");
  const autoGenerateRef = watch("autoGenerateRef");

  // Auto-generate client reference when name or toggle changes
  useEffect(() => {
    if (autoGenerateRef) {
      const generated = generateClientReference(name || "");
      setValue("clientReference", generated);
    }
  }, [name, autoGenerateRef, setValue]);

  const handleFormSubmit = async (values: AddClientFormValues) => {
    await onSubmitAction(values);
    // Optionally reset the form: form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
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
          control={control}
          name="clientReference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Reference</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter client reference (e.g., INV-CLIENT001)"
                  {...field}
                  disabled={autoGenerateRef}
                />
              </FormControl>
              <FormDescription>
                This reference is used to match payments from bank statements.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="autoGenerateRef"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Auto-generate client reference</FormLabel>
              <FormControl>
                <Switch
                  id="auto-generate-ref"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="expectedPaymentDay"
          render={({ field }: { field: ControllerRenderProps<AddClientFormValues, 'expectedPaymentDay'> }) => (
            <FormItem>
              <FormLabel>Expected Payment Day (Optional)</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value === "none" ? null : parseInt(value, 10));
                }}
                value={field.value?.toString() ?? "none"}
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
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Client
          </Button>
        </div>
      </form>
    </Form>
  );
}

